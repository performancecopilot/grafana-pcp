import { css, cx } from 'emotion';
import { defaultsDeep } from 'lodash';
import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { isBlank } from '../../../common/utils';
import { Monaco } from '../../../components/monaco';
import { MonacoEditorLazy } from '../../../components/monaco/MonacoEditorLazy';
import { TargetFormat } from '../../../datasources/lib/types';
import { PCPBPFtraceDataSource } from '../datasource';
import { BPFtraceOptions, BPFtraceQuery, defaultBPFtraceQuery } from '../types';
import { registerLanguage } from './language/BPFtraceLanguage';

type Props = QueryEditorProps<PCPBPFtraceDataSource, BPFtraceQuery, BPFtraceOptions>;

const FORMAT_OPTIONS: Array<SelectableValue<string>> = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
    { label: 'Table', value: TargetFormat.CsvTable },
    { label: 'Flame Graph', value: TargetFormat.FlameGraph },
];

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat?: string;
    url?: string;
    hostspec?: string;
}

export class BPFtraceQueryEditor extends PureComponent<Props, State> {
    // don't create this object in the render method, otherwise it causes a componentDidUpdate() everytime
    editorOptions: { lineNumbers: 'on'; folding: boolean };

    constructor(props: Props) {
        super(props);
        const query = defaultsDeep({}, this.props.query, defaultBPFtraceQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) ?? FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
            url: query.url,
            hostspec: query.hostspec,
        };
        this.editorOptions = {
            lineNumbers: 'on',
            folding: true,
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

    getQuery = (): BPFtraceQuery => {
        return {
            refId: this.props.query.refId,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
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
        return `bpftrace@${url}@${hostspec}`;
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
                    height="300px"
                    options={this.editorOptions}
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
                        labelWidth={7}
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
                        tooltip="Override the host specification for this panel. Useful for monitoring remote hosts."
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
