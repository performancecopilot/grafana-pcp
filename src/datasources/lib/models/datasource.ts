export type DatasourceRequestFn = (options: any) => any;

export enum TargetFormat {
    TimeSeries = "time_series",
    Table = "table",
    Heatmap = "heatmap",
    FlameGraph = "flamegraph",
}

export interface Query {
    dashboardId: number;
    panelId: number;
    timezone: string;
    interval: string;
    intervalMs: number;
    maxDataPoints: number;
    range: {
        from: { valueOf: () => number },
        to: { valueOf: () => number }
    };
    scopedVars: any;
    targets: QueryTarget[];
}

export interface QueryTarget {
    refId: string;
    hide?: boolean;

    isTyping?: boolean;
    expr: string;
    format: TargetFormat;
    legendFormat?: string;

    url?: string;
    container?: string | undefined;
}

export interface PmapiQueryTarget<EP> extends QueryTarget {
    uid: string;
    url: string;
    container: string | undefined;
    endpoint: EP;
}


export type Datapoint<T> = [T, number]; // [value, timestampMs]
export type TDatapoint = Datapoint<number> | Datapoint<string>;

export interface TimeSeriesData {
    target: string;
    datapoints: Datapoint<number>[];
}

export interface TableData {
    columns: any[];
    rows: (number | string)[][];
    type: string;
}

export type PanelData = TimeSeriesData | TableData;
