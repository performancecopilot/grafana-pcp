import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { MetricName } from '../../../common/types/pcp';
import { TargetFormat } from '../types';

export interface PmapiOptions extends DataSourceJsonData {
    hostspec?: string;
    retentionTime?: string;
}

export interface PmapiDefaultOptions {
    hostspec: string;
    retentionTime: string;
}

export interface PmapiQueryOptions {
    rateConversion: boolean;
    timeUtilizationConversion: boolean;
}

/**
 * query as stored in the dashboard JSON, all fields optional
 */
export interface MinimalPmapiQuery extends DataQuery {
    expr?: string;
    format?: TargetFormat;
    legendFormat?: string;
    options?: Partial<PmapiQueryOptions>;
    url?: string;
    hostspec?: string;
}

/**
 * query filled with all default values and
 * url + hostspec set from the panel or data source settings
 */
export interface PmapiQuery extends MinimalPmapiQuery {
    expr: string;
    format: TargetFormat;
    // legendFormat can still be undefined (not set)
    options: PmapiQueryOptions;
    url: string;
    hostspec: string;
}

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
    query: PmapiQuery;
    /** valid PCP metric names (can be a derived metric, e.g. derived_xxx), or multiple PCP metric names for bpftrace */
    metricNames: MetricName[];
    errors: any[];
    lastActiveMs: number;
    custom?: T;
}
