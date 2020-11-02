import React from 'react';
import { SelectableValue } from '@grafana/data';
import Labels from '../Labels/Labels';
import Meta from '../Meta/Meta';
import { VerticalGroup, RadioButtonGroup } from '@grafana/ui';
import { MetricEntitySeries } from '../../../../models/entities/metric';
import { radioBtnGroupContainer } from '../../styles';
import { openDetail } from '../../../../store/slices/search/shared/actionCreators';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../../store/reducer';
import { AnyAction, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { EntityType } from 'common/services/pmsearch/types';

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, AnyAction>) =>
    bindActionCreators({ openDetail }, dispatch);

export interface SeriesBasicProps {
    initTab?: SeriesTabOpt;
    series: MetricEntitySeries;
}

export type SeriesReduxDispatchProps = ReturnType<typeof mapDispatchToProps>;

export type SeriesReduxProps = SeriesReduxDispatchProps;

export type SeriesProps = SeriesBasicProps & SeriesReduxProps;

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
        this.onIndomClick = this.onIndomClick.bind(this);
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

    onIndomClick(indom: string) {
        this.props.openDetail(indom, EntityType.InstanceDomain);
    }

    renderTab() {
        const { state, props, onIndomClick } = this;
        const { selectedOption } = state;
        const { series } = props;
        switch (selectedOption) {
            case SeriesTabOpt.Labels: {
                if (series.labels) {
                    return <Labels labels={series.labels} data-test="labels" />;
                }
                return <p>No labels available.</p>;
            }
            case SeriesTabOpt.Meta:
                return <Meta meta={series.meta} onIndomClick={onIndomClick} data-test="meta" />;
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

export default connect(null, mapDispatchToProps)(Series);
