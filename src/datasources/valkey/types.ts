import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { TargetFormat } from '../../datasources/lib/types';

export interface ValkeyOptions extends DataSourceJsonData {}

export interface ValkeyQueryOptions {
    rateConversion: boolean;
    timeUtilizationConversion: boolean;
}

export interface ValkeyQuery extends DataQuery {
    expr: string;
    format: TargetFormat;
    legendFormat?: string;
    options?: Partial<ValkeyQueryOptions>;
}

export const defaultValkeyQuery: Partial<ValkeyQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
    options: {
        rateConversion: true,
        timeUtilizationConversion: true,
    },
};
