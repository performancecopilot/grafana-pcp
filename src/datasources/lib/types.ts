export type Datapoint = [number | string, number];

export interface TimeSeriesData {
    target: string;
    datapoints: Datapoint[]
}

export interface TableData {
    columns: any[]
    rows: (string | number)[][]
    type: string
}

export type PanelData = TimeSeriesData | TableData;

export enum TargetFormat {
    TimeSeries = "time_series",
    Table = "table",
    Heatmap = "heatmap",
}

export interface DatastoreQueryResultRow {
    metric: string;
    data: TimeSeriesData[];
}

export type DatastoreQueryResult = DatastoreQueryResultRow[];
