import { css, cx } from 'emotion';
import { defaultsDeep } from 'lodash';
import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, InlineSwitch, Input, Select } from '@grafana/ui';
import { isBlank } from '../../../common/utils';
import { Monaco } from '../../../components/monaco';
import { MonacoEditorLazy } from '../../../components/monaco/MonacoEditorLazy';
import { TargetFormat } from '../../../datasources/lib/types';
import { PmapiQueryOptions } from '../../lib/pmapi/types';
import { PCPVectorDataSource } from '../datasource';
import { defaultVectorQuery, VectorOptions, VectorQuery } from '../types';
import { registerLanguage } from './language/PmapiLanguage';

type Props = QueryEditorProps<PCPVectorDataSource, VectorQuery, VectorOptions>;

const FORMAT_OPTIONS: Array<SelectableValue<string>> = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
    { label: 'Table', value: TargetFormat.MetricsTable },
];

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat?: string;
    options: PmapiQueryOptions;
    url?: string;
    hostspec?: string;
}

export class VectorQueryEditor extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const query = defaultsDeep({}, this.props.query, defaultVectorQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) ?? FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
            options: {
                rateConversion: query.options.rateConversion,
                timeUtilizationConversion: query.options.rateConversion,
            },
            url: query.url,
            hostspec: query.hostspec,
        };
    }

    onExprChange = (expr: string) => {
        this.setState({ expr }, this.runQuery);
    };

    onLegendFormatChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const legendFormat = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ legendFormat }, this.runQuery);
    };

    onFormatChange = (format: SelectableValue<string>) => {
        this.setState({ format }, this.runQuery);
    };

    onURLChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const url = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ url }, this.runQuery);
    };

    onHostspecChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const hostspec = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ hostspec }, this.runQuery);
    };

    getQuery = (): VectorQuery => {
        return {
            refId: this.props.query.refId,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
            options: {
                rateConversion: this.state.options.rateConversion,
                timeUtilizationConversion: this.state.options.rateConversion,
            },
            url: this.state.url,
            hostspec: this.state.hostspec,
        };
    };

    runQuery = () => {
        this.props.onChange(this.getQuery());
        this.props.onRunQuery();
    };

    getLanguageId = () => {
        // there can be multiple Monaco query editors on the same page, each with
        // a different hostspec and therefore different completions
        const { url, hostspec } = this.props.datasource.getUrlAndHostspec(this.getQuery());
        return `pmapi@${url}@${hostspec}`;
    };

    onEditorWillMount = (monaco: Monaco) => {
        registerLanguage(monaco, this.getLanguageId(), this.props.datasource, this.getQuery);
    };

    render() {
        return (
            <div>
                <MonacoEditorLazy
                    language={this.getLanguageId()}
                    alwaysShowHelpText={true}
                    height="60px"
                    value={this.state.expr}
                    editorWillMount={this.onEditorWillMount}
                    onBlur={this.onExprChange}
                    onSave={this.onExprChange}
                />

                <InlineFieldRow
                    className={cx(
                        css`
                            margin-top: 6px;
                        `
                    )}
                >
                    <InlineField
                        label="Legend"
                        tooltip="Controls the name of the time series, using name or pattern. For example
                            $instance will be replaced with the instance name.
                            Available variables: $metric, $metric0, $instance and $labelName."
                        labelWidth={14}
                    >
                        <Input
                            placeholder="legend format"
                            value={this.state.legendFormat}
                            onChange={this.onLegendFormatChange}
                            onBlur={this.runQuery}
                        />
                    </InlineField>

                    <InlineField label="Format">
                        <Select
                            className="width-9"
                            isSearchable={false}
                            options={FORMAT_OPTIONS}
                            value={this.state.format}
                            onChange={this.onFormatChange}
                        />
                    </InlineField>

                </InlineFieldRow>

                <InlineFieldRow>
                    <InlineField
                        label="URL"
                        tooltip="Override the URL to pmproxy for this panel. Useful in combination with templating."
                        labelWidth={10}
                    >
                        <Input
                            placeholder="override URL"
                            value={this.state.url}
                            onChange={this.onURLChange}
                            onBlur={this.runQuery}
                        />
                    </InlineField>

                    <InlineField
                        label="Host specification"
                        tooltip="Override the host specification for this panel. Useful for monitoring remote hosts through a central pmproxy."
                        labelWidth={18}
                    >
                        <Input
                            placeholder="override host specification"
                            value={this.state.hostspec}
                            onChange={this.onHostspecChange}
                            onBlur={this.runQuery}
                        />
                    </InlineField>
                </InlineFieldRow>
            </div>
        );
    }
}
