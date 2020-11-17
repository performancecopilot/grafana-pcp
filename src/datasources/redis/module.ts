import { DataSourcePlugin } from '@grafana/data';
import { RedisQueryEditor } from './components/RedisQueryEditor';
import { RedisConfigEditor } from './configuration/RedisConfigEditor';
import { PCPRedisDataSource } from './datasource';
import { RedisOptions, RedisQuery } from './types';

export const plugin = new DataSourcePlugin<PCPRedisDataSource, RedisQuery, RedisOptions>(PCPRedisDataSource)
    .setConfigEditor(RedisConfigEditor)
    .setQueryEditor(RedisQueryEditor);
