import { Dict } from '../utils';
import { PmapiInstanceId, PmapiMetricMetadata, PmapiInstance } from './pmapi';
import { SeriesInstanceId, SeriesMetricMetadata, SeriesInstance } from './pmseries';

export type MetricName = string;
export type MetricMetadata = PmapiMetricMetadata | SeriesMetricMetadata;
export type Instance = PmapiInstance | SeriesInstance;
export type InstanceId = PmapiInstanceId | SeriesInstanceId;
export type InstanceName = string;

export type Labels = Dict<string, any>;

export enum Semantics {
    Instant = 'instant',
    Discrete = 'discrete',
    Counter = 'counter',
}

export interface Metric<MD = MetricMetadata, II = InstanceId, IN = Instance> {
    metadata: MD;
    instanceDomain: {
        instances: Dict<string, IN>;
        labels: Labels;
    };
}
