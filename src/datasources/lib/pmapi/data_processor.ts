import {
    DataFrame,
    DataQueryRequest,
    Field,
    FieldConfig,
    FieldDTO,
    FieldType,
    getTimeField,
    MISSING_VALUE,
    MutableDataFrame,
    MutableField,
    ScopedVars,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { every, isString, mapValues } from 'lodash';
import { Context, Indom, InstanceId, Metadata } from '../../../common/services/pmapi/types';
import { GenericError } from '../../../common/types/errors';
import { Labels, Semantics } from '../../../common/types/pcp';
import { TargetFormat } from '../types';
import { applyFieldTransformations } from './field_transformations';
import { Metric, QueryResult } from './poller/types';
import { MinimalPmapiQuery, PmapiQuery } from './types';

interface FrameCustom {
    context: Context;
    query: PmapiQuery;
    metric: Metric;
}

interface FieldCustom {
    instanceId: InstanceId | null;
    instance?: Indom;
}

function getFieldName(metric: Metric, instanceId: InstanceId | null) {
    const metricName = metric.metadata.name;
    if (!metric.instanceDomain || instanceId === null) {
        return metricName;
    }

    const instanceName = metric.instanceDomain.instances[instanceId]?.name ?? instanceId;
    return `${metricName}[${instanceName}]`;
}

const pcpNumberTypes = ['32', 'u32', '64', 'u64', 'float', 'double'];
function getFieldType(metadata: Metadata): FieldType {
    if (pcpNumberTypes.includes(metadata.type)) {
        return FieldType.number;
    } else if (metadata.type === 'string') {
        return FieldType.string;
    } else {
        return FieldType.other;
    }
}

function getLabels(context: Context, metric: Metric, instanceId: InstanceId | null): Labels {
    let labels = {
        ...context.labels,
        ...metric.metadata.labels,
        ...metric.instanceDomain?.labels,
    };
    if (metric.instanceDomain && instanceId != null && instanceId in metric.instanceDomain.instances) {
        Object.assign(labels, metric.instanceDomain.instances[instanceId]!.labels);
    }
    return labels;
}

function getFieldUnit(metadata: Metadata): string | undefined {
    // pcp/src/libpcp/src/units.c
    // grafana-data/src/valueFormats/categories.ts
    switch (metadata.units) {
        case 'nanosec':
            return 'ns';
        case 'microsec':
            return 'µs';
        case 'millisec':
            return 'ms';
        case 'sec':
            return 's';
        case 'min':
            return 'm';
        case 'hour':
            return 'h';
    }

    if (metadata.sem === Semantics.Counter) {
        switch (metadata.units) {
            case 'byte':
                return 'binBps';
            case 'Kbyte':
                return 'KiBs';
            case 'Mbyte':
                return 'MiBs';
            case 'Gbyte':
                return 'GiBs';
            case 'Tbyte':
                return 'TiBs';
            case 'Pbyte':
                return 'PiBs';
        }
    } else {
        switch (metadata.units) {
            case 'byte':
                return 'bytes';
            case 'Kbyte':
                return 'kbytes';
            case 'Mbyte':
                return 'mbytes';
            case 'Gbyte':
                return 'gbytes';
            case 'Tbyte':
                return 'tbytes';
            case 'Pbyte':
                return 'pbytes';
        }
    }
    return undefined;
}

function getFieldDisplayName(
    scopedVars: ScopedVars,
    context: Context,
    query: PmapiQuery,
    metric: Metric,
    instanceId: InstanceId | null
) {
    if (!query.legendFormat) {
        return '';
    }

    const vars = getLabels(context, metric, instanceId);
    const spl = metric.metadata.name.split('.');
    vars['expr'] = query.expr;
    vars['metric'] = metric.metadata.name;
    vars['metric0'] = spl[spl.length - 1];

    if (metric.instanceDomain && instanceId != null && instanceId in metric.instanceDomain.instances) {
        vars['instance'] = metric.instanceDomain.instances[instanceId]!.name;
    }

    return getTemplateSrv().replace(query.legendFormat, {
        ...mapValues(vars, value => ({ text: value, value })),
        ...scopedVars,
    });
}

function createField(
    scopedVars: ScopedVars,
    context: Context,
    query: PmapiQuery,
    metric: Metric,
    instanceId: InstanceId | null
): FieldDTO & { config: FieldConfig<FieldCustom> } {
    let instance: Indom | undefined;
    if (metric.instanceDomain && instanceId !== null) {
        instance = metric.instanceDomain.instances[instanceId];
    }

    const config: FieldConfig<FieldCustom> = {
        displayNameFromDS: getFieldDisplayName(scopedVars, context, query, metric, instanceId),
        custom: {
            instanceId: instanceId,
            instance,
        },
    };

    const unit = getFieldUnit(metric.metadata);
    if (unit) {
        config.unit = unit;
    }

    return {
        name: getFieldName(metric, instanceId),
        type: getFieldType(metric.metadata),
        labels: getLabels(context, metric, instanceId),
        config,
    };
}

function createDataFrame(
    request: DataQueryRequest<MinimalPmapiQuery>,
    context: Context,
    query: PmapiQuery,
    metric: Metric,
    sampleIntervalSec: number
) {
    // fill the graph by requesting more data (+/- 1 interval)
    let requestRangeFromMs = request.range.from.valueOf() - sampleIntervalSec * 1000;
    let requestRangeToMs = request.range.to.valueOf() + sampleIntervalSec * 1000;

    // the first value of a counter metric is lost due to rate conversion
    if (metric.metadata.sem === Semantics.Counter) {
        requestRangeFromMs -= sampleIntervalSec * 1000;
    }

    const frame = new MutableDataFrame();
    frame.meta = {
        custom: {
            context,
            query,
            metric,
        },
    };
    const timeField = frame.addField({ name: 'Time', type: FieldType.time });
    const instanceIdToField = new Map<InstanceId | null, MutableField>();
    for (const snapshot of metric.values) {
        if (!(requestRangeFromMs <= snapshot.timestampMs && snapshot.timestampMs <= requestRangeToMs)) {
            continue;
        }

        // create all dataFrame fields in one go, because Grafana automatically matches
        // the vector length of newly created fields with already existing fields by adding empty data
        for (const instanceValue of snapshot.values) {
            if (instanceIdToField.has(instanceValue.instance)) {
                continue;
            }

            const field = frame.addField(
                createField(request.scopedVars, context, query, metric, instanceValue.instance)
            );
            instanceIdToField.set(instanceValue.instance, field);
        }

        timeField.values.add(snapshot.timestampMs);
        for (const instanceValue of snapshot.values) {
            let field = instanceIdToField.get(instanceValue.instance)!;
            // make sure a field doesn't grow larger than the time field
            // in case an instance has two values for the same timestamp (should not happen)
            if (field.values.length < timeField.values.length) {
                field.values.add(instanceValue.value);
            }
        }

        // some instance existed previously but disappeared -> fill field with MISSING_VALUE
        for (const field of instanceIdToField.values()) {
            if (timeField.values.length > field.values.length) {
                field.values.add(MISSING_VALUE);
            }
        }
    }
    if (frame.fields.length < 2) {
        // no actual data available, only time field
        return null;
    }

    applyFieldTransformations(query, metric.metadata, frame);
    return frame;
}

function getHeatMapDisplayName(field: Field) {
    // target name is the upper bound
    const instanceName = (field.config.custom as FieldCustom).instance?.name;
    if (instanceName) {
        // instance name can be -1024--512, -512-0, 512-1024, ...
        const match = instanceName.match(/^(.+?)\-(.+?)$/);
        if (match) {
            return match[2];
        }
    }
    return '0-0';
}

function transformToHeatMap(frame: MutableDataFrame) {
    const { timeField } = getTimeField(frame) as { timeField?: MutableField };
    if (!timeField) {
        return;
    }
    for (const field of frame.fields) {
        if (field.type === FieldType.number) {
            field.config.displayNameFromDS = getHeatMapDisplayName(field);
        }
    }

    for (let i = 0; i < timeField.values.length; i++) {
        // round timestamps to one second, the heatmap panel calculates the x-axis size accordingly
        timeField.values.set(i, Math.floor(timeField.values.get(i) / 1000) * 1000);
    }
}

/**
 * transform a list of data frames to a table with metric names as columns and instances as rows
 * instances are grouped over multiple metrics
 */
function transformToMetricsTable(scopedVars: ScopedVars, frames: DataFrame[]) {
    const tableFrame = new MutableDataFrame();
    tableFrame.addField({
        name: 'instance',
        type: FieldType.string,
    });

    let instanceColumn: Map<InstanceId | null, string> = new Map();
    for (const frame of frames) {
        const { context, query, metric } = frame.meta!.custom as FrameCustom;
        const metricSpl = metric.metadata.name.split('.');
        const newField = createField(scopedVars, context, query, metric, null);
        if (!newField.config.displayNameFromDS) {
            newField.config.displayNameFromDS = metricSpl[metricSpl.length - 1];
        }
        tableFrame.addField(newField);

        if (frame.length === 0) {
            continue;
        }
        for (const field of frame.fields) {
            const lastValue = field.values.get(field.values.length - 1);
            if (field.type === FieldType.time || lastValue === MISSING_VALUE) {
                continue;
            }

            const instanceId = (field.config.custom as FieldCustom).instanceId;
            const instance = (field.config.custom as FieldCustom).instance;
            if (!instanceColumn.has(instanceId)) {
                instanceColumn.set(instanceId, instance?.name ?? '');
            }
        }
    }

    /**
     * table is filled row-by-row
     * outer loop loops over table rows (instances)
     * inner loop loops over table columns (metrics), and writes the last value of the specific instance of a metric
     */
    for (const [instanceId, instanceName] of instanceColumn.entries()) {
        let fieldIdx = 0;
        tableFrame.fields[fieldIdx].values.add(instanceName);
        fieldIdx++;

        for (const frame of frames) {
            const field = frame.fields.find(
                field => field.type !== FieldType.time && (field.config.custom as FieldCustom).instanceId === instanceId
            );
            if (field) {
                const lastValue = field.values.get(field.values.length - 1);
                tableFrame.fields[fieldIdx].values.add(lastValue);
            } else {
                tableFrame.fields[fieldIdx].values.add(MISSING_VALUE);
            }
            fieldIdx++;
        }
    }

    return tableFrame;
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

function transformToCsvTable(frames: DataFrame[]) {
    let tableText = '';
    if (frames.length === 1 && frames[0].length > 0) {
        for (const field of frames[0].fields) {
            if (field.type !== FieldType.time) {
                const lastValue = field.values.get(field.values.length - 1);
                if (isString(lastValue) && lastValue.includes(',')) {
                    tableText = lastValue;
                }
            }
        }
    }

    const tableFrame = new MutableDataFrame();
    const lines = tableText.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) {
            continue;
        }

        if (tableFrame.fields.length === 0) {
            const header = Array.from(parseCsvLine(line));
            for (const title of header) {
                tableFrame.addField({ name: title, type: FieldType.string });
            }
        } else {
            const row = Array.from(parseCsvLine(line));
            for (let i = 0; i < tableFrame.fields.length; i++) {
                tableFrame.fields[i].values.add(row[i]);
            }
        }
    }
    return tableFrame;
}

export function processQueries(
    request: DataQueryRequest<MinimalPmapiQuery>,
    queryResults: QueryResult[],
    sampleIntervalSec: number
): DataFrame[] {
    if (queryResults.length === 0) {
        return [];
    }
    const format = queryResults[0].query.format;
    if (!every(queryResults, result => result.query.format === format)) {
        throw new GenericError('Format must be the same for all queries of a panel.');
    }

    const frames = queryResults.flatMap(
        queryResult =>
            queryResult.metrics
                .map(metric =>
                    createDataFrame(request, queryResult.endpoint.context, queryResult.query, metric, sampleIntervalSec)
                )
                .filter(frame => frame !== null) as MutableDataFrame[]
    );

    switch (format) {
        case TargetFormat.TimeSeries:
        case TargetFormat.FlameGraph:
            return frames;
        case TargetFormat.Heatmap:
            frames.forEach(transformToHeatMap);
            return frames;
        case TargetFormat.MetricsTable:
            return [transformToMetricsTable(request.scopedVars, frames)];
        case TargetFormat.CsvTable:
            return [transformToCsvTable(frames)];
        default:
            throw new GenericError(`Invalid target format '${format}'`);
    }
}
