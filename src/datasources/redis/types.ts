import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { TargetFormat } from '../../datasources/lib/types';

export interface RedisOptions extends DataSourceJsonData {}

export interface RedisQueryOptions {
    rateConversion: boolean;
    timeUtilizationConversion: boolean;
}

export interface RedisQuery extends DataQuery {
    expr: string;
    format: TargetFormat;
    legendFormat?: string;
    options?: Partial<RedisQueryOptions>;
}

export const defaultRedisQuery: Partial<RedisQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
    options: {
        rateConversion: true,
        timeUtilizationConversion: true,
    },
};
