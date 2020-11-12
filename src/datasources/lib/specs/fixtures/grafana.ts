import { DataQuery, DataQueryRequest, dateTimeParse } from '@grafana/data';
import { FetchResponse } from '@grafana/runtime';

export function dataQueryRequest<T extends DataQuery>(targets: Array<Partial<T>> = []): DataQueryRequest<T> {
    return {
        app: 'dashboard',
        dashboardId: 1,
        panelId: 2,
        requestId: '3',
        interval: '20s',
        intervalMs: 20000,
        startTime: 0,
        timezone: '',
        range: {
            from: dateTimeParse(0),
            to: dateTimeParse(20000),
            raw: {
                from: dateTimeParse(0),
                to: dateTimeParse(20000),
            },
        },
        scopedVars: {},
        targets: targets as any,
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
