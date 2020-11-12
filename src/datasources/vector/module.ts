import { DataSourcePlugin } from '@grafana/data';
import { PCPVectorDataSource } from './datasource';
import { VectorConfigEditor } from './configuration/VectorConfigEditor';
import { VectorQueryEditor } from './components/VectorQueryEditor';
import { VectorQuery, VectorOptions } from './types';

export const plugin = new DataSourcePlugin<PCPVectorDataSource, VectorQuery, VectorOptions>(PCPVectorDataSource)
    .setConfigEditor(VectorConfigEditor)
    .setQueryEditor(VectorQueryEditor);
