import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { RequiredField } from 'common/types/utils';

export interface PmapiOptions extends DataSourceJsonData {
    hostspec?: string;
    retentionTime?: string;
}

export interface PmapiDefaultOptions {
    hostspec: string;
    retentionTime: string;
}

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
}

export type TemplatedPmapiQuery = RequiredField<PmapiQuery, 'url' | 'hostspec'>;

export enum TargetState {
    /** newly entered target or target with error (trying again) */
    PENDING,
    /** metrics exists and metadata available */
    METRICS_AVAILABLE,
    /** fatal error, will not try again */
    ERROR,
}

/**
 * Represents a target of a Grafana panel, which will be polled in the background
 * extends the Query (as provided by Grafana) with additional information:
 * - vector+bpftrace: errors occured while polling in the background, lastActive, ...
 * - vector: isDerivedMetric
 * - bpftrace: script
 * is persisted during multiple queries (key = targetId)
 */
export interface Target<T = any> {
    targetId: string;
    state: TargetState;
    query: TemplatedPmapiQuery;
    /** valid PCP metric names (can be a derived metric, e.g. derived_xxx) */
    metricNames: string[];
    errors: any[];
    lastActiveMs: number;
    custom?: T;
}
