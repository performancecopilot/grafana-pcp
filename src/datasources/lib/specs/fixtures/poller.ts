import { defaultsDeep } from 'lodash';
import { ds } from '.';
import { RecursivePartial } from '../../../../common/types/utils';
import { EndpointState, EndpointWithCtx } from '../../../../datasources/lib/pmapi/poller/types';
import { Target, TargetState } from '../../../../datasources/lib/pmapi/types';

export function endpoint(props?: RecursivePartial<EndpointWithCtx>): EndpointWithCtx {
    return defaultsDeep(props, {
        state: EndpointState.CONNECTED,
        url: 'http://fixture_url:1234',
        hostspec: '',
        metrics: [],
        targets: [],
        additionalMetricsToPoll: [],
        errors: [],
        context: {
            context: 123,
            labels: {},
        },
    });
}

export function target(props?: RecursivePartial<Target>): Target {
    const query = ds.templatedQuery(props?.query);
    return defaultsDeep(props, {
        targetId: `0/1/${query.refId ?? 'A'}`,
        state: TargetState.METRICS_AVAILABLE,
        query,
        metricNames: [query.expr],
        errors: [],
        lastActiveMs: 0,
    });
}
