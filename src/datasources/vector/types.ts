import { PmapiQuery, TargetFormat } from '../lib/types';
import { DataSourceJsonData } from '@grafana/data';

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
