import { Endpoint } from "../endpoint_registry";

export type DatasourceRequestFn = (options: any) => any;

export enum TargetFormat {
    TimeSeries = "time_series",
    Table = "table",
    Heatmap = "heatmap",
}

export interface Query {
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

export interface QueryTarget<EP extends Endpoint = Endpoint> {
    refId: string;
    hide?: boolean;

    isTyping?: boolean;
    expr: string;
    format: TargetFormat;
    legendFormat?: string;

    endpoint?: EP;
    url?: string;
    container?: string;
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
