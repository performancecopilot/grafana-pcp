import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { BackendSrvRequest } from '@grafana/runtime';

export type Dict<K extends string, T> = {
    [P in K]?: T;
};

export type DatasourceRequestOptions = Omit<BackendSrvRequest, 'url'>;

export interface VectorOptions extends DataSourceJsonData {
    retentionTime?: string;
}

export enum TargetFormat {
    TimeSeries = 'time_series',
    Heatmap = 'heatmap',
    MetricsTable = 'metrics_table',
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
    expr: '',
    format: TargetFormat.TimeSeries,
};

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
