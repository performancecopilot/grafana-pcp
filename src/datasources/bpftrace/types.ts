import { Optional } from 'utility-types';
import { MinimalPmapiQuery, PmapiOptions, PmapiQuery } from '../../datasources/lib/pmapi/types';
import { TargetFormat } from '../../datasources/lib/types';
import { Script } from './script';

export interface BPFtraceOptions extends PmapiOptions {}

export interface BPFtraceQuery extends MinimalPmapiQuery {}

export const defaultBPFtraceQuery: BPFtraceQuery & Optional<PmapiQuery, 'url' | 'hostspec'> = {
    refId: 'A',
    expr: '',
    format: TargetFormat.TimeSeries,
    options: {
        rateConversation: true,
        timeUtilizationConversation: true,
    },
};

export interface BPFtraceTargetData {
    script: Script;
}
