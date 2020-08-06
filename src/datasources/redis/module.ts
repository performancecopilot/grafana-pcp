import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { RedisConfigEditor } from './configuration/RedisConfigEditor';
import { RedisQueryEditor } from './components/RedisQueryEditor';
import { RedisQuery, RedisOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, RedisQuery, RedisOptions>(DataSource)
    .setConfigEditor(RedisConfigEditor)
    .setQueryEditor(RedisQueryEditor);
