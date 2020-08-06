import { TargetFormat, PcpTarget } from '../lib/models/pcp';
import { DataSourceJsonData, DataQuery } from '@grafana/data';

export interface RedisOptions extends DataSourceJsonData {
    hostspec?: string;
    retentionTime?: string;
}

export interface RedisQuery extends DataQuery {
    expr: string;
    format: TargetFormat;
    legendFormat?: string;
}

export const defaultRedisQuery: Partial<RedisQuery> = {
    expr: '',
    format: TargetFormat.TimeSeries,
};

export interface SeriesTarget extends PcpTarget<{}> {
    query: RedisQuery;
    /** expr with adhoc filters applied */
    adhocExpr: string;
    series: string[];
}
