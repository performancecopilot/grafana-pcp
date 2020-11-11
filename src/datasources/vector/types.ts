import { PmapiOptions, PmapiQuery } from 'datasources/lib/pmapi/types';
import { TargetFormat } from 'datasources/lib/types';

export interface VectorOptions extends PmapiOptions {}

export interface VectorQuery extends PmapiQuery {}

export const defaultVectorQuery: Partial<VectorQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
};

export interface VectorTargetData {
    isDerivedMetric: boolean;
}
