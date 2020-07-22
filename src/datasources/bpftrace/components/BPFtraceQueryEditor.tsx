import defaults from 'lodash/defaults';
import React, { PureComponent } from 'react';
import { InlineFormLabel, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { BPFtraceOptions, BPFtraceQuery, defaultBPFtraceQuery } from '../types';
import BPFtraceQueryField from './BPFtraceQueryField';
import { isBlank } from '../../lib/utils';
import { TargetFormat } from '../../lib/types';

const FORMAT_OPTIONS: Array<SelectableValue<string>> = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Table', value: TargetFormat.MetricsTable },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
];

type Props = QueryEditorProps<DataSource, BPFtraceQuery, BPFtraceOptions>;

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat?: string;
    url?: string;
    hostspec?: string;
}

export class BPFtraceQueryEditor extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const query = defaults(this.props.query, defaultBPFtraceQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) ?? FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
            url: query.url,
            hostspec: query.hostspec,
        };
    }

    onExprChange = (expr: string) => {
        this.setState({ expr }, this.onRunQuery);
    };

    onLegendFormatChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const legendFormat = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ legendFormat }, this.onRunQuery);
    };

    onFormatChange = (format: SelectableValue<string>) => {
        this.setState({ format }, this.onRunQuery);
    };

    onURLChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const url = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ url }, this.onRunQuery);
    };

    onHostspecChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const hostspec = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ hostspec }, this.onRunQuery);
    };

    onRunQuery = () => {
        this.props.onChange({
            ...this.props.query,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
            url: this.state.url,
            hostspec: this.state.hostspec,
        });
        this.props.onRunQuery();
    };

    render() {
        return (
            <div>
                <BPFtraceQueryField expr={this.state.expr} onChange={this.onExprChange} />

                <div className="gf-form-inline">
                    <div className="gf-form">
                        <InlineFormLabel
                            width={7}
                            tooltip="Controls the name of the time series, using name or pattern. For example
                            $instance will be replaced with the instance name.
                            Available variables: $metric, $metric0, $instance and $labelName."
                        >
                            Legend
                        </InlineFormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="legend format"
                            value={this.state.legendFormat}
                            onChange={this.onLegendFormatChange}
                            onBlur={this.onRunQuery}
                        />
                    </div>

                    <div className="gf-form">
                        <div className="gf-form-label">Format</div>
                        <Select
                            className="width-9"
                            isSearchable={false}
                            options={FORMAT_OPTIONS}
                            value={this.state.format}
                            onChange={this.onFormatChange}
                        />
                    </div>

                    <div className="gf-form">
                        <InlineFormLabel
                            width={5}
                            tooltip="Override the URL to pmproxy for this panel. Useful in combination with templating."
                        >
                            URL
                        </InlineFormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="override URL"
                            value={this.state.url}
                            onChange={this.onURLChange}
                            onBlur={this.onRunQuery}
                        />
                    </div>

                    <div className="gf-form">
                        <InlineFormLabel
                            width={9}
                            tooltip="Override the host specification for this panel. Useful for monitoring remote hosts."
                        >
                            Host specification
                        </InlineFormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="override host specification"
                            value={this.state.hostspec}
                            onChange={this.onHostspecChange}
                            onBlur={this.onRunQuery}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
