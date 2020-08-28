import { Semantics } from '../../../../../lib/models/pcp/pcp';
import { PmapiMetricMetadata } from '../../../../../lib/models/pcp/pmapi';

export const metricMetadataSingle: PmapiMetricMetadata = {
    name: 'metric.single',
    type: 'u64',
    sem: Semantics.Instant,
    series: 'series_id_0',
    units: 'bytes',
    labels: {},
};

export const metricMetadataIndom: PmapiMetricMetadata = {
    name: 'metric.indom',
    indom: '1',
    type: 'u64',
    sem: Semantics.Instant,
    series: 'series_id_1',
    units: 'bytes',
    labels: {},
};
