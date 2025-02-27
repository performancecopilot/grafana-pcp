import { css, cx } from 'emotion';
import { defaultsDeep } from 'lodash';
import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { Select, InlineFieldRow, InlineField, InlineSwitch, Input } from '@grafana/ui';
import { isBlank } from '../../../common/utils';
import { Monaco } from '../../../components/monaco';
import { MonacoEditorLazy } from '../../../components/monaco/MonacoEditorLazy';
import { TargetFormat } from '../../../datasources/lib/types';
import { PCPValkeyDataSource } from '../datasource';
import { defaultValkeyQuery, ValkeyOptions, ValkeyQuery, ValkeyQueryOptions } from '../types';
import { registerLanguage } from './language/PmseriesLanguage';

type Props = QueryEditorProps<PCPValkeyDataSource, ValkeyQuery, ValkeyOptions>;

const FORMAT_OPTIONS: Array<SelectableValue<string>> = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
    { label: 'Geomap', value: TargetFormat.Geomap },
];

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat?: string;
    options: ValkeyQueryOptions;
}

export class ValkeyQueryEditor extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const query = defaultsDeep({}, this.props.query, defaultValkeyQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) ?? FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
            options: {
                rateConversion: query.options.rateConversion,
                timeUtilizationConversion: query.options.timeUtilizationConversion,
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

    onRateConversionChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const rateConversion = (event.target as HTMLInputElement).checked;
        this.setState({ options: { ...this.state.options, rateConversion } }, this.runQuery);
    };

    onTimeUtilizationConversionChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const timeUtilizationConversion = (event.target as HTMLInputElement).checked;
        this.setState({ options: { ...this.state.options, timeUtilizationConversion } }, this.runQuery);
    };

    getQuery = (): ValkeyQuery => {
        return {
            ...this.props.query,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
            options: {
                rateConversion: this.state.options.rateConversion,
                timeUtilizationConversion: this.state.options.timeUtilizationConversion,
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

                    <InlineField label="Rate Conversion" tooltip="Counter metrics will be converted to a rate">
                        <InlineSwitch
                            value={this.state.options.rateConversion}
                            onChange={this.onRateConversionChange}
                        />
                    </InlineField>

                    <InlineField
                        label="Time Utilization Conversion"
                        tooltip="Time-based counter metrics will be converted to a utilization (for example kernel.all.cpu.user)"
                    >
                        <InlineSwitch
                            value={this.state.options.timeUtilizationConversion}
                            onChange={this.onTimeUtilizationConversionChange}
                        />
                    </InlineField>
                </InlineFieldRow>
            </div>
        );
    }
}
