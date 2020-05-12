
export type Labels = Record<string, string>;

export interface MetricMetadata {
    name: string;
    indom: string;
    sem: string;
    units: string;
    labels: Labels;
}

interface MetricInstance {
    instance: number;
    name: string;
}

export interface InstanceDomain {
    labels: Labels;
    instances: MetricInstance[];
}

export interface MetricInstanceValue {
    instance: number;
    value: number;
}
