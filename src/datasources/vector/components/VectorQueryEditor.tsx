import defaults from 'lodash/defaults';
import React, { PureComponent } from 'react';
import { FormLabel, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { VectorOptions, VectorQuery, defaultQuery, TargetFormat } from '../types';
import VectorQueryField from './VectorQueryField';
import { isBlank } from '../utils';


const FORMAT_OPTIONS: SelectableValue<string>[] = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Table', value: TargetFormat.MetricsTable },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
];

type Props = QueryEditorProps<DataSource, VectorQuery, VectorOptions>;

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat: string;
    url?: string;
    container?: string;
}

export class VectorQueryEditor extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        const query = defaults(this.props.query, defaultQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) || FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
            url: query.url,
            container: query.container,
        };

        // TODO: containers
    }

    onExprChange = (expr: string) => {
        this.setState({ expr }, this.onRunQuery);
    };

    onLegendChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({ legendFormat: event.currentTarget.value }, this.onRunQuery);
    };

    onFormatChange = (format: SelectableValue<string>) => {
        this.setState({ format }, this.onRunQuery);
    };

    onURLChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const url = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ url }, this.onRunQuery);
    };

    onContainerChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const container = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ container }, this.onRunQuery);
    };

    onRunQuery = () => {
        this.props.onChange({
            ...this.props.query,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
            url: this.state.url,
            container: this.state.container,
        });
        this.props.onRunQuery();
    };

    render() {
        return (
            <div>
                <VectorQueryField
                    expr={this.state.expr}
                    onChange={this.onExprChange}
                />

                <div className="gf-form-inline">
                    <div className="gf-form">
                        <FormLabel
                            width={7}
                            tooltip="Controls the name of the time series, using name or pattern. For example
                            ${instance} will be replaced with the instance name.
                            Available variables: metric, metric0 and instance."
                        >
                            Legend
                        </FormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="legend format"
                            value={this.state.legendFormat}
                            onChange={this.onLegendChange}
                            onBlur={this.onRunQuery}
                        />
                    </div>

                    <div className="gf-form">
                        <div className="gf-form-label">Format</div>
                        <Select isSearchable={false} options={FORMAT_OPTIONS} value={this.state.format} onChange={this.onFormatChange} />
                    </div>

                    <div className="gf-form">
                        <FormLabel
                            width={5}
                            tooltip="Override the URL to pmproxy for this panel. Useful in combination with templating."
                        >
                            URL
                        </FormLabel>
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
                        <FormLabel
                            width={7}
                            tooltip="Specify the container (only possible with container-aware PMDAs)."
                        >
                            Container
                        </FormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="legend format"
                            value={this.state.container}
                            onChange={this.onContainerChange}
                            onBlur={this.onRunQuery}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
