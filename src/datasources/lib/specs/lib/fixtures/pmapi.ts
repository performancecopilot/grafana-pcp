import { Metadata } from 'common/services/pmapi/types';
import { Semantics } from 'common/types/pcp';

export const metricMetadataSingle: Metadata = {
    name: 'metric.single',
    type: 'u64',
    sem: Semantics.Instant,
    series: 'series_id_0',
    units: 'bytes',
    labels: {},
    'text-help': 'help',
    'text-oneline': 'oneline',
};

export const metricMetadataIndom: Metadata = {
    name: 'metric.indom',
    indom: '1',
    type: 'u64',
    sem: Semantics.Instant,
    series: 'series_id_1',
    units: 'bytes',
    labels: {},
    'text-help': 'help',
    'text-oneline': 'oneline',
};
