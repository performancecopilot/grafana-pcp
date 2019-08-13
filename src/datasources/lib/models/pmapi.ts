import { Labels } from "./metrics";

export type PMID = string;

export interface MetricMetadata {
    series?: string;
    name: string;
    pmid: PMID;
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
    pmid: PMID;
    name: string;
    instances: InstanceValues[];
}
