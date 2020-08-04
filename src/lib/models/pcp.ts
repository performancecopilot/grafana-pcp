import { Dict } from './utils';

export type MetricName = string;
export type SeriesId = string;

export type InstanceId = number;
export type SeriesInstanceId = string;
export type InstanceName = string;

export type Labels = Dict<string, any>;

export enum Semantics {
    Instant = 'instant',
    Discrete = 'discrete',
    Counter = 'counter',
}

export const SERIES_NO_INDOM = 'none';

export interface MetricMetadata {
    name: MetricName;
    indom?: string;
    type: string;
    sem: Semantics;
    units: string;
    labels: Labels;
}

export interface SeriesMetricMetadata extends MetricMetadata {
    series: SeriesId;
}

export interface SeriesInstance {
    series: SeriesId;
    name: InstanceName;
    instance: SeriesInstanceId;
    labels: Labels;
}
