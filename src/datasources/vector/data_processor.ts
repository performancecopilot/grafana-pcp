import {
    DataQueryRequest,
    MutableDataFrame,
    FieldType,
    MutableField,
    DataQueryResponseData,
    Labels as GrafanaLabels,
    Field,
    MISSING_VALUE,
} from '@grafana/data';
import { VectorQuery, TargetFormat, Dict } from './types';
import { Metric, QueryResult } from './poller';
import { InstanceId, pcpUnitToGrafanaUnit, Context, Labels, pcpTypeToGrafanaType, InstanceName } from './pcp';
import { mapValues, uniq } from 'lodash';
import { getTemplateSrv } from './utils';
import { applyTransformations } from './field_transformations';

function getLabels(context: Context, metric: Metric, instanceId: InstanceId | null): Labels {
    return {
        ...context.labels,
        ...metric.metadata.labels,
        ...metric.instanceDomain.labels,
        ...(instanceId != null && metric.instanceDomain.instances.has(instanceId)
            ? metric.instanceDomain.instances.get(instanceId)!.labels
            : {}),
    };
}

function applyLegendFormat(request: DataQueryRequest<VectorQuery>, result: QueryResult, instanceId: InstanceId | null) {
    const metric = result.target.metric;
    const vars: Dict<string, string> = {
        ...getLabels(result.endpoint.context, metric, instanceId),
        metric: result.query.expr,
    };
    if (!result.target.isDerivedMetric) {
        const spl = metric.metadata.name.split('.');
        vars['metric0'] = spl[spl.length - 1];
    }
    if (instanceId != null && metric.instanceDomain.instances.has(instanceId)) {
        vars['instance'] = metric.instanceDomain.instances.get(instanceId)!.name;
    }

    return getTemplateSrv().replace(result.query.legendFormat, {
        ...mapValues(vars, val => ({ value: val })),
        ...request.scopedVars,
    });
}

function getLegendName(
    request: DataQueryRequest<VectorQuery>,
    result: QueryResult,
    instanceId: InstanceId | null,
    defaultLegend: (
        request: DataQueryRequest<VectorQuery>,
        result: QueryResult,
        instanceId: InstanceId | null
    ) => string
) {
    if (result.query.legendFormat) {
        return applyLegendFormat(request, result, instanceId);
    } else {
        return defaultLegend(request, result, instanceId);
    }
}

function defaultTimeSeriesLegend(
    request: DataQueryRequest<VectorQuery>,
    result: QueryResult,
    instanceId: InstanceId | null
) {
    if (instanceId != null && result.target.metric.instanceDomain.instances.has(instanceId)) {
        return result.target.metric.instanceDomain.instances.get(instanceId)!.name;
    } else {
        return result.target.isDerivedMetric ? result.query.expr : result.target.metric.metadata.name;
    }
}

function defaultHeatmapLegend(
    request: DataQueryRequest<VectorQuery>,
    result: QueryResult,
    instanceId: InstanceId | null
) {
    // target name is the upper bound
    const instanceName = result.target.metric.instanceDomain.instances.get(instanceId!)?.name;
    if (instanceName) {
        const match = instanceName.match(/^(.+?)\-(.+?)$/);
        if (match) {
            return match[2];
        }
    }
    return '-';
}

function defaultMetricsTableHeader(
    request: DataQueryRequest<VectorQuery>,
    result: QueryResult,
    instanceId: InstanceId | null
) {
    if (result.target.isDerivedMetric) {
        return result.query.expr;
    } else {
        const metricSpl = result.target.metric.metadata.name.split('.');
        return metricSpl[metricSpl.length - 1];
    }
}

function getFieldMetadata(
    result: QueryResult,
    instanceId: InstanceId | null,
    instanceName: InstanceName | null
): Partial<Field> {
    return {
        type: pcpTypeToGrafanaType(result.target.metric.metadata),
        config: {
            unit: pcpUnitToGrafanaUnit(result.target.metric.metadata),
            custom: {
                instanceId,
                instanceName,
            },
        },
        labels: getLabels(result.endpoint.context, result.target.metric, instanceId) as GrafanaLabels,
    };
}

