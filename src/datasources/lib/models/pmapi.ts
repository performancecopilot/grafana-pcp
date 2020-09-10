import { RequiredField } from '../../../lib/models/utils';
import { BackendSrvRequest } from '@grafana/runtime';
import { DataQuery, MutableDataFrame } from '@grafana/data';
import { Endpoint } from '../poller';
import { Metric } from '../../../lib/models/pcp/pcp';

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

export interface QueryResult {
    endpoint: Endpoint;
    target: PmapiTarget;
    targetResult: Array<{ metric: Metric; dataFrame: MutableDataFrame }>;
}

export enum PmapiTargetState {
    /** newly entered target or target with error (trying again) */
    PENDING,
    /** metrics exists and metadata available */
    METRICS_AVAILABLE,
    /** fatal error, will not try again */
    ERROR,
}

/**
 * Represents a target of a Grafana panel, which will be polled in the background
 * extends the Query (as provided by Grafana) by additional information:
 * - vector+bpftrace: errors occured while polling in the background, lastActive, ...
 * - vector: isDerivedMetric
 * - bpftrace: script
 * is persisted during multiple queries (key = targetId)
 */
export interface PmapiTarget<T = any> {
    state: PmapiTargetState;
    query: CompletePmapiQuery;
    /** valid PCP metric names (can be a derived metric, e.g. derived_xxx) */
    metricNames: string[];
    errors: any[];
    lastActiveMs: number;
    custom?: T;
}
