import {
    DataQueryRequest,
    MutableDataFrame,
    FieldType,
    MutableField,
    Labels as GrafanaLabels,
    Field,
    MISSING_VALUE,
    DataFrame,
} from '@grafana/data';
import { TargetFormat } from './types';
import { QueryResult } from './poller';
import { pcpUnitToGrafanaUnit, pcpTypeToGrafanaType } from './pcp';
import { mapValues, every, isString } from 'lodash';
import { applyTransformations } from './field_transformations';
import { getTemplateSrv } from '@grafana/runtime';
import { InstanceId, Labels, InstanceName, Semantics, Metric } from '../../lib/models/pcp/pcp';
import { PmapiContext } from './pmapi';

function getLabels(metric: Metric, instanceId: InstanceId | null, context?: PmapiContext): Labels {
    let labels = {
        ...context?.labels,
        ...metric.metadata.labels,
        ...metric.instanceDomain.labels,
    };
    if (instanceId != null && instanceId in metric.instanceDomain.instances) {
        Object.assign(labels, metric.instanceDomain.instances[instanceId]!.labels);
    }
    return labels;
}

function getLegendName(
    request: DataQueryRequest,
    result: QueryResult,
    metric: Metric,
    instanceId: InstanceId | null,
    defaultLegend: (result: QueryResult, metric: Metric, instanceId: InstanceId | null) => string
) {
    if (!result.target.query.legendFormat) {
        return defaultLegend(result, metric, instanceId);
    }

    const vars = getLabels(metric, instanceId, result.endpoint.context);
    if (result.target.custom?.isDerivedMetric) {
        vars['metric'] = result.target.query.expr;
    } else {
        const spl = metric.metadata.name.split('.');
        vars['metric'] = metric.metadata.name;
        vars['metric0'] = spl[spl.length - 1];
    }

    if (instanceId != null && instanceId in metric.instanceDomain.instances) {
        vars['instance'] = metric.instanceDomain.instances[instanceId]!.name;
    }

    return getTemplateSrv().replace(result.target.query.legendFormat, {
        ...mapValues(vars, value => ({ text: value, value })),
        ...request.scopedVars,
    });
}

function defaultTimeSeriesLegend(result: QueryResult, metric: Metric, instanceId: InstanceId | null) {
    if (instanceId != null && instanceId in metric.instanceDomain.instances) {
        return metric.instanceDomain.instances[instanceId]!.name;
    } else {
        return result.target.custom?.isDerivedMetric ? result.target.query.expr : metric.metadata.name;
    }
}

function defaultHeatmapLegend(result: QueryResult, metric: Metric, instanceId: InstanceId | null) {
    // target name is the upper bound
    const instanceName = metric.instanceDomain.instances[instanceId!]?.name;
    if (instanceName) {
        const match = instanceName.match(/^(.+?)\-(.+?)$/);
        if (match) {
            return match[2];
        }
    }
    return '-';
}

function defaultMetricsTableHeader(result: QueryResult, metric: Metric, instanceId: InstanceId | null) {
    if (result.target.custom?.isDerivedMetric) {
        return result.target.query.expr;
    } else {
        const metricSpl = metric.metadata.name.split('.');
        return metricSpl[metricSpl.length - 1];
    }
}

function getFieldMetadata(
    result: QueryResult,
    metric: Metric,
    instanceId: InstanceId | null,
    instanceName?: InstanceName
): Partial<Field> {
    return {
        type: pcpTypeToGrafanaType(metric.metadata),
        config: {
            unit: pcpUnitToGrafanaUnit(metric.metadata),
            custom: {
                instanceId,
                instanceName,
            },
        },
        labels: getLabels(metric, instanceId, result.endpoint.context) as GrafanaLabels,
    };
}

