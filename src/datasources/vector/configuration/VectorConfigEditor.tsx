import React, { SyntheticEvent } from 'react';
import { DataSourceHttpSettings, FormField, Input, EventsWithValidation, regexValidation } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { VectorOptions } from '../types';

export type Props = DataSourcePluginOptionsEditorProps<VectorOptions>;

/* copied from PromSettings.tsx */
export const timeSettingsValidationEvents = {
    [EventsWithValidation.onBlur]: [
        regexValidation(
            /^$|^\d+(ms|[Mwdhmsy])$/,
            'Value is not valid, you can use number with time unit specifier: y, M, w, d, h, m, s'
        ),
    ],
};

export const VectorConfigEditor = (props: Props) => {
    const { options, onOptionsChange } = props;

    const onOptionsChangeHandler = (optionName: string) => (eventItem: SyntheticEvent<HTMLInputElement>) => {
        onOptionsChange({
            ...options,
            jsonData: {
                ...options.jsonData,
                [optionName]: eventItem.currentTarget.value
            }
        });
    };

    return (
        <>
            <DataSourceHttpSettings defaultUrl="http://localhost:44323" dataSourceConfig={options} showAccessOptions={true} onChange={onOptionsChange} />

            <h3 className="page-heading">Vector Settings</h3>
            <div className="gf-form-group">
                <div className="gf-form-inline">
                    <div className="gf-form">
                        <FormField
                            label="Metric values retention time"
                            labelWidth={14}
                            placeholder="10m"
                            inputEl={
                                <Input
                                    className="width-6"
                                    value={options.jsonData.retentionTime}
                                    spellCheck={false}
                                    onChange={onOptionsChangeHandler("retentionTime")}
                                    validationEvents={timeSettingsValidationEvents}
                                />
                            }
                            tooltip="Retention time of the in-browser metric storage. Defaults to 10m."
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
