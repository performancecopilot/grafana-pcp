import { PmapiQuery, TargetFormat } from '../lib/types';
import { DataSourceJsonData, DataQuery } from '@grafana/data';

export interface BPFtraceOptions extends DataSourceJsonData {
    hostspec?: string;
    retentionTime?: string;
}

export interface BPFtraceQuery extends DataQuery, PmapiQuery {}

export const defaultBPFtraceQuery: Partial<BPFtraceQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
};
