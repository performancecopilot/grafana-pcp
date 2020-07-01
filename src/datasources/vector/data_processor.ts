import {
    DataQueryRequest,
    MutableDataFrame,
    FieldType,
    MutableField,
    DataQueryResponseData,
    MISSING_VALUE,
    Labels as GrafanaLabels,
} from '@grafana/data';
import { VectorQuery, VectorQueryWithUrl, TargetFormat, Dict } from './types';
import { Metric, Endpoint, PollerQueryResult } from './poller';
import { InstanceId, pcpUnitToGrafanaUnit, Context, Labels, pcpTypeToGrafanaType } from './pcp';
import { mapValues, uniq } from 'lodash';
import { getTemplateSrv } from './utils';
import { applyTransformations } from './field_transformations';

function getLabels(context: Context, metric: Metric, instanceId: InstanceId | null): Labels {
    return {
        ...context.labels,
        ...metric.metadata.labels,
        ...metric.instanceDomain.labels,
        ...(instanceId != null && metric.instanceDomain.instances.has(instanceId!) ? metric.instanceDomain.instances.get(instanceId)!.labels : {}),
    };
}

function getLegendName(
    request: DataQueryRequest<VectorQuery>,
    target: VectorQueryWithUrl,
    endpoint: Endpoint,
    metric: Metric,
    instanceId: InstanceId | null,
    defaultFormatFn: (target: VectorQueryWithUrl, metric: Metric, instanceId: InstanceId | null) => string
) {
    if (target.legendFormat) {
        const vars: Dict<string, string> = {
            ...getLabels(endpoint.context!, metric, instanceId),
            metric: target.expr,
            ...(target.expr === metric.metadata.name ? { metric0: metric.metadata.name.split('.')[0] } : {}),
        };
        if (instanceId != null && metric.instanceDomain.instances.has(instanceId)) {
            vars['instance'] = metric.instanceDomain.instances.get(instanceId)!.name;
        }

        return getTemplateSrv().replace(target.legendFormat, {
            ...mapValues(vars, val => ({ value: val })),
            ...request.scopedVars,
        });
    } else {
        return defaultFormatFn(target, metric, instanceId);
    }
}

function getFieldMetadata(result: Required<PollerQueryResult>, instanceValue: InstanceId | null) {
    return {
        type: pcpTypeToGrafanaType(result.metric.metadata),
        config: { unit: pcpUnitToGrafanaUnit(result.metric.metadata) },
        labels: getLabels(result.endpoint.context!, result.metric, instanceValue) as GrafanaLabels,
    };
}

function toDataFrame(request: DataQueryRequest<VectorQuery>, result: Required<PollerQueryResult>) {
    const requestRangeFromMs = request.range?.from.valueOf()!;
    const requestRangeToMs = request.range?.to.valueOf()!;

    const dataFrame = new MutableDataFrame();
    const timeField = dataFrame.addField({ name: 'Time', type: FieldType.time });
    const instanceIdToField = new Map<InstanceId | null, MutableField>();
    for (const snapshot of result.metric.values) {
        if (!(requestRangeFromMs <= snapshot.timestampMs && (!request.endTime || snapshot.timestampMs <= requestRangeToMs))) {
            continue;
        }

        // create all dataFrame fields in one go, because Grafana automatically matches
        // the vector length of newly created fields with already existing fields by adding empty data
        for (const instanceValue of snapshot.values) {
            if (!instanceIdToField.has(instanceValue.instance)) {
                instanceIdToField.set(
                    instanceValue.instance,
                    dataFrame.addField({
                        name: instanceValue.instance != null ? instanceValue.instance.toString() : '',
                        ...getFieldMetadata(result, instanceValue.instance),
                    })
                );
            }
        }

        timeField.values.add(snapshot.timestampMs);
        for (const instanceValue of snapshot.values) {
            let field = instanceIdToField.get(instanceValue.instance)!;
            field.values.add(instanceValue.value);
        }
    }
    return dataFrame;
}

