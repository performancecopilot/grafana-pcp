import defaults from 'lodash/defaults';
import React, { PureComponent } from 'react';
import { InlineFormLabel } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { RedisOptions, RedisQuery, defaultRedisQuery } from '../types';
import RedisQueryField from './RedisQueryField';
import { isBlank } from '../../lib/utils';

type Props = QueryEditorProps<DataSource, RedisQuery, RedisOptions>;

interface State {
    expr: string;
    legendFormat?: string;
}

export class RedisQueryEditor extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const query = defaults(this.props.query, defaultRedisQuery);
        this.state = {
            expr: query.expr,
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

    onRunQuery = () => {
        this.props.onChange({
            ...this.props.query,
            expr: this.state.expr,
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
                </div>
            </div>
        );
    }
}
