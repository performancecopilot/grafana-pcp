import { Datapoint, QueryTarget, TDatapoint } from "./datasource";

export type Labels = Record<string, string | number>;
type InstanceId = number | string; // pmseries: string, pmapi: integer

export interface MetricInstance<T> {
    id: InstanceId | null;
    name: string;
    values: Datapoint<T>[];
    labels: Labels;
}

export interface Metric<T> {
    name: string;
    instances: MetricInstance<T>[];
}

export interface TargetResult {
    target: QueryTarget;
    metrics: Metric<number | string>[];
}

export type TransformationFn = (datapoints: TDatapoint[]) => TDatapoint[];
