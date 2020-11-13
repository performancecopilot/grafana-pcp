import { Metadata } from 'common/services/pmapi/types';
import { Endpoint, EndpointState, Metric } from 'datasources/lib/pmapi/poller/types';
import { Target, TargetState } from 'datasources/lib/pmapi/types';
import { TargetFormat } from 'datasources/lib/types';

export function endpoint(metrics: Metric[], targets: Target[]): Endpoint {
    return {
        state: EndpointState.CONNECTED,
        url: '',
        hostspec: '',
        metrics: metrics,
        targets: targets,
        additionalMetricsToPoll: [],
        errors: [],
    };
}

export function target(metric = 'disk.dev.read', refId = 'A'): Target {
    return {
        targetId: `0/1/${refId}`,
        state: TargetState.METRICS_AVAILABLE,
        query: {
            refId,
            expr: metric,
            format: TargetFormat.TimeSeries,
            url: '',
            hostspec: '',
        },
        metricNames: [metric],
        errors: [],
        lastActiveMs: 0,
    };
}

export function metric(metadata: Metadata, values = []): Metric {
    return {
        metadata,
        values,
    };
}

export function metricIndom(metadata: Metadata, values = []): Metric {
    return {
        metadata,
        instanceDomain: {
            instances: {},
            labels: {},
        },
        values,
    };
}
