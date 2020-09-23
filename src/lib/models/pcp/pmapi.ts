import { MetricName, Semantics, Labels, InstanceName, Metric } from './pcp';

export type PmapiInstanceId = number;
export type PmapiMetric = Metric<PmapiMetricMetadata, PmapiInstance>;

export interface PmapiMetricMetadata {
    name: MetricName;
    indom?: string;
    type: string;
    sem: Semantics;
    series: string;
    units: string;
    labels: Labels;
    'text-help': string;
    'text-oneline': string;
}

export interface PmapiInstance {
    name: InstanceName;
    instance: PmapiInstanceId;
    labels: Labels;
}

export interface PmapiInstanceValue {
    instance: PmapiInstanceId | null;
    value: number | string;
}
