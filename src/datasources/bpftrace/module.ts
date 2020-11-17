import { DataSourcePlugin } from '@grafana/data';
import { BPFtraceQueryEditor } from './components/BPFtraceQueryEditor';
import { BPFtraceConfigEditor } from './configuration/BPFtraceConfigEditor';
import { PCPBPFtraceDataSource } from './datasource';
import { BPFtraceOptions, BPFtraceQuery } from './types';

export const plugin = new DataSourcePlugin<PCPBPFtraceDataSource, BPFtraceQuery, BPFtraceOptions>(PCPBPFtraceDataSource)
    .setConfigEditor(BPFtraceConfigEditor)
    .setQueryEditor(BPFtraceQueryEditor);
