import React from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { RedisOptions } from '../types';

export type Props = DataSourcePluginOptionsEditorProps<RedisOptions>;

export const RedisConfigEditor = (props: Props) => {
    const { options, onOptionsChange } = props;

    return (
        <>
            <DataSourceHttpSettings
                defaultUrl="http://localhost:44323"
                dataSourceConfig={options}
                showAccessOptions={true}
                onChange={onOptionsChange}
            />
        </>
    );
};
