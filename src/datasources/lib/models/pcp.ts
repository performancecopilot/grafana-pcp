import { BackendSrvRequest } from '@grafana/runtime';
import { DataQuery, MutableDataFrame } from '@grafana/data';
import { Dict } from '../../../lib/models/utils';
import { Metric } from '../../../lib/models/pcp/pcp';
import { Endpoint } from '../poller';

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

export interface PcpQuery extends DataQuery {
    expr: string;
    format: TargetFormat;
    legendFormat?: string;
}

/**
 * extends the Query (as provide by Grafana) by additional information:
 * - vector+bpftrace: background errors, lastActive, ...
 * - vector: isDerivedMetric
 * - bpftrace: script
 * - redis: adhocExpr
 * is persisted during multiple queries (key = targetId)
 */
export interface PcpTarget<T = Dict<string, any>> {
    query: PcpQuery;
    custom?: T;
}

export interface QueryResult {
    endpoint?: Endpoint;
    target: PcpTarget;
    targetResult: Array<{ metric: Metric; dataFrame: MutableDataFrame }>;
}
