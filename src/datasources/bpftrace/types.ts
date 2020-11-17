import { PmapiOptions, PmapiQuery } from '../../datasources/lib/pmapi/types';
import { TargetFormat } from '../../datasources/lib/types';
import { Script } from './script';

export interface BPFtraceOptions extends PmapiOptions {}

export interface BPFtraceQuery extends PmapiQuery {}

export const defaultBPFtraceQuery = {
    expr: '',
    format: TargetFormat.TimeSeries,
};

export interface BPFtraceTargetData {
    script: Script;
}
