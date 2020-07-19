import React from 'react';
import { SelectableValue } from '@grafana/data';
import Labels from '../Labels/Labels';
import Meta from '../Meta/Meta';
import { VerticalGroup, RadioButtonGroup } from '@grafana/ui';
import { MetricEntitySeries } from '../../../../models/entities/metric';
import { radioBtnGroupContainer } from '../../styles';

export interface SeriesProps {
    initTab?: SeriesTabOpt;
    series: MetricEntitySeries;
}

export interface SeriesState {
    selectedOption: SeriesTabOpt;
    options: Array<SelectableValue<SeriesTabOpt>>;
}

export enum SeriesTabOpt {
    Labels = 'labels',
    Meta = 'meta',
}

export class Series extends React.Component<SeriesProps, SeriesState> {
    state: SeriesState = this.initialState;

    constructor(props: SeriesProps) {
        super(props);
        if (props.initTab) {
            this.state = { ...this.state, selectedOption: props.initTab };
        }
        this.setSelected = this.setSelected.bind(this);
        this.renderTab = this.renderTab.bind(this);
    }

    get initialState() {
        return {
            selectedOption: SeriesTabOpt.Meta,
            options: [
                { label: 'Metadata', value: SeriesTabOpt.Meta },
                { label: 'Labels', value: SeriesTabOpt.Labels },
            ],
        };
    }

    renderTab() {
        const { state, props } = this;
        const { selectedOption } = state;
        const { series } = props;
        switch (selectedOption) {
            case SeriesTabOpt.Labels: {
                if (series.labels) {
                    return <Labels labels={series.labels} data-test="labels" />;
                }
                return <p>Doesn't have labels.</p>;
            }
            case SeriesTabOpt.Meta:
                return <Meta meta={series.meta} data-test="meta" />;
            default:
                return;
        }
    }

    setSelected(selectedOption?: SeriesTabOpt) {
        if (selectedOption) {
            this.setState({ selectedOption });
        }
    }

    render() {
        const { state, renderTab, setSelected, props } = this;
        return (
            <VerticalGroup spacing="md">
                <h3 title="Series" data-test="series-name">
                    {props.series.series}
                </h3>
                <div className={radioBtnGroupContainer}>
                    <RadioButtonGroup
                        options={state.options}
                        disabled={false}
                        value={state.selectedOption}
                        onChange={setSelected}
                        size="md"
                        data-test="tab-switcher"
                        fullWidth
                    />
                </div>
                {renderTab()}
            </VerticalGroup>
        );
    }
}

export default Series;
