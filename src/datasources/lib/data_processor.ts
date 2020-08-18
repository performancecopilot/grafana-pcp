import { DataQueryRequest, MutableDataFrame, FieldType, MISSING_VALUE, DataFrame } from '@grafana/data';
import { TargetFormat, QueryResult } from './models/pcp';
import { mapValues, every, isString } from 'lodash';
import { applyTransformations } from './field_transformations';
import { getTemplateSrv } from '@grafana/runtime';
import { InstanceId, InstanceName, Metric } from '../../lib/models/pcp/pcp';
import { getFieldMetadata, getLabels } from './dataframe_utils';

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

    const vars = getLabels(metric, instanceId, result.endpoint?.context);
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
    let legend = '';
    if (instanceId != null && instanceId in metric.instanceDomain.instances) {
        legend = metric.instanceDomain.instances[instanceId]!.name;
    } else {
        legend = result.target.custom?.isDerivedMetric ? result.target.query.expr : metric.metadata.name;
    }

    if (!result.endpoint) {
        // redis datasource only: add labels to default output, to help users differentiate between series from different hosts/sources
        const labels = getLabels(metric, instanceId);
        const pairs: string[] = [];
        for (const label of ['hostname', 'source']) {
            if (label in labels) {
                pairs.push(`${label}: "${labels[label]}"`);
            }
        }
        if (pairs.length > 0) {
            legend += ` {${pairs.join(', ')}}`;
        }
    }

    return legend;
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
    flatQueryResults: Array<{ queryResult: QueryResult; dataFrame: MutableDataFrame; metric: Metric }>
) {
    const tableDataFrame = new MutableDataFrame();
    tableDataFrame.addField({
        name: 'instance',
    });

    let instanceNames: Map<InstanceId | null, string> = new Map();
    for (const { queryResult, dataFrame, metric } of flatQueryResults) {
        tableDataFrame.addField({
            name: queryResult.target.custom?.isDerivedMetric ? queryResult.target.query.expr : metric.metadata.name,
            ...getFieldMetadata(metric, null, undefined, queryResult.endpoint?.context),
            config: {
                displayName: getLegendName(request, queryResult, metric, null, defaultMetricsTableHeader),
            },
        });

        // we're only interested in instances which have a value in the last snapshot
        if (dataFrame.length === 0) {
            continue;
        }
        for (const field of dataFrame.fields) {
            const lastValue = field.values.get(field.values.length - 1);
            if (field.type === FieldType.time || lastValue === MISSING_VALUE) {
                continue;
            }

            const instanceId: InstanceId = field.config.custom.instanceId;
            const instanceName: InstanceName | undefined = field.config.custom.instanceName;
            if (!instanceNames.has(instanceId)) {
                instanceNames.set(instanceId, instanceName ?? '');
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

        for (const { dataFrame } of flatQueryResults) {
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

function toCsvTable(flatQueryResults: Array<{ dataFrame: DataFrame }>) {
    let tableText = '';
    if (flatQueryResults.length === 1 && flatQueryResults[0].dataFrame.length > 0) {
        for (const field of flatQueryResults[0].dataFrame.fields) {
            if (field.type !== FieldType.time) {
                const lastValue = field.values.get(field.values.length - 1);
                if (isString(lastValue) && lastValue.includes(',')) {
                    tableText = lastValue;
                }
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

export function processTargets(request: DataQueryRequest, queryResults: QueryResult[]): DataFrame[] {
    if (queryResults.length === 0) {
        return [];
    }

    const format = queryResults[0].target.query.format;
    if (!every(queryResults, result => result.target.query.format === format)) {
        throw new Error('Format must be the same for all queries of a panel.');
    }

    const flatQueryResults = queryResults.flatMap(queryResult =>
        queryResult.targetResult.map(({ metric, dataFrame }) => ({
            queryResult,
            metric,
            dataFrame: applyTransformations(queryResult.target.query.format, metric.metadata, dataFrame),
        }))
    );

    if (format === TargetFormat.TimeSeries) {
        return flatQueryResults
            .map(({ queryResult, metric, dataFrame }) => toTimeSeries(request, queryResult, metric, dataFrame))
            .filter(dataFrame => dataFrame.fields.length > 1);
    } else if (format === TargetFormat.Heatmap) {
        return flatQueryResults
            .map(({ queryResult, metric, dataFrame }) => toHeatMap(request, queryResult, metric, dataFrame))
            .filter(dataFrame => dataFrame.fields.length > 1);
    } else if (format === TargetFormat.MetricsTable) {
        return [toMetricsTable(request, flatQueryResults)];
    } else if (format === TargetFormat.CsvTable) {
        return [toCsvTable(flatQueryResults)];
    } else if (format === TargetFormat.FlameGraph) {
        return flatQueryResults.map(({ dataFrame }) => dataFrame);
    } else {
        throw { message: `Invalid target format '${format}'.` };
    }
}
