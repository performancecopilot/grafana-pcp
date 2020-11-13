import { DataSourcePlugin } from '@grafana/data';
import { PCPRedisDataSource } from './datasource';
import { RedisConfigEditor } from './configuration/RedisConfigEditor';
import { RedisQueryEditor } from './components/RedisQueryEditor';
import { RedisQuery, RedisOptions } from './types';

export const plugin = new DataSourcePlugin<PCPRedisDataSource, RedisQuery, RedisOptions>(PCPRedisDataSource)
    .setConfigEditor(RedisConfigEditor)
    .setQueryEditor(RedisQueryEditor);
