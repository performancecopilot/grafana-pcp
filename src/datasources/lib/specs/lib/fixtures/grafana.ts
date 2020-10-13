import { DataQueryRequest, dateTimeParse } from '@grafana/data';

export const dataFrameRequest: DataQueryRequest = {
    app: 'dashboard',
    dashboardId: 1,
    panelId: 2,
    requestId: '3',
    timezone: '',
    interval: '20s',
    intervalMs: 20000,
    startTime: 0,
    range: {
        from: dateTimeParse(0),
        to: dateTimeParse(20000),
        raw: {
            from: dateTimeParse(0),
            to: dateTimeParse(20000),
        },
    },
    scopedVars: {},
    targets: [],
};
