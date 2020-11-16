import {
    Indom,
    PmapiContextResponse,
    PmapiDeriveResponse,
    PmapiFetchResponse,
    PmapiIndomResponse,
    PmapiMetricResponse,
    PmapiStoreResponse,
} from 'common/services/pmapi/types';
import { MetricName } from 'common/types/pcp';
import { pcp } from '.';

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

export function fetchDiskDevRead(timestamp: number, value1: number, value2: number): PmapiFetchResponse {
    return {
        timestamp,
        values: [
            {
                name: 'disk.dev.read',
                instances: [
                    {
                        instance: 0,
                        value: value1,
                    },
                    {
                        instance: 1,
                        value: value2,
                    },
                ],
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
