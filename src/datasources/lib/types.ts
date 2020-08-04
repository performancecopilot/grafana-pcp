import { BackendSrvRequest } from '@grafana/runtime';
import { DataQuery } from '@grafana/data';
import { RequiredField } from '../../lib/models/utils';

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
