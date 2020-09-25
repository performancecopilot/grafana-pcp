import { Dict } from './utils';

export type MetricName = string;
export type InstanceName = string;

export enum Semantics {
    Instant = 'instant',
    Discrete = 'discrete',
    Counter = 'counter',
}

export type Labels = Dict<string, any>;
