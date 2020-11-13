import {
    Metadata,
    PmapiContextResponse,
    PmapiDeriveResponse,
    PmapiFetchResponse,
    PmapiIndomResponse,
    PmapiMetricResponse,
    PmapiStoreResponse,
} from 'common/services/pmapi/types';
import { MetricName, Semantics } from 'common/types/pcp';

export const metadata: Record<MetricName, Metadata> = {
    'kernel.all.sysfork': {
        name: 'kernel.all.sysfork',
        series: '73d93ee9efa086923d0c9eabc96f98f2b583b8f2',
        type: 'u64',
        sem: Semantics.Counter,
        units: 'count',
        labels: {
            agent: 'linux',
            domainname: 'localdomain',
            hostname: 'dev',
            machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
        },
        'text-oneline': 'fork rate metric from /proc/stat',
        'text-help': 'fork rate metric from /proc/stat',
    },
    'disk.dev.read': {
        name: 'disk.dev.read',
        series: 'f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9',
        indom: '60.1',
        type: 'u64',
        sem: Semantics.Counter,
        units: 'count',
        labels: {
            agent: 'linux',
            device_type: 'block',
            domainname: 'localdomain',
            hostname: 'dev',
            indom_name: 'per disk',
            machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
        },
        'text-oneline': 'per-disk read operations',
        'text-help': 'Cumulative number of disk read operations since system boot time (subject\nto counter wrap).',
    },
};

const _indom: Record<MetricName, PmapiIndomResponse> = {
    'disk.dev.read': {
        labels: {
            device_type: 'block',
            domainname: 'localdomain',
            hostname: 'dev',
            indom_name: 'per disk',
            machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
        },
        instances: [
            {
                instance: 1,
                name: 'sda',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'dev',
                    machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
                },
            },
            {
                instance: 0,
                name: 'nvme0n1',
                labels: {
                    domainname: 'localdomain',
                    hostname: 'dev',
                    machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
                },
            },
        ],
    },
};

export function context(ctx = 123): PmapiContextResponse {
    return { context: ctx, labels: {} };
}

export function metric(metrics: MetricName[]): PmapiMetricResponse {
    return {
        metrics: metrics.map(metric => metadata[metric]!),
    };
}

export function indom(metric: MetricName): PmapiIndomResponse {
    return _indom[metric];
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
