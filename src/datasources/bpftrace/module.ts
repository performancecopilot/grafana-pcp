import { DataSourcePlugin } from '@grafana/data';
import { PCPBPFtraceDataSource } from './datasource';
import { BPFtraceConfigEditor } from './configuration/BPFtraceConfigEditor';
import { BPFtraceQueryEditor } from './components/BPFtraceQueryEditor';
import { BPFtraceQuery, BPFtraceOptions } from './types';

export const plugin = new DataSourcePlugin<PCPBPFtraceDataSource, BPFtraceQuery, BPFtraceOptions>(PCPBPFtraceDataSource)
    .setConfigEditor(BPFtraceConfigEditor)
    .setQueryEditor(BPFtraceQueryEditor);
