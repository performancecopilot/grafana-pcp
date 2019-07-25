export interface MetricMetadata {
    name: string,
    pmid: number,
    sem: string,
    type: string,
    units: string,
    labels: Record<string, any>
}

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
    name: string;
    instances: TimeSeriesData[];
}

export type DatastoreQueryResult = DatastoreQueryResultRow[];
