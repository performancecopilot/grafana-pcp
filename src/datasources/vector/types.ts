import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface VectorOptions extends DataSourceJsonData {
    retentionTime?: string;
}

export enum TargetFormat {
    TimeSeries = "time_series",
    MetricsTable = "metrics_table",
    Heatmap = "heatmap",
}

export interface VectorQuery extends DataQuery {
    expr: string;
    format: TargetFormat;
    legendFormat: string;

    url?: string;
    container?: string;
}

export const defaultQuery: Partial<VectorQuery> = {
    expr: "",
    format: TargetFormat.TimeSeries,
    legendFormat: "",
};
