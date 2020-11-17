import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { TargetFormat } from '../../datasources/lib/types';

export interface RedisOptions extends DataSourceJsonData {}

export interface RedisQuery extends DataQuery {
    expr: string;
    format: TargetFormat;
    legendFormat?: string;
}

export const defaultRedisQuery: Partial<RedisQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
};
