import React, { SyntheticEvent, useState } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DataSourceHttpSettings, Field, Input } from '@grafana/ui';
import { Config } from '../config';
import { VectorOptions } from '../types';

export type Props = DataSourcePluginOptionsEditorProps<VectorOptions>;

const retentionTimePattern = /^$|^\d+[hms]$/;

export const VectorConfigEditor = (props: Props) => {
    const { options, onOptionsChange } = props;
    const [retentionTimeError, setRetentionTimeError] = useState('');

    const onOptionsChangeHandler = (optionName: string) => (eventItem: SyntheticEvent<HTMLInputElement>) => {
        onOptionsChange({
            ...options,
            jsonData: {
                ...options.jsonData,
                [optionName]: eventItem.currentTarget.value,
            },
        });
    };

    const onRetentionTimeBlur = (eventItem: SyntheticEvent<HTMLInputElement>) => {
        const value = eventItem.currentTarget.value;
        if (!retentionTimePattern.test(value)) {
            setRetentionTimeError('Value is not valid, you can use number with time unit specifier: h, m, s');
        } else {
            setRetentionTimeError('');
        }
        onOptionsChangeHandler('retentionTime')(eventItem);
    };

    return (
        <>
            <DataSourceHttpSettings
                defaultUrl="http://localhost:44322"
                dataSourceConfig={options}
                showAccessOptions={true}
                onChange={onOptionsChange}
            />

            <h3 className="page-heading">Vector Settings</h3>
            <div className="gf-form-group">
                <Field label="Host specification" description="Performance Co-Pilot host specification.">
                    <Input
                        width={18}
                        value={options.jsonData.hostspec}
                        spellCheck={false}
                        placeholder={Config.defaults.hostspec}
                        onChange={onOptionsChangeHandler('hostspec')}
                    />
                </Field>
                <Field
                    label="Metric values retention time"
                    description="Retention time of the in-browser metric storage."
                    invalid={!!retentionTimeError}
                    error={retentionTimeError}
                >
                    <Input
                        width={6}
                        value={options.jsonData.retentionTime}
                        spellCheck={false}
                        placeholder={Config.defaults.retentionTime}
                        onChange={onOptionsChangeHandler('retentionTime')}
                        onBlur={onRetentionTimeBlur}
                    />
                </Field>
            </div>
        </>
    );
};
