import {
    SeriesInstancesResponse,
    SeriesLabelsItemResponse,
    SeriesPingResponse,
    SeriesValuesResponse,
} from '../../../../common/services/pmseries/types';
import { Dict } from '../../../../common/types/utils';

const _values: Dict<string, SeriesValuesResponse> = {
    'disk.dev.read': [
        {
            series: 'f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9',
            instance: '7f3afb6f41e53792b18e52bcec26fdfa2899fa58',
            timestamp: 1599320691309.872,
            value: '1786894',
        },
        {
            series: 'f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9',
            instance: '0aeab8b239522ab0640577ed788cc601fc640266',
            timestamp: 1599320691309.872,
            value: '0',
        },
        {
            series: 'f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9',
            instance: '7f3afb6f41e53792b18e52bcec26fdfa2899fa58',
            timestamp: 1599320691310.872,
            value: '1786896',
        },
        {
            series: 'f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9',
            instance: '0aeab8b239522ab0640577ed788cc601fc640266',
            timestamp: 1599320691310.872,
            value: '0',
        },
    ],
    'kernel.all.sysfork': [
        {
            series: '73d93ee9efa086923d0c9eabc96f98f2b583b8f2',
            timestamp: 10000.0,
            value: '100',
        },
        {
            series: '73d93ee9efa086923d0c9eabc96f98f2b583b8f2',
            timestamp: 11000.0,
            value: '200',
        },
    ],
};

const _instances: Dict<string, SeriesInstancesResponse> = {
    'disk.dev.read': [
        {
            series: 'f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9',
            source: '2914f38f7bdcb7fb3ac0b822c98019248fd541fb',
            instance: '0aeab8b239522ab0640577ed788cc601fc640266',
            id: 1,
            name: 'sda',
        },
        {
            series: 'f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9',
            source: '2914f38f7bdcb7fb3ac0b822c98019248fd541fb',
            instance: '7f3afb6f41e53792b18e52bcec26fdfa2899fa58',
            id: 0,
            name: 'nvme0n1',
        },
    ],
};

const _labels: Dict<string, SeriesLabelsItemResponse> = {
    'disk.dev.read[sda]': {
        series: '0aeab8b239522ab0640577ed788cc601fc640266',
        labels: {
            indom_name: 'per disk',
            device_type: 'block',
            agent: 'linux',
            userid: 978,
            machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            hostname: 'dev',
            groupid: 976,
            domainname: 'localdomain',
        },
    },
    'disk.dev.read[nvme0n1]': {
        series: '7f3afb6f41e53792b18e52bcec26fdfa2899fa58',
        labels: {
            indom_name: 'per disk',
            device_type: 'block',
            agent: 'linux',
            userid: 978,
            machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            hostname: 'dev',
            groupid: 976,
            domainname: 'localdomain',
        },
    },
};

export function ping(success = true): SeriesPingResponse {
    return { success };
}

export function values(metrics: string[]): SeriesValuesResponse {
    return metrics.flatMap(metric => _values[metric]!);
}

export function instances(metrics: string[]): SeriesInstancesResponse {
    return metrics.flatMap(metric => _instances[metric]!);
}

export function labels(metrics: string[]): SeriesLabelsItemResponse[] {
    return metrics.flatMap(metric => _labels[metric]!);
}
