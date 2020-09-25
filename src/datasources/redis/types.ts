import { DataSourceJsonData, DataQuery } from '@grafana/data';

export interface RedisOptions extends DataSourceJsonData {}

export interface RedisQuery extends DataQuery {
    expr: string;
    legendFormat?: string;
}

export const defaultRedisQuery: Partial<RedisQuery> = {
    expr: '',
};
