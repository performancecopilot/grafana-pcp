import { DataQuery, DataQueryRequest, dateTimeParse, TimeRange } from '@grafana/data';
import { FetchResponse } from '@grafana/runtime';

export function timeRange(): TimeRange {
    return {
        from: dateTimeParse(10000),
        to: dateTimeParse(20000),
        raw: {
            from: dateTimeParse(10000),
            to: dateTimeParse(20000),
        },
    };
}

export function dataQueryRequest<Q extends DataQuery>(queries: Q[] = []): DataQueryRequest<Q> {
    return {
        app: 'dashboard',
        dashboardId: 1,
        panelId: 2,
        requestId: '3',
        interval: '5s',
        intervalMs: 5000,
        startTime: 0,
        timezone: '',
        range: timeRange(),
        scopedVars: {},
        targets: queries,
    };
}

export function response<T>(data: T): FetchResponse<T> {
    return {
        data,
        status: 200,
        statusText: 'Success',
        ok: true,
        headers: {} as any,
        redirected: false,
        type: 'default',
        url: '',
        config: {} as any,
    };
}
