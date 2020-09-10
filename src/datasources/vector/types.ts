import { DataSourceJsonData } from '@grafana/data';
import { PmapiQuery, TargetFormat } from '../lib/models/pmapi';

export interface VectorOptions extends DataSourceJsonData {
    hostspec?: string;
    retentionTime?: string;
}

export interface VectorQuery extends PmapiQuery {}

export const defaultVectorQuery: Partial<VectorQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
};

export interface VectorTargetData {
    isDerivedMetric: boolean;
}
