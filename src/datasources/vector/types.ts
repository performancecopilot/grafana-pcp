import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { BackendSrvRequest } from '@grafana/runtime';

export type DatasourceRequestOptions = Omit<BackendSrvRequest, "url">;

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
    legendFormat?: string;

    url?: string;
    container?: string;
}

export interface VectorQueryWithUrl extends VectorQuery {
    url: string;
}

export const defaultQuery: Partial<VectorQuery> = {
    expr: "",
    format: TargetFormat.TimeSeries,
};
