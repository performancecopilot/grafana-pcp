import { DataSourcePlugin } from '@grafana/data';
import { VectorQueryEditor } from './components/VectorQueryEditor';
import { VectorConfigEditor } from './configuration/VectorConfigEditor';
import { PCPVectorDataSource } from './datasource';
import { VectorOptions, VectorQuery } from './types';

export const plugin = new DataSourcePlugin<PCPVectorDataSource, VectorQuery, VectorOptions>(PCPVectorDataSource)
    .setConfigEditor(VectorConfigEditor)
    .setQueryEditor(VectorQueryEditor);
