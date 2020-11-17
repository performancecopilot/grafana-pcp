import { pcp } from '.';
import {
    Indom,
    InstanceId,
    PmapiContextResponse,
    PmapiDeriveResponse,
    PmapiFetchResponse,
    PmapiIndomResponse,
    PmapiMetricResponse,
    PmapiStoreResponse,
} from '../../../../common/services/pmapi/types';
import { MetricName } from '../../../../common/types/pcp';

export function context(ctx = 123): PmapiContextResponse {
    return { context: ctx, labels: {} };
}

export function metric(metrics: MetricName[]): PmapiMetricResponse {
    return {
        metrics: metrics.map(metric => pcp.metrics[metric].metadata),
    };
}

export function indom(metric: MetricName): PmapiIndomResponse {
    const pollerIndom = pcp.metrics[metric].instanceDomain!;
    return {
        instances: Object.values(pollerIndom.instances) as Indom[],
        labels: pollerIndom.labels,
    };
}

export function fetch(
    metric: string,
    timestamp: number,
    instances: Array<[InstanceId | null, number]>
): PmapiFetchResponse {
    return {
        timestamp,
        values: [
            {
                name: metric,
                instances: instances.map(([instance, value]) => ({ instance, value })),
            },
        ],
    };
}

export function store(success = true): PmapiStoreResponse {
    return { success };
}

export function derive(success = true): PmapiDeriveResponse {
    return { success };
}
