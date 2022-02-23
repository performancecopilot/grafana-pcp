import React, { SyntheticEvent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DataSourceHttpSettings, EventsWithValidation, LegacyForms, regexValidation } from '@grafana/ui';
import { Config } from '../config';
import { VectorOptions } from '../types';

const { Input, FormField } = LegacyForms;

export type Props = DataSourcePluginOptionsEditorProps<VectorOptions>;

export const timeSettingsValidationEvents = {
    [EventsWithValidation.onBlur]: [
        regexValidation(/^$|^\d+[hms]$/, 'Value is not valid, you can use number with time unit specifier: h, m, s'),
    ],
};

export const VectorConfigEditor = (props: Props) => {
    const { options, onOptionsChange } = props;

    const onOptionsChangeHandler = (optionName: string) => (eventItem: SyntheticEvent<HTMLInputElement>) => {
        onOptionsChange({
            ...options,
            jsonData: {
                ...options.jsonData,
                [optionName]: eventItem.currentTarget.value,
            },
        });
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
                <div className="gf-form-inline">
                    <div className="gf-form">
                        <FormField
                            label="Host specification"
                            labelWidth={12}
                            inputEl={
                                <Input
                                    className="width-18"
                                    value={options.jsonData.hostspec}
                                    spellCheck={false}
                                    placeholder={Config.defaults.hostspec}
                                    onChange={onOptionsChangeHandler('hostspec')}
                                />
                            }
                            tooltip="Performance Co-Pilot host specification."
                        />
                    </div>
                </div>
                <div className="gf-form-inline">
                    <div className="gf-form">
                        <FormField
                            label="Metric values retention time"
                            labelWidth={12}
                            inputEl={
                                <Input
                                    className="width-6"
                                    value={options.jsonData.retentionTime}
                                    spellCheck={false}
                                    placeholder={Config.defaults.retentionTime}
                                    onChange={onOptionsChangeHandler('retentionTime')}
                                    validationEvents={timeSettingsValidationEvents}
                                />
                            }
                            tooltip="Retention time of the in-browser metric storage."
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
