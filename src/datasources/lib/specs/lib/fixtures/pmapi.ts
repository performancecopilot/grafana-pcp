import { MetricMetadata, Semantics } from '../../../../../lib/models/pcp';

export const metricMetadataSingle: MetricMetadata = {
    name: 'metric.single',
    type: 'u64',
    sem: Semantics.Instant,
    units: 'bytes',
    labels: {},
};

export const metricMetadataIndom: MetricMetadata = {
    name: 'metric.indom',
    indom: '1',
    type: 'u64',
    sem: Semantics.Instant,
    units: 'bytes',
    labels: {},
};
