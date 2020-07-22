import { BackendSrvRequest } from '@grafana/runtime';
import { DataQuery } from '@grafana/data';

export type Dict<K extends string, T> = {
    [P in K]?: T;
};
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalField<T, K extends keyof T> = T & Partial<Pick<T, K>>;

export type DefaultRequestOptions = Omit<BackendSrvRequest, 'url'>;

export enum TargetFormat {
    TimeSeries = 'time_series',
    Heatmap = 'heatmap',
    /** vector only */
    MetricsTable = 'metrics_table',
    /** bpftrace only */
    CsvTable = 'csv_table',
    /** bpftrace only */
    FlameGraph = 'flamegraph',
}

export interface PmapiQuery extends DataQuery {
    expr: string;
    format: TargetFormat;
    legendFormat?: string;

    url?: string;
    hostspec?: string;
    targetId?: string;
}

export type CompletePmapiQuery = RequiredField<PmapiQuery, 'url' | 'hostspec' | 'targetId'>;
