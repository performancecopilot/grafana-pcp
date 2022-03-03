import { css, cx } from 'emotion';
import { defaultsDeep } from 'lodash';
import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { Select, InlineFieldRow, InlineField, InlineSwitch, Input } from '@grafana/ui';
import { isBlank } from '../../../common/utils';
import { Monaco } from '../../../components/monaco';
import { MonacoEditorLazy } from '../../../components/monaco/MonacoEditorLazy';
import { TargetFormat } from '../../../datasources/lib/types';
import { PCPRedisDataSource } from '../datasource';
import { defaultRedisQuery, RedisOptions, RedisQuery, RedisQueryOptions } from '../types';
import { registerLanguage } from './language/PmseriesLanguage';

type Props = QueryEditorProps<PCPRedisDataSource, RedisQuery, RedisOptions>;

const FORMAT_OPTIONS: Array<SelectableValue<string>> = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
];

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat?: string;
    options: RedisQueryOptions;
}

export class RedisQueryEditor extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const query = defaultsDeep({}, this.props.query, defaultRedisQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) ?? FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
            options: {
                rateConversion: query.options.rateConversion,
                timeUtilizationConversion: query.options.rateConversion,
            },
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

    onTimeUtilizationConversionChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const timeUtilizationConversion = (event.target as HTMLInputElement).checked;
        this.setState({ options: { ...this.state.options, timeUtilizationConversion } }, this.runQuery);
    };

    getQuery = (): RedisQuery => {
        return {
            ...this.props.query,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
            options: {
                rateConversion: this.state.options.rateConversion,
                timeUtilizationConversion: this.state.options.rateConversion,
            },
        };
    };

    runQuery = () => {
        this.props.onChange(this.getQuery());
        this.props.onRunQuery();
    };

    getLanguageId = () => {
        // there can be multiple Monaco query editors on the same page, each with
        // a different datasource (i.e. different pmproxy URL) and therefore different completions
        return `pmseries${this.props.datasource.id}`;
    };

    onEditorWillMount = (monaco: Monaco) => {
        registerLanguage(monaco, this.getLanguageId(), this.props.datasource);
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
            </div>
        );
    }
}
