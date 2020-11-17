import { Metadata } from 'common/services/pmapi/types';
import { MetricName, Semantics } from 'common/types/pcp';
import { Metric } from 'datasources/lib/pmapi/poller/types';
import { defaultsDeep } from 'lodash';

export function metadata(props: Partial<Metadata>): Metadata {
    return defaultsDeep(props, {
        name: 'sample.metric',
        series: 'seriesid1',
        type: 'u64',
        sem: Semantics.Instant,
        units: 'Kbyte',
        labels: {
            agent: 'linux',
            hostname: 'host1',
        },
        'text-oneline': 'online text',
        'text-help': 'help text',
    });
}

export const metrics: Record<MetricName, Metric> = {
    'kernel.all.sysfork': {
        metadata: {
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
        values: [],
    },
    'disk.dev.read': {
        metadata: {
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
        instanceDomain: {
            instances: {
                0: {
                    instance: 0,
                    name: 'nvme0n1',
                    labels: {
                        domainname: 'localdomain',
                        hostname: 'dev',
                        machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
                    },
                },
                1: {
                    instance: 1,
                    name: 'sda',
                    labels: {
                        domainname: 'localdomain',
                        hostname: 'dev',
                        machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
                    },
                },
            },
            labels: {
                device_type: 'block',
                domainname: 'localdomain',
                hostname: 'dev',
                indom_name: 'per disk',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        values: [],
    },
    'mem.util.free': {
        metadata: {
            name: 'mem.util.free',
            series: 'ac85fc61c2146bbd75793bae3dd3b3e13b12d164',
            type: 'u64',
            sem: Semantics.Instant,
            units: 'Kbyte',
            labels: {
                agent: 'linux',
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
            'text-oneline': 'free memory metric from /proc/meminfo',
            'text-help': 'Alias for mem.freemem.',
        },
        values: [],
    },
};
