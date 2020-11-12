import {
    PmapiContextResponse,
    PmapiFetchResponse,
    PmapiIndomResponse,
    PmapiMetricResponse,
} from 'common/services/pmapi/types';
import { Semantics } from 'common/types/pcp';

export function context(): PmapiContextResponse {
    return { context: 123, labels: {} };
}

export function metricSingle(): PmapiMetricResponse {
    return {
        metrics: [
            {
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
        ],
    };
}

export function metricIndom(): PmapiMetricResponse {
    return {
        metrics: [
            {
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
                'text-help':
                    'Cumulative number of disk read operations since system boot time (subject\nto counter wrap).',
            },
        ],
    };
}

export function fetch(timestamp: number, value1: number, value2: number): PmapiFetchResponse {
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

export function indom(): PmapiIndomResponse {
    return {
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
    };
}
