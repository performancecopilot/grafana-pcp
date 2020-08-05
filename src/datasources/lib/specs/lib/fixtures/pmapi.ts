import { Semantics } from '../../../../../lib/models/pcp/pcp';
import { PmapiMetricMetadata } from '../../../../../lib/models/pcp/pmapi';

export const metricMetadataSingle: PmapiMetricMetadata = {
    name: 'metric.single',
    type: 'u64',
    sem: Semantics.Instant,
    units: 'bytes',
    labels: {},
};

export const metricMetadataIndom: PmapiMetricMetadata = {
    name: 'metric.indom',
    indom: '1',
    type: 'u64',
    sem: Semantics.Instant,
    units: 'bytes',
    labels: {},
};