function defaultVectorLegend(target: VectorQueryWithUrl, metric: Metric, instanceId: InstanceId | null) {
    if (instanceId != null && instanceId in metric.instanceDomain.instances) {
        return metric.instanceDomain.instances[instanceId].name;
    } else {
        return target.expr;
    }
}

function toTimeSeries(
    request: DataQueryRequest<VectorQuery>,
    target: VectorQueryWithUrl,
    endpoint: Endpoint,
    metric: Metric,
    dataFrame: MutableDataFrame
) {
    for (const field of dataFrame.fields) {
        if (field.type === FieldType.time) {
            continue;
        }

        const instanceId = field.name === '' ? null : parseInt(field.name, 10);
        field.name = getLegendName(request, target, endpoint, metric, instanceId, defaultVectorLegend);
    }
    return dataFrame;
}

function toHeatMap(dataFrame: MutableDataFrame) {
    for (const field of dataFrame.fields) {
        if (field.type === FieldType.time) {
            continue;
        }

        // target name is the upper bound
        const match = field.name.match(/^(.+?)\-(.+?)$/);
        if (match) {
            field.name = match[2];
        }
    }

    const timeVector = dataFrame.values['Time'];
    for (let i = 0; i < timeVector.length; i++) {
        // round timestamps to one second, the heatmap panel calculates the x-axis size accordingly
        timeVector.set(i, Math.floor(timeVector.get(i) / 1000) * 1000);
    }
    return dataFrame;
}

function defaultMetricsTableHeader(target: VectorQueryWithUrl, metric: Metric, instanceId: InstanceId | null) {
    if (target.expr === metric.metadata.name) {
        const metricSpl = metric.metadata.name.split('.');
        return metricSpl[metricSpl.length - 1];
    } else {
        return target.expr;
    }
}

function toMetricsTable(request: DataQueryRequest<VectorQuery>, results: Array<Required<PollerQueryResult>>) {
    // can't use toDataFrame() - we want the instances of the *last* value only
    // TODO: applyTransformations
    const tableDataFrame = new MutableDataFrame();
    let instances: Array<number | null> = [];
    for (const result of results) {
        tableDataFrame
            .addField({
                name: getLegendName(request, result.target, result.endpoint, result.metric, null, defaultMetricsTableHeader),
                ...getFieldMetadata(result, null),
            })
            .values.set(0, 5);

        if (result.metric.values.length > 0) {
            instances.push(...result.metric.values[result.metric.values.length - 1].values.map(instanceValue => instanceValue.instance));
        }
    }
    instances = uniq(instances);

    // every instance is a row
    for (const instance of instances) {
        // first result (target) == first tableDataFrame.field, etc.
        let fieldIdx = 0;
        for (const result of results) {
            if (result.metric.values.length === 0) {
                continue;
            }

            const lastSnapshot = result.metric.values[result.metric.values.length - 1].values;
            const instanceValue = lastSnapshot.find(instanceValue => instanceValue.instance === instance);
            if (instanceValue) {
                tableDataFrame.fields[fieldIdx].values.add(instanceValue.value);
            } else {
                tableDataFrame.fields[fieldIdx].values.add(MISSING_VALUE);
            }
            fieldIdx++;
        }
    }
    return tableDataFrame;
}

export function processTargets(request: DataQueryRequest<VectorQuery>, results: Array<Required<PollerQueryResult>>): DataQueryResponseData[] {
    if (results.length === 0) {
        return [];
    }

    const format = results[0].target.format;
    if (format === TargetFormat.TimeSeries) {
        return results.map(result => {
            const dataFrame = applyTransformations(format, result.metric.metadata, toDataFrame(request, result));
            return toTimeSeries(request, result.target, result.endpoint, result.metric, dataFrame);
        });
    } else if (format === TargetFormat.Heatmap) {
        return results.map(result => toHeatMap(applyTransformations(format, result.metric.metadata, toDataFrame(request, result))));
    } else if (format === TargetFormat.MetricsTable) {
        return [toMetricsTable(request, results)];
    } else {
        throw { message: `Invalid target format '${format}'.` };
    }
}
