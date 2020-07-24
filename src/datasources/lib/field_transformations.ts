import { MutableDataFrame, MISSING_VALUE, FieldType } from '@grafana/data';
import { MetricMetadata, Semantics } from './pcp';
import { Dict, TargetFormat } from './types';

function cloneFieldDefinitions(input: MutableDataFrame) {
    const output = new MutableDataFrame<number>();
    for (const field of input.fields) {
        output.addField({ ...field, values: undefined });
    }
    return output;
}

function rateConversion(input: MutableDataFrame, discreteValues = false) {
    const output = cloneFieldDefinitions(input);
    for (let i = 1; i < input.length; i++) {
        for (const field of input.fields) {
            if (field.type === FieldType.number) {
                const diff = field.values.get(i) - field.values.get(i - 1);
                if (diff >= 0) {
                    const deltaSec = (input.values['Time'].get(i) - input.values['Time'].get(i - 1)) / 1000;
                    if (discreteValues) {
                        output.values[field.name].add(Math.round(diff / deltaSec));
                    } else {
                        output.values[field.name].add(diff / deltaSec);
                    }
                } else {
                    // counter wrap
                    // we don't know if the counter wrapped multiple times
                    // between two samples, so let's skip this value
                    output.values[field.name].add(MISSING_VALUE);
                }
            } else {
                output.values[field.name].add(field.values.get(i));
            }
        }
    }
    return output;
}

function divideBy(input: MutableDataFrame, divisor: number) {
    const output = cloneFieldDefinitions(input);
    for (let i = 0; i < input.length; i++) {
        for (const field of input.fields) {
            if (field.type === FieldType.number) {
                output.values[field.name].add(field.values.get(i) / divisor);
            } else {
                output.values[field.name].add(field.values.get(i));
            }
        }
    }
    return output;
}

const PCP_TIME_UNITS: Dict<string, number> = {
    nanosec: 1000 * 1000 * 1000,
    microsec: 1000 * 1000,
    millisec: 1000,
};

export function applyTransformations(
    targetFormat: TargetFormat,
    metadata: MetricMetadata,
    dataFrame: MutableDataFrame
) {
    if (metadata.sem === Semantics.Counter) {
        const discreteValues = targetFormat === TargetFormat.FlameGraph;
        dataFrame = rateConversion(dataFrame, discreteValues);

        if (targetFormat !== TargetFormat.Heatmap && metadata.units in PCP_TIME_UNITS) {
            // for time based counters, convert to time utilization
            // but not for heatmaps, otherwise bcc.runq.latency would also get converted
            dataFrame = divideBy(dataFrame, PCP_TIME_UNITS[metadata.units]!);
            for (const field of dataFrame.fields) {
                field.config.unit = 'percentunit';
            }
        }
    }
    return dataFrame;
}