export function toDataFrame(request: DataQueryRequest, result: QueryResult, metric: Metric, sampleIntervalSec: number) {
    let requestRangeFromMs = request.range?.from.valueOf()!;
    let requestRangeToMs = request.range?.to.valueOf()!;

    // fill the graph by requesting more data (+/- 1 interval)
    requestRangeFromMs -= sampleIntervalSec * 1000;
    requestRangeToMs += sampleIntervalSec * 1000;

    // the first value of a counter metric is lost due to rate conversation
    if (metric.metadata.sem === Semantics.Counter) {
        requestRangeFromMs -= sampleIntervalSec * 1000;
    }

    const dataFrame = new MutableDataFrame();
    const timeField = dataFrame.addField({ name: 'Time', type: FieldType.time });
    const instanceIdToField = new Map<InstanceId | null, MutableField>();
    for (const snapshot of metric.values) {
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
                let fieldName = result.target.custom?.isDerivedMetric ? result.target.query.expr : metric.metadata.name;
                let instanceName: InstanceName | undefined;
                if (instanceValue.instance !== null) {
                    instanceName = metric.instanceDomain.instances[instanceValue.instance]?.name;
                    if (instanceName) {
                        fieldName += `[${instanceName}]`;
                    }
                }

                instanceIdToField.set(
                    instanceValue.instance,
                    dataFrame.addField({
                        name: fieldName,
                        ...getFieldMetadata(result, metric, instanceValue.instance, instanceName),
                    })
                );
            }
        }

        timeField.values.add(snapshot.timestampMs);
        for (const instanceValue of snapshot.values) {
            let field = instanceIdToField.get(instanceValue.instance)!;
            field.values.add(instanceValue.value);
        }

        // some instance existed previously but disappeared -> fill field with MISSING_VALUE
        for (const field of instanceIdToField.values()) {
            if (field.values.length !== timeField.values.length) {
                field.values.add(MISSING_VALUE);
            }
        }
    }
    return dataFrame;
}

function toTimeSeries(request: DataQueryRequest, result: QueryResult, metric: Metric, dataFrame: MutableDataFrame) {
    for (const field of dataFrame.fields) {
        if (field.type === FieldType.time) {
            continue;
        }
        field.config.displayName = getLegendName(
            request,
            result,
            metric,
            field.config.custom.instanceId,
            defaultTimeSeriesLegend
        );
    }
    return dataFrame;
}

function toHeatMap(request: DataQueryRequest, result: QueryResult, metric: Metric, dataFrame: MutableDataFrame) {
    for (const field of dataFrame.fields) {
        if (field.type === FieldType.time) {
            continue;
        }
        field.config.displayName = getLegendName(
            request,
            result,
            metric,
            field.config.custom.instanceId,
            defaultHeatmapLegend
        );
    }

    const timeVector = dataFrame.values['Time'];
    for (let i = 0; i < timeVector.length; i++) {
        // round timestamps to one second, the heatmap panel calculates the x-axis size accordingly
        timeVector.set(i, Math.floor(timeVector.get(i) / 1000) * 1000);
    }
    return dataFrame;
}

