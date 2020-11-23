import { FieldType, getTimeField, MISSING_VALUE, MutableDataFrame, MutableField } from '@grafana/data';
import { Metadata } from '../../../common/services/pmapi/types';
import { Semantics } from '../../../common/types/pcp';
import { Dict } from '../../../common/types/utils';
import { TargetFormat } from '../types';
import { PmapiQuery } from './types';

function fieldSetRate(field: MutableField, idx: number, deltaSec: number, discreteValues: boolean) {
    const curVal = field.values.get(idx);
    const prevVal = field.values.get(idx - 1);
    if (curVal !== MISSING_VALUE && prevVal !== MISSING_VALUE) {
        const diff = curVal - prevVal;
        if (diff >= 0) {
            let rate;
            if (discreteValues) {
                rate = Math.round(diff / deltaSec);
            } else {
                rate = diff / deltaSec;
            }
            field.values.set(idx, rate);
            return;
        }
    }

    // either one value is nil or counter wrapped
    // we don't know if the counter wrapped multiple times,
    // so let's set the field to nil
    field.values.set(idx, MISSING_VALUE);
}

function rateConversion(frame: MutableDataFrame, discreteValues = false) {
    const { timeField } = getTimeField(frame);
    if (!timeField || timeField.values.length === 0) {
        return;
    }

    for (const field of frame.fields) {
        if (field.type === FieldType.time) {
            continue;
        }

        // start at the end, otherwise we'd calculate the current rate with the previous rate instead of the raw counter value
        for (let i = field.values.length - 1; i >= 1; i--) {
            const deltaSec = (timeField.values.get(i) - timeField.values.get(i - 1)) / 1000;
            fieldSetRate(field, i, deltaSec, discreteValues);
        }
        field.values.set(0, MISSING_VALUE);
    }
    // do *not* set time field to MISSING_VALUE, otherwise it gets converted to 0, which is "out of range"
    // timeField.values.set(0, MISSING_VALUE);
}

function timeUtilizationConversion(frame: MutableDataFrame, divisor: number) {
    for (const field of frame.fields) {
        if (field.type !== FieldType.number) {
            continue;
        }

        field.config.unit = 'percentunit';
        for (let i = 0; i < field.values.length; i++) {
            field.values.set(i, field.values.get(i) / divisor);
        }
    }
}

const PCP_TIME_UNITS: Dict<string, number> = {
    nanosec: 1000 * 1000 * 1000,
    microsec: 1000 * 1000,
    millisec: 1000,
};

export function applyFieldTransformations(query: PmapiQuery, metadata: Metadata, frame: MutableDataFrame): void {
    if (metadata.sem === Semantics.Counter) {
        const discreteValues = query.format === TargetFormat.FlameGraph;
        rateConversion(frame, discreteValues);

        if (
            query.options.timeUtilizationConversion &&
            query.format !== TargetFormat.Heatmap &&
            metadata.units in PCP_TIME_UNITS
        ) {
            // for time based counters, convert to time utilization
            // but not for heatmaps, otherwise bcc.runq.latency would also get converted
            timeUtilizationConversion(frame, PCP_TIME_UNITS[metadata.units]!);
        }
    }
}
