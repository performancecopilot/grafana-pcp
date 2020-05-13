type MetricName = string;
type InstanceName = string;
export type Labels = Record<string, string>;

export interface MetricMetadata {
    name: MetricName;
    indom: string;
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
    timestamp: number;
    values: MetricInstanceValue[];
}
