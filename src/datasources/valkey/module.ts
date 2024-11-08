import { DataSourcePlugin } from '@grafana/data';
import { ValkeyQueryEditor } from './components/ValkeyQueryEditor';
import { ValkeyConfigEditor } from './configuration/ValkeyConfigEditor';
import { PCPValkeyDataSource } from './datasource';
import { ValkeyOptions, ValkeyQuery } from './types';

export const plugin = new DataSourcePlugin<PCPValkeyDataSource, ValkeyQuery, ValkeyOptions>(PCPValkeyDataSource)
    .setConfigEditor(ValkeyConfigEditor)
    .setQueryEditor(ValkeyQueryEditor);
