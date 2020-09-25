import { Context, Indom, InstanceValue, Metadata } from 'common/services/pmapi/types';
import { Labels } from 'common/types/pcp';
import { Dict, RequiredField } from 'common/types/utils';
import { Target, TemplatedPmapiQuery } from '../types';

export interface Metric {
    metadata: Metadata;
    instanceDomain?: {
        instances: Dict<string, Indom>;
        labels: Labels;
    };
    values: InstanceValuesSnapshot[];
}

export interface InstanceValuesSnapshot {
    timestampMs: number;
    values: InstanceValue[];
}

export enum EndpointState {
    /** new entered endpoint, no context available */
    PENDING,
    /** context available */
    CONNECTED,
}

/**
 * single endpoint, identified by url and hostspec
 * each url/hostspec has a different context
 * each url/hostspec can have different metrics (and values)
 */
export interface Endpoint {
    state: EndpointState;
    url: string;
    hostspec: string;
    metrics: Metric[];
    targets: Target[];
    additionalMetricsToPoll: Array<{ name: string; callback: (values: InstanceValue[]) => void }>;
    errors: any[];

    /** context, will be created at next poll */
    context?: Context;
    /** backfilling with redis */
    hasRedis?: boolean;
}

export type EndpointWithCtx = RequiredField<Endpoint, 'context'>;

export interface QueryResult {
    endpoint: EndpointWithCtx;
    query: TemplatedPmapiQuery;
    metrics: Metric[];
}
