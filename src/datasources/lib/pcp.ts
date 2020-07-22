import { Dict } from './types';
import { FieldType } from '@grafana/data';

export type MetricName = string;
export type Expr = string;
export type InstanceName = string;
export type InstanceId = number;
export type Labels = Dict<string, string>;

export enum Semantics {
    Instant = 'instant',
    Discrete = 'discrete',
    Counter = 'counter',
}

export interface Context {
    context: number;
    labels: Labels;
}

export interface MetricMetadata {
    name: MetricName;
    indom?: string;
    type: string;
    sem: Semantics;
    units: string;
    labels: Labels;
}

export interface Instance {
    name: InstanceName;
    instance: InstanceId;
    labels: Labels;
}

export interface InstanceDomain {
    instances: Instance[];
    labels: Labels;
}

export interface InstanceValue {
    /** the actual value null is returned by the pmproxy REST API */
    instance: InstanceId | null;
    value: number | string;
}

export interface InstanceValuesSnapshot {
    timestampMs: number;
    values: InstanceValue[];
}

const pcpNumberTypes = ['32', 'u32', '64', 'u64', 'float', 'double'];
export function pcpTypeToGrafanaType(metadata: MetricMetadata): FieldType {
    if (pcpNumberTypes.includes(metadata.type)) {
        return FieldType.number;
    } else if (metadata.type === 'string') {
        return FieldType.string;
    } else {
        return FieldType.other;
    }
}

export function pcpUnitToGrafanaUnit(metadata: MetricMetadata): string | undefined {
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
                return 'Bps';
            case 'Kbyte':
                return 'KBs';
            case 'Mbyte':
                return 'MBs';
            case 'Gbyte':
                return 'GBs';
            case 'Tbyte':
                return 'TBs';
            case 'Pbyte':
                return 'PBs';
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
