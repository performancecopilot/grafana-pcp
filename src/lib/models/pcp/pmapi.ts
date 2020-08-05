import { MetricName, Semantics, Labels, InstanceName, InstanceValue, Metric } from './pcp';

export type PmapiInstanceId = number;
export type PmapiMetric = Metric<PmapiMetricMetadata, PmapiInstanceId, PmapiInstance>;

export interface PmapiMetricMetadata {
    name: MetricName;
    indom?: string;
    type: string;
    sem: Semantics;
    units: string;
    labels: Labels;
}

export interface PmapiInstance {
    name: InstanceName;
    instance: PmapiInstanceId;
    labels: Labels;
}

export type PmapiInstanceValue = InstanceValue<PmapiInstanceId>;
