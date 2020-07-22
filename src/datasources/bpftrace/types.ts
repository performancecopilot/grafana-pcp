import { PmapiQuery, TargetFormat } from '../lib/types';
import { DataSourceJsonData } from '@grafana/data';

export interface BPFtraceOptions extends DataSourceJsonData {
    hostspec?: string;
    retentionTime?: string;
}

export interface BPFtraceQuery extends PmapiQuery {}

export const defaultBPFtraceQuery = {
    expr: '',
    format: TargetFormat.TimeSeries,
};