function toDataFrame(request: DataQueryRequest<VectorQuery>, result: QueryResult) {
    const requestRangeFromMs = request.range?.from.valueOf()!;
    const requestRangeToMs = request.range?.to.valueOf()!;

    const dataFrame = new MutableDataFrame();
    const timeField = dataFrame.addField({ name: 'Time', type: FieldType.time });
    const instanceIdToField = new Map<InstanceId | null, MutableField>();
    for (const snapshot of result.target.metric.values) {
        if (
            !(
                requestRangeFromMs <= snapshot.timestampMs &&
                (!request.endTime || snapshot.timestampMs <= requestRangeToMs)
            )
        ) {
            continue;
        }

        // create all dataFrame fields in one go, because Grafana automatically matches
        // the vector length of newly created fields with already existing fields by adding empty data
        for (const instanceValue of snapshot.values) {
            if (!instanceIdToField.has(instanceValue.instance)) {
                let fieldName = result.target.isDerivedMetric ? result.query.expr : result.target.metric.metadata.name;
                let instanceName: InstanceName | null = null;
                if (instanceValue.instance !== null) {
                    instanceName =
                        result.target.metric.instanceDomain.instances.get(instanceValue.instance)?.name || null;
                    if (instanceName) {
                        fieldName += `[${instanceName}]`;
                    }
                }

                instanceIdToField.set(
                    instanceValue.instance,
                    dataFrame.addField({
                        name: fieldName,
                        ...getFieldMetadata(result, instanceValue.instance, instanceName),
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

function toTimeSeries(request: DataQueryRequest<VectorQuery>, result: QueryResult, dataFrame: MutableDataFrame) {
    for (const field of dataFrame.fields) {
        if (field.type === FieldType.time) {
            continue;
        }
        field.config.displayName = getLegendName(
            request,
            result,
            field.config.custom.instanceId,
            defaultTimeSeriesLegend
        );
    }
    return dataFrame;
}

function toHeatMap(request: DataQueryRequest<VectorQuery>, result: QueryResult, dataFrame: MutableDataFrame) {
    for (const field of dataFrame.fields) {
        if (field.type === FieldType.time) {
            continue;
        }
        field.config.displayName = getLegendName(request, result, field.config.custom.instanceId, defaultHeatmapLegend);
    }

    const timeVector = dataFrame.values['Time'];
    for (let i = 0; i < timeVector.length; i++) {
        // round timestamps to one second, the heatmap panel calculates the x-axis size accordingly
        timeVector.set(i, Math.floor(timeVector.get(i) / 1000) * 1000);
    }
    return dataFrame;
}

function toMetricsTable(
    request: DataQueryRequest<VectorQuery>,
    dataFrameAndResults: Array<{ result: QueryResult; dataFrame: MutableDataFrame }>
) {
    const tableDataFrame = new MutableDataFrame();
    let instances: Array<number | null> = [];
    for (const { result } of dataFrameAndResults) {
        tableDataFrame.addField({
            name: getLegendName(request, result, null, defaultMetricsTableHeader),
            ...getFieldMetadata(result, null, null),
        });

        // metric.instanceDomain contains all instances ever recorded
        // use the last snapshot of metric.values to get only the current instances
        if (result.target.metric.values.length > 0) {
            instances.push(
                ...result.target.metric.values[result.target.metric.values.length - 1].values.map(
                    instanceValue => instanceValue.instance
                )
            );
        }
    }
    instances = uniq(instances);

    /**
     * table is filled row-by-row
     * outer loop loops over table rows (instances)
     * inner loop loops over table columns (metrics), and writes the last value of the specific instance of a metric
     */
    for (const instanceId of instances) {
        let fieldIdx = 0;

        for (const { dataFrame } of dataFrameAndResults) {
            const field = dataFrame.fields.find(
                field => field.type !== FieldType.time && field.config.custom.instanceId === instanceId
            );
            if (field) {
                const lastValue = field.values.get(field.values.length - 1);
                tableDataFrame.fields[fieldIdx].values.add(lastValue);
            } else {
                tableDataFrame.fields[fieldIdx].values.add(MISSING_VALUE);
            }
            fieldIdx++;
        }
    }
    return tableDataFrame;
}

export function processTargets(
    request: DataQueryRequest<VectorQuery>,
    results: QueryResult[]
): DataQueryResponseData[] {
    if (results.length === 0) {
        return [];
    }

    const format = results[0].query.format;
    if (format === TargetFormat.TimeSeries) {
        return results.map(result => {
            const dataFrame = applyTransformations(format, result.target.metric.metadata, toDataFrame(request, result));
            return toTimeSeries(request, result, dataFrame);
        });
    } else if (format === TargetFormat.Heatmap) {
        return results.map(result => {
            const dataFrame = applyTransformations(format, result.target.metric.metadata, toDataFrame(request, result));
            return toHeatMap(request, result, dataFrame);
        });
    } else if (format === TargetFormat.MetricsTable) {
        const dataFrameAndResults = results.map(result => ({
            result,
            dataFrame: applyTransformations(format, result.target.metric.metadata, toDataFrame(request, result)),
        }));
        return [toMetricsTable(request, dataFrameAndResults)];
    } else {
        throw { message: `Invalid target format '${format}'.` };
    }
}