function toMetricsTable(
    request: DataQueryRequest,
    dataFrameAndResults: Array<{ result: QueryResult; dataFrame: MutableDataFrame; metric: Metric }>
) {
    const tableDataFrame = new MutableDataFrame();
    tableDataFrame.addField({
        name: 'instance',
    });

    let instanceNames: Map<InstanceId | null, string> = new Map();
    for (const { result, metric } of dataFrameAndResults) {
        tableDataFrame.addField({
            name: result.target.custom?.isDerivedMetric ? result.target.query.expr : metric.metadata.name,
            ...getFieldMetadata(result, metric, null),
            config: {
                displayName: getLegendName(request, result, metric, null, defaultMetricsTableHeader),
            },
        });

        // metric.instanceDomain contains all instances ever recorded
        // use the last snapshot of metric.values to get only the current instances
        if (metric.values.length > 0) {
            const instanceIds = metric.values[metric.values.length - 1].values.map(
                instanceValue => instanceValue.instance
            );
            for (const instanceId of instanceIds) {
                if (!instanceNames.has(instanceId)) {
                    let instanceName: InstanceName | undefined;
                    if (instanceId !== null) {
                        instanceName = metric.instanceDomain.instances[instanceId]?.name;
                    }
                    instanceNames.set(instanceId, instanceName ?? '');
                }
            }
        }
    }

    /**
     * table is filled row-by-row
     * outer loop loops over table rows (instances)
     * inner loop loops over table columns (metrics), and writes the last value of the specific instance of a metric
     */
    for (const [instanceId, instanceName] of instanceNames.entries()) {
        let fieldIdx = 0;
        tableDataFrame.fields[fieldIdx].values.add(instanceName);
        fieldIdx++;

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

function* parseCsvLine(line: string) {
    let quote = '';
    let record = '';
    for (const char of line) {
        // no quotation
        if (quote.length === 0) {
            if (char === '"' || char === "'") {
                // start quotation
                quote = char;
            } else if (char === ',') {
                yield record;
                record = '';
            } else {
                record += char;
            }
        }
        // inside quotation
        else {
            if (char === quote) {
                // end quotation
                quote = '';
            } else {
                record += char;
            }
        }
    }
    if (record.length > 0) {
        yield record;
    }
}

function toCsvTable(dataFrameAndResults: Array<{ result: QueryResult; dataFrame: MutableDataFrame; metric: Metric }>) {
    let tableText = '';
    if (dataFrameAndResults.length === 1 && dataFrameAndResults[0].metric.values.length > 0) {
        const snapshots = dataFrameAndResults[0].metric.values;
        const lastSnapshot = snapshots[snapshots.length - 1];
        if (lastSnapshot.values.length > 0) {
            const lastValue = lastSnapshot.values[0].value;
            if (isString(lastValue) && lastValue.includes(',')) {
                tableText = lastValue;
            }
        }
    }

    const tableDataFrame = new MutableDataFrame();
    const lines = tableText.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) {
            continue;
        }

        if (tableDataFrame.fields.length === 0) {
            const header = Array.from(parseCsvLine(line));
            for (const title of header) {
                tableDataFrame.addField({ name: title });
            }
        } else {
            const row = Array.from(parseCsvLine(line));
            for (let i = 0; i < tableDataFrame.fields.length; i++) {
                tableDataFrame.fields[i].values.add(row[i]);
            }
        }
    }
    return tableDataFrame;
}

export function processTargets(
    request: DataQueryRequest,
    results: QueryResult[],
    sampleIntervalSec: number
): DataFrame[] {
    if (results.length === 0) {
        return [];
    }

    const format = results[0].target.query.format;
    if (!every(results, result => result.target.query.format === format)) {
        throw new Error('Format must be the same for all queries of a panel.');
    }

    const dataFrameAndResults = results.flatMap(result =>
        result.metrics.map(metric => ({
            result,
            metric,
            dataFrame: applyTransformations(
                format,
                metric.metadata,
                toDataFrame(request, result, metric, sampleIntervalSec)
            ),
        }))
    );

    if (format === TargetFormat.TimeSeries) {
        return dataFrameAndResults
            .map(({ result, metric, dataFrame }) => toTimeSeries(request, result, metric, dataFrame))
            .filter(dataFrame => dataFrame.fields.length > 1);
    } else if (format === TargetFormat.Heatmap) {
        return dataFrameAndResults
            .map(({ result, metric, dataFrame }) => toHeatMap(request, result, metric, dataFrame))
            .filter(dataFrame => dataFrame.fields.length > 1);
    } else if (format === TargetFormat.MetricsTable) {
        return [toMetricsTable(request, dataFrameAndResults)];
    } else if (format === TargetFormat.CsvTable) {
        return [toCsvTable(dataFrameAndResults)];
    } else if (format === TargetFormat.FlameGraph) {
        return dataFrameAndResults.map(({ dataFrame }) => dataFrame);
    } else {
        throw { message: `Invalid target format '${format}'.` };
    }
}
