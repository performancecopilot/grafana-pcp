import { PmapiOptions, PmapiQuery, TargetFormat } from 'datasources/lib/pmapi/types';

export interface VectorOptions extends PmapiOptions {}

export interface VectorQuery extends PmapiQuery {}

export const defaultVectorQuery: Partial<VectorQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
};

export interface VectorTargetData {
    isDerivedMetric: boolean;
}
