import { DataSourceJsonData, DataQuery } from '@grafana/data';

export interface RedisOptions extends DataSourceJsonData {
    hostspec?: string;
    retentionTime?: string;
}

export enum RedisQueryType {
    TimeSeries = 'time_series',
    MetricFindQuery = 'metric_find_query',
}

export interface RedisQuery extends DataQuery {
    expr: string;
    queryType?: RedisQueryType;
    legendFormat?: string;
}

export const defaultRedisQuery: Partial<RedisQuery> = {
    expr: '',
};

export interface SeriesTarget {
    query: RedisQuery;
    /** expr with adhoc filters applied */
    adhocExpr: string;
    series: string[];
}
