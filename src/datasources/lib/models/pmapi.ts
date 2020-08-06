import { PcpQuery, PcpTarget } from './pcp';
import { RequiredField, Dict } from '../../../lib/models/utils';

export interface PmapiQuery extends PcpQuery {
    url?: string;
    hostspec?: string;
    targetId?: string;
}

export type CompletePmapiQuery = RequiredField<PmapiQuery, 'url' | 'hostspec' | 'targetId'>;

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
 * Collects possible errors (e.g. MetricNotFoundError) which occured while polling in the background
 */
export interface PmapiTarget<T = Dict<string, any>> extends PcpTarget<T> {
    state: PmapiTargetState;
    query: CompletePmapiQuery;
    /** valid PCP metric names (can be a derived metric, e.g. derived_xxx) */
    metricNames: string[];
    errors: any[];
    lastActiveMs: number;
}
