import { BackendSrvRequest } from '@grafana/runtime';

export type Dict<K extends string, T> = {
    [P in K]?: T;
};
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalField<T, K extends keyof T> = T & Partial<Pick<T, K>>;

export type DefaultRequestOptions = Omit<BackendSrvRequest, 'url'>;

export enum TargetFormat {
    TimeSeries = 'time_series',
    Heatmap = 'heatmap',
    MetricsTable = 'metrics_table',
}

export interface PmapiQuery {
    expr: string;
    format: TargetFormat;
    legendFormat?: string;

    url?: string;
    hostspec?: string;
    targetId?: string;
}

export type CompletePmapiQuery<T = {}> = T & RequiredField<PmapiQuery, 'url' | 'hostspec' | 'targetId'>;
