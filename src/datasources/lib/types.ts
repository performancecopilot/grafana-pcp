import { Endpoint } from "./endpoint_registry";

export enum TargetFormat {
    TimeSeries = "time_series",
    Table = "table",
    Heatmap = "heatmap",
}

export interface Query {
    targets: QueryTarget[];
    scopedVars: any;
    range: {
        from: { valueOf: () => number },
        to: { valueOf: () => number }
    };
    timezone: string;
    interval: string;
    intervalMs: number;
    maxDataPoints: number;
}

export interface QueryTarget<EP extends Endpoint = any> {
    refId: string;
    hide?: boolean;

    isTyping?: boolean;
    expr: string;
    format: TargetFormat;
    legendFormat?: string;

    endpoint?: EP;
    url?: string;
    container?: string;

    // TODO: remove me: deprecated
    target?: string;
    type?: string;
}

export interface MetricMetadata {
    name: string;
    pmid: number;
    sem: string;
    type: string;
    units: string;
    labels: Record<string, any>;
}

export type Datapoint<T> = [T, number]; // [value, timestampMs]
export type TDatapoint = Datapoint<number> | Datapoint<string>

export interface TimeSeriesData {
    target: string;
    datapoints: Datapoint<number>[];
}

export interface TableData {
    columns: any[];
    rows: (string | number)[][];
    type: string;
}

export type PanelData = TimeSeriesData | TableData;

export interface MetricInstance<T> {
    name: string;
    values: Datapoint<T>[];
}

export interface Metric<T> {
    name: string;
    instances: MetricInstance<T>[];
}

export interface TargetResult {
    target: QueryTarget;
    metrics: (Metric<number> | Metric<string>)[];
}

export type TransformationFn = (datapoints: TDatapoint[]) => void
export type DatasourceRequestFn = (options: any) => any;
