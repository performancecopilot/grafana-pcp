import { PmapiMetricMetadata, PmapiInstance, PmapiInstanceId } from './pmapi';
import { Metric } from './pcp';

export type SeriesId = string;
export type SeriesInstanceId = string;
export type SeriesMetric = Metric<SeriesMetricMetadata, SeriesInstance>;
export const SERIES_NO_INDOM = 'none';

export interface SeriesMetricMetadata extends PmapiMetricMetadata {
    series: SeriesId;
}

export interface SeriesInstance extends Omit<PmapiInstance, 'instance'> {
    series: SeriesId;
    instance: SeriesInstanceId;
    id: PmapiInstanceId;
}
