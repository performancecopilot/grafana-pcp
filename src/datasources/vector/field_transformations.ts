import { MutableDataFrame, MISSING_VALUE, FieldType, Field, MutableField, DataFrame } from '@grafana/data';
import { MetricMetadata } from './pcp';

function rateConversion(input: DataFrame) {
    if (input.length == 0)
        return input;

    const output = new MutableDataFrame<number>();
    let inputTimeField: Field<number>;
    let outputTimeField: MutableField<number>;
    for (const field of input.fields) {
        const outputField = output.addField({
            name: field.name,
            type: field.type,
            config: field.config,
        });

        if (field.type == FieldType.time) {
            inputTimeField = field;
            outputTimeField = outputField;
        }
    }

    for (let i = 1; i < input.length; i++) {
        for (const field of input.fields) {
            if (field.type != FieldType.number)
                continue;

            const diff = field.values.get(i) - field.values.get(i - 1);
            if (diff >= 0) {
                const deltaSec = (inputTimeField!.values.get(i) - inputTimeField!.values.get(i - 1)) / 1000;
                output.values[field.name].add(diff / deltaSec);
            }
            else {
                // counter wrap
                // we don't know if the counter wrapped multiple times
                // between two samples, so let's skip this value
                output.values[field.name].add(MISSING_VALUE);
            }
        }
        outputTimeField!.values.add(inputTimeField!.values.get(i));
    }
    return output;
}


function divideBy(input: DataFrame, divisor: number) {
    if (input.length == 0)
        return input;

    const output = new MutableDataFrame<number>();
    for (const field of input.fields) {
        output.addField({
            name: field.name,
            type: field.type,
            config: field.config,
        });
    }

    for (let i = 0; i < input.length; i++) {
        for (const field of input.fields) {
            if (field.type == FieldType.number)
                output.values[field.name].add(field.values.get(i) / divisor);
            else if (field.type == FieldType.time)
                output.values[field.name].add(field.values.get(i));
        }
    }
    return output;
}

const PCP_TIME_UNITS: Record<string, number> = {
    "nanosec": 1000 * 1000 * 1000,
    "microsec": 1000 * 1000,
    "millisec": 1000,
};

export function applyTransformations(metadata: MetricMetadata, dataFrame: DataFrame) {
    if (metadata.sem === "counter") {
        dataFrame = rateConversion(dataFrame);

        if (metadata.units in PCP_TIME_UNITS) {
            // for time based counters, convert to time utilization
            dataFrame = divideBy(dataFrame, PCP_TIME_UNITS[metadata.units]);
            for (const field of dataFrame.fields) {
                field.config.unit = "percentunit";
            }
        }
    }
    return dataFrame;
}
