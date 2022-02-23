import { cx } from 'emotion';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Button, Themeable, VerticalGroup, withTheme } from '@grafana/ui';
import { EntityType } from '../../../../common/services/pmsearch/types';
import BookmarkList from '../../components/BookmarkList/BookmarkList';
import Loader from '../../components/Loader/Loader';
import SearchHistoryList from '../../components/SearchHistoryList/SearchHistoryList';
import { RootState } from '../../store/reducer';
import { openDetail, querySearch } from '../../store/slices/search/shared/actionCreators';
import { FetchStatus } from '../../store/slices/search/shared/state';
import { clearBookmarks } from '../../store/slices/search/slices/bookmarks/actionCreators';
import { InstanceDomainDetailState, MetricDetailState } from '../../store/slices/search/slices/entity/state';
import { clearSearchHistory } from '../../store/slices/search/slices/history/actionCreators';
import { ViewState } from '../../store/slices/search/slices/view/state';
import { asideButton, asideButtonInactive, asideContainer } from './styles';

const mapStateToProps = (state: RootState) => ({
    view: state.search.view,
    entity: state.search.entity,
    searchHistory: state.search.history,
    bookmarks: state.search.bookmarks,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, AnyAction>) =>
    bindActionCreators({ openDetail, querySearch, clearBookmarks, clearSearchHistory }, dispatch);

export type AsideReduxStateProps = ReturnType<typeof mapStateToProps>;

export type AsideReduxDispatchProps = ReturnType<typeof mapDispatchToProps>;

export type AsideReduxProps = AsideReduxStateProps & AsideReduxDispatchProps;

export type AsideProps = AsideReduxProps & Themeable;

export class Aside extends React.Component<AsideProps, {}> {
    constructor(props: AsideProps) {
        super(props);
        this.renderContents = this.renderContents.bind(this);
        this.renderMetricSiblings = this.renderMetricSiblings.bind(this);
        this.renderIndomMetrics = this.renderIndomMetrics.bind(this);
        this.onMetricClick = this.onMetricClick.bind(this);
    }

    onMetricClick(metricName: string) {
        this.props.openDetail(metricName, EntityType.Metric);
    }

    renderMetricSiblings(metricDetail: MetricDetailState) {
        const { onMetricClick, props } = this;
        const { siblings, metric } = metricDetail;
        switch (siblings?.status) {
            case FetchStatus.INIT:
                return;
            case FetchStatus.PENDING:
                return (
                    <Loader loaded={false} data-test="loader">
                        <p>Loading metric siblings &hellip;</p>
                    </Loader>
                );
            case FetchStatus.SUCCESS: {
                if (!siblings) {
                    return <p>Incorrect response from server.</p>;
                }
                if (siblings.data?.length === 0) {
                    return;
                }
                return (
                    <VerticalGroup spacing="md">
                        <h4>Series of similar metrics</h4>
                        <VerticalGroup spacing="xs">
                            {siblings.data?.map((m, i) =>
                                m === metric.data?.name ? (
                                    <Button
                                        key={i}
                                        icon="info-circle"
                                        variant="link"
                                        className={cx(asideButton, asideButtonInactive(props.theme))}
                                        data-test="sibling-link"
                                    >
                                        {m}
                                    </Button>
                                ) : (
                                    <Button
                                        key={i}
                                        onClick={() => onMetricClick(m)}
                                        icon="arrow-right"
                                        variant="link"
                                        className={asideButton}
                                        data-test="sibling-link"
                                    >
                                        {m}
                                    </Button>
                                )
                            )}
                        </VerticalGroup>
                    </VerticalGroup>
                );
            }
            case FetchStatus.ERROR:
                return <p data-test="error-loading">Unable to fetch metric siblings.</p>;
            default:
                return;
        }
    }

    renderIndomMetrics(indomDetail: InstanceDomainDetailState) {
        const { onMetricClick } = this;
        const { indom } = indomDetail;
        switch (indom.status) {
            case FetchStatus.INIT:
                return;
            case FetchStatus.PENDING:
                return (
                    <Loader loaded={false} data-test="loader">
                        <p>Loading metrics &hellip;</p>
                    </Loader>
                );
            case FetchStatus.SUCCESS: {
                if (!indom) {
                    return <p>Incorrect response from server.</p>;
                }
                if (!indom.data?.indom) {
                    return;
                }
                return (
                    <VerticalGroup spacing="md">
                        <h4>Metrics in {indom.data.indom.name}</h4>
                        <VerticalGroup spacing="xs">
                            {indom.data.metrics.map(
                                (m, i) =>
                                    m.name !== undefined && (
                                        <Button
                                            key={i}
                                            onClick={() => onMetricClick(m.name as string)}
                                            icon="arrow-right"
                                            variant="link"
                                            className={asideButton}
                                            data-test="sibling-link"
                                            title={m.oneline}
                                        >
                                            {m.name}
                                        </Button>
                                    )
                            )}
                        </VerticalGroup>
                    </VerticalGroup>
                );
            }
            case FetchStatus.ERROR:
                return <p data-test="error-loading">Unable to fetch indom metrics.</p>;
            default:
                return;
        }
    }

    renderContents() {
        const { renderMetricSiblings, renderIndomMetrics, props } = this;
        const { view, entity } = props;
        switch (view) {
            case ViewState.Detail: {
                if (!entity) {
                    return;
                }
                switch (entity.type) {
                    case EntityType.Metric:
                        return renderMetricSiblings(entity);
                    case EntityType.InstanceDomain:
                        return renderIndomMetrics(entity);
                    default:
                        return;
                }
            }
            case ViewState.Search: {
                return (
                    <VerticalGroup spacing="lg">
                        <BookmarkList
                            showClearBtn={false}
                            multiCol={false}
                            bookmarks={props.bookmarks}
                            onBookmarkClick={props.openDetail}
                            onClearBookmarksClick={props.clearBookmarks}
                            data-test="bookmark-list"
                        />
                        <SearchHistoryList
                            showClearBtn={false}
                            multiCol={false}
                            searchHistory={props.searchHistory}
                            onSearchHistoryClick={props.querySearch}
                            onClearSearchHistoryClick={props.clearSearchHistory}
                            data-test="search-history-list"
                        />
                    </VerticalGroup>
                );
            }
            default:
                return;
        }
    }

    render() {
        const { renderContents } = this;
        return <div className={asideContainer}>{renderContents()}</div>;
    }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Aside));
