import { Optional } from 'utility-types';
import { MinimalPmapiQuery, PmapiOptions, PmapiQuery } from '../../datasources/lib/pmapi/types';
import { TargetFormat } from '../../datasources/lib/types';

export interface VectorOptions extends PmapiOptions {}

export interface VectorQuery extends MinimalPmapiQuery {}

export const defaultVectorQuery: VectorQuery & Optional<PmapiQuery, 'url' | 'hostspec'> = {
    refId: 'A',
    expr: '',
    format: TargetFormat.TimeSeries,
    options: {
        rateConversation: true,
        timeUtilizationConversation: true,
    },
};

export interface VectorTargetData {}
