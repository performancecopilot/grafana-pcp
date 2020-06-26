import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { VectorConfigEditor } from './configuration/VectorConfigEditor';
import { VectorQueryEditor } from './components/VectorQueryEditor';
import { VectorQuery, VectorOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, VectorQuery, VectorOptions>(DataSource)
    .setConfigEditor(VectorConfigEditor)
    .setQueryEditor(VectorQueryEditor);
