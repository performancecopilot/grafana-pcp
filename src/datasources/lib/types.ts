export type Datapoint = [number | string | undefined, number, number?];

export interface TimeSeriesResult {
    target: string;
    datapoints: Datapoint[]
}

export interface TableResult {
    columns: any[]
    rows: any[]
    type: string
}

export type TargetResult = TimeSeriesResult | TableResult;

export enum TargetFormat {
    TimeSeries = "time_series",
    Table = "table",
    Heatmap = "heatmap",
}
