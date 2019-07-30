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
        from: Date,
        to: Date
    };
}

export interface QueryTarget<EP extends Endpoint = any> {
    refId: string;
    hide?: boolean;

    isTyping?: boolean;
    expr: string;
    format: TargetFormat;
    legendFormat?: string;

    endpoint?: EP;

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

export type Datapoint = [number | string, number];

export interface TimeSeriesData {
    target: string;
    datapoints: Datapoint[];
}

export interface TableData {
    columns: any[];
    rows: (string | number)[][];
    type: string;
}

export type PanelData = TimeSeriesData | TableData;

export interface MetricInstance {
    name: string;
    values: Datapoint[];
}

export interface Metric {
    name: string;
    instances: MetricInstance[];
}

export interface TargetResult {
    target: QueryTarget;
    metrics: Metric[];
}
