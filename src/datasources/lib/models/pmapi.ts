import { Labels } from "./metrics";

export interface MetricMetadata {
    series?: string;
    name: string;
    pmid: string;
    indom?: string;
    type: string;
    sem: string;
    units: string;
    labels: Labels;
    "text-oneline": string;
    "text-help": string;
}

export interface IndomInstance {
    instance: number;
    name: string;
    labels: Labels;
}

export interface InstanceValues {
    instance: number | null;
    value: number | string;
}

export interface MetricValues {
    pmid: string;
    name: string;
    instances: InstanceValues[];
}
