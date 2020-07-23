import React from 'react';
import { VerticalGroup, Pagination, withTheme, Themeable, HorizontalGroup } from '@grafana/ui';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { paginationContainer, searchPageElapsed, searchPageMatchesDesc } from './styles';
import { RootState } from '../../store/reducer';
import { TextItemResponse } from '../../models/endpoints/search';
import { stripHtml } from '../../utils/utils';
import { FetchStatus } from '../../store/slices/search/shared/state';
import SearchResult from '../../components/SearchResult/SearchResult';
import Loader from '../../components/Loader/Loader';
import { querySearch, openDetail } from '../../store/slices/search/shared/actionCreators';

const mapStateToProps = (state: RootState) => ({
    result: state.search.result,
    query: state.search.query,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, AnyAction>) =>
    bindActionCreators({ querySearch, openDetail: openDetail }, dispatch);

export type SearchPageReduxStateProps = ReturnType<typeof mapStateToProps>;

export type SearchPageReduxDispatchProps = ReturnType<typeof mapDispatchToProps>;

export type SearchPageReduxProps = SearchPageReduxStateProps & SearchPageReduxDispatchProps;

export type SearchPageProps = SearchPageReduxProps & Themeable;

export class SearchPage extends React.Component<SearchPageProps, {}> {
    constructor(props: SearchPageProps) {
        super(props);
        this.onPaginationClick = this.onPaginationClick.bind(this);
        this.onDetailClick = this.onDetailClick.bind(this);
        this.renderResults = this.renderResults.bind(this);
        this.renderMatchesDesc = this.renderMatchesDesc.bind(this);
        this.renderSearchElapsedTime = this.renderSearchElapsedTime.bind(this);
    }

    get pagesCount() {
        const { result } = this.props;
        if (result?.data) {
            return Math.ceil(result.data.total / result.data.limit);
        }
        return 0;
    }

    get currentPage() {
        const { result } = this.props;
        if (result?.data) {
            return result.data.offset / result.data.limit + 1;
        }
        return 0;
    }

    onPaginationClick(pageNum: number) {
        const { query } = this.props;
        this.props.querySearch({ ...query, pageNum });
    }

    onDetailClick(entity: TextItemResponse) {
        if (entity.name !== undefined && entity.type !== undefined) {
            this.props.openDetail(stripHtml(entity.name), entity.type);
        }
    }

    renderMatchesDesc() {
        const { theme, result } = this.props;
        if (!result?.data) {
            return;
        }
        return (
            <div className={searchPageMatchesDesc(theme)}>
                <strong data-test="total">{result.data.total}</strong> results
            </div>
        );
    }

    renderSearchElapsedTime() {
        const { theme, result } = this.props;
        if (!result?.data) {
            return;
        }
        return (
            <div className={searchPageElapsed(theme)}>
                Elapsed:{' '}
                <strong>
                    <span data-test="elapsed">{result.data.elapsed}</span>s
                </strong>
            </div>
        );
    }

    renderResults() {
        const {
            props,
            onPaginationClick,
            onDetailClick,
            pagesCount,
            currentPage,
            renderMatchesDesc,
            renderSearchElapsedTime,
        } = this;
        const { result, query } = props;
        const { data, status } = result;
        switch (status) {
            case FetchStatus.INIT: {
                if (!data) {
                    <p>Enter query.</p>;
                }
            }
            case FetchStatus.PENDING:
                if (!data) {
                    return <p>Searching&hellip;</p>;
                }
            case FetchStatus.SUCCESS: {
                if (!data) {
                    return <p>Incorrect server response.</p>;
                }
                if (data.results.length > 0) {
                    return (
                        <VerticalGroup spacing="lg">
                            <HorizontalGroup justify="space-between" spacing="md">
                                {renderMatchesDesc()}
                                {renderSearchElapsedTime()}
                            </HorizontalGroup>
                            <VerticalGroup spacing="lg">
                                {data.results.map((x, i) => (
                                    <SearchResult
                                        data-test={`search-result-${i}`}
                                        key={i}
                                        item={x}
                                        openDetail={onDetailClick}
                                    />
                                ))}
                            </VerticalGroup>
                            {pagesCount > 1 && (
                                <div className={paginationContainer}>
                                    <Pagination
                                        data-test="pagination"
                                        numberOfPages={pagesCount}
                                        currentPage={currentPage}
                                        onNavigate={onPaginationClick}
                                    />
                                </div>
                            )}
                        </VerticalGroup>
                    );
                }
                return (
                    <VerticalGroup spacing="lg">
                        <h4>Results for '{query.pattern}':</h4>
                        <p>There are no results.</p>
                    </VerticalGroup>
                );
            }
            case FetchStatus.ERROR: {
                return <p>Error fetching values.</p>;
            }
        }
        return;
    }

    render() {
        const { renderResults, props } = this;
        return (
            <Loader data-test="loader" loaded={props.result?.status !== FetchStatus.PENDING}>
                {renderResults()}
            </Loader>
        );
    }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
