import { Metric, TargetState } from '../../../poller';
import { metricMetadataIndom } from './pmapi';

export const endpoint = {
    context: {
        labels: {
            ctxlabelkey: 'ctxlabelvalue',
        },
    },
};

export const query = {};

export const queryResult = {
    endpoint: endpoint as any,
    target: {
        state: TargetState.METRICS_AVAILABLE,
        query: query as any,
        metricNames: [],
        errors: [],
        lastActiveMs: 0,
        custom: {},
    },
};

const instances = new Map();
export const instanceDomain = {
    instances,
    labels: {},
};

export const metricIndom: Metric = {
    metadata: metricMetadataIndom,
    instanceDomain: {
        instances: new Map([
            [0, { name: 'inst0', instance: 0, labels: { inst0labelkey: 'inst0labelvalue' } }],
            [1, { name: 'inst1', instance: 1, labels: {} }],
            [2, { name: 'inst2', instance: 2, labels: {} }],
        ]),
        labels: {
            indomlabelkey: 'indomlabelvalue',
        },
    },
    values: [
        {
            timestampMs: 0,
            values: [
                { instance: 0, value: 0 },
                { instance: 1, value: 1 },
            ],
        },
        {
            timestampMs: 1000,
            values: [
                { instance: 0, value: 1000 },
                { instance: 1, value: 1001 },
                { instance: 2, value: 1002 },
            ],
        },
        {
            timestampMs: 2000,
            values: [
                { instance: 0, value: 2000 },
                { instance: 1, value: 2001 },
            ],
        },
        {
            timestampMs: 3000,
            values: [
                { instance: 0, value: 3000 },
                { instance: 1, value: 3001 },
                { instance: 2, value: 3002 },
            ],
        },
    ],
};
