type MetricName = string;
type InstanceName = string;
export type Labels = Record<string, string>;

interface Context {
    context: number;
    labels: Labels;
}

export interface MetricMetadata {
    name: MetricName;
    indom?: string;
    sem: string;
    units: string;
    labels: Labels;
}

interface MetricInstance {
    instance: number;
    name: InstanceName;
}

export interface InstanceDomain {
    labels: Labels;
    instances: MetricInstance[];
}

export interface MetricInstanceValue {
    instance: number;
    value: number;
}

export interface InstanceValuesSnapshot {
    timestampMs: number;
    values: MetricInstanceValue[];
}
