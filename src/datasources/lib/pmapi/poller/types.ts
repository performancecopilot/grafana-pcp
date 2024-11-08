import { Required } from 'utility-types';
import { Context, Indom, InstanceValue, Metadata } from '../../../../common/services/pmapi/types';
import { Labels } from '../../../../common/types/pcp';
import { Dict } from '../../../../common/types/utils';
import { PmapiQuery, Target } from '../types';

export interface Metric {
    metadata: Metadata;
    instanceDomain?: {
        // should be Dict<number, Indom>, but JS objects don't support numbers
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
    /** backfilling with valkey */
    hasValkey?: boolean;
}

export type EndpointWithCtx = Required<Endpoint, 'context'>;

export interface QueryResult {
    endpoint: EndpointWithCtx;
    query: PmapiQuery;
    metrics: Metric[];
}
