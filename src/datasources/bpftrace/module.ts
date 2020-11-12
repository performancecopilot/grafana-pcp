import { DataSourcePlugin } from '@grafana/data';
import { BPFtraceDataSource } from './datasource';
import { BPFtraceConfigEditor } from './configuration/BPFtraceConfigEditor';
import { BPFtraceQueryEditor } from './components/BPFtraceQueryEditor';
import { BPFtraceQuery, BPFtraceOptions } from './types';

export const plugin = new DataSourcePlugin<BPFtraceDataSource, BPFtraceQuery, BPFtraceOptions>(BPFtraceDataSource)
    .setConfigEditor(BPFtraceConfigEditor)
    .setQueryEditor(BPFtraceQueryEditor);
