import defaults from 'lodash/defaults';
import React, { PureComponent } from 'react';
import { InlineFormLabel, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { RedisOptions, RedisQuery, defaultRedisQuery } from '../types';
import RedisQueryField from './RedisQueryField';
import { isBlank } from '../../lib/utils';
import { TargetFormat } from '../../lib/models/pcp';

const FORMAT_OPTIONS: Array<SelectableValue<string>> = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
    { label: 'Table', value: TargetFormat.MetricsTable },
];

type Props = QueryEditorProps<DataSource, RedisQuery, RedisOptions>;

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat?: string;
}

export class RedisQueryEditor extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const query = defaults(this.props.query, defaultRedisQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) ?? FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
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

    onRunQuery = () => {
        this.props.onChange({
            ...this.props.query,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
        });
        this.props.onRunQuery();
    };

    render() {
        return (
            <div>
                <RedisQueryField expr={this.state.expr} onChange={this.onExprChange} />

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
                </div>
            </div>
        );
    }
}
