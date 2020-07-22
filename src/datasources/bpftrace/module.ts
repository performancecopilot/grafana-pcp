import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { BPFtraceConfigEditor } from './configuration/BPFtraceConfigEditor';
import { BPFtraceQueryEditor } from './components/BPFtraceQueryEditor';
import { BPFtraceQuery, BPFtraceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, BPFtraceQuery, BPFtraceOptions>(DataSource)
    .setConfigEditor(BPFtraceConfigEditor)
    .setQueryEditor(BPFtraceQueryEditor);
