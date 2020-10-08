import defaults from 'lodash/defaults';
import React, { PureComponent } from 'react';
import { InlineFormLabel } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { RedisOptions, RedisQuery, defaultRedisQuery } from '../types';
import { cx, css } from 'emotion';
import { MonacoEditorLazy } from '../../../components/monaco/MonacoEditorLazy';
import { PmseriesLanguageDefiniton } from './PmseriesLanguageDefiniton';
import { isBlank } from 'common/utils';

type Props = QueryEditorProps<DataSource, RedisQuery, RedisOptions>;

interface State {
    expr: string;
    legendFormat?: string;
}

export class RedisQueryEditor extends PureComponent<Props, State> {
    languageDefinition: PmseriesLanguageDefiniton;

    constructor(props: Props) {
        super(props);
        const query = defaults(this.props.query, defaultRedisQuery);
        this.state = {
            expr: query.expr,
            legendFormat: query.legendFormat,
        };
        this.languageDefinition = new PmseriesLanguageDefiniton(this.props.datasource);
    }

    onExprChange = (expr: string) => {
        this.setState({ expr }, this.runQuery);
    };

    onLegendFormatChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const legendFormat = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ legendFormat }, this.runQuery);
    };

    runQuery = () => {
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
                <MonacoEditorLazy
                    languageDefinition={this.languageDefinition}
                    height="60px"
                    value={this.state.expr}
                    onBlur={this.onExprChange}
                    onSave={this.onExprChange}
                />

                <div
                    className={cx(
                        'gf-form-inline',
                        css`
                            margin-top: 6px;
                        `
                    )}
                >
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
                            onBlur={this.runQuery}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
