import { getLogger } from 'loglevel';
import React from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Pagination, Stack, useTheme2 } from '@grafana/ui';
import { EntityType, TextItemResponse } from '../../../../common/services/pmsearch/types';
import Loader from '../../components/Loader/Loader';
import SearchResult from '../../components/SearchResult/SearchResult';
import { RootState } from '../../store/reducer';
import { openDetail, querySearch } from '../../store/slices/search/shared/actionCreators';
import { FetchStatus } from '../../store/slices/search/shared/state';
import { stripHtml } from '../../utils/utils';
import { paginationContainer, searchPageElapsed, searchPageMatchesDesc } from './styles';

const log = getLogger('search/SearchPage');

const mapStateToProps = (state: RootState) => ({
    result: state.search.result,
    query: state.search.query,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, AnyAction>) =>
    bindActionCreators({ querySearch, openDetail }, dispatch);

export type SearchPageReduxStateProps = ReturnType<typeof mapStateToProps>;

export type SearchPageReduxDispatchProps = ReturnType<typeof mapDispatchToProps>;

export type SearchPageReduxProps = SearchPageReduxStateProps & SearchPageReduxDispatchProps;

export type SearchPageProps = SearchPageReduxProps & { theme: GrafanaTheme2 };

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
            switch (entity.type) {
                case EntityType.Instance:
                case EntityType.InstanceDomain:
                    if (entity.indom) {
                        this.props.openDetail(entity.indom, EntityType.InstanceDomain);
                    }
                    break;
                case EntityType.Metric:
                    this.props.openDetail(stripHtml(entity.name), EntityType.Metric);
                    break;
                default:
            }
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
                    return <p>Enter query.</p>;
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
                        <Stack direction="column" gap={3}>
                            <Stack justifyContent="space-between" gap={2}>
                                {renderMatchesDesc()}
                                {renderSearchElapsedTime()}
                            </Stack>
                            <Stack direction="column" gap={3}>
                                {data.results.map((x, i) => (
                                    <SearchResult
                                        data-test={`search-result-${i}`}
                                        key={i}
                                        item={x}
                                        openDetail={onDetailClick}
                                    />
                                ))}
                            </Stack>
                            {pagesCount > 1 && (
                                <div className={paginationContainer} data-test="pagination">
                                    <Pagination
                                        numberOfPages={pagesCount}
                                        currentPage={currentPage}
                                        onNavigate={onPaginationClick}
                                    />
                                </div>
                            )}
                        </Stack>
                    );
                }
                return (
                    <Stack direction="column" gap={3}>
                        <h4>Results for &quot;{query.pattern}&quot;:</h4>
                        <p>There are no results.</p>
                    </Stack>
                );
            }
            case FetchStatus.ERROR: {
                log.error('Error fetching search results:', result.error);
                return <p>{result.error.toString()}</p>;
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

export default connect(mapStateToProps, mapDispatchToProps)(function SearchPageWithTheme(props: SearchPageReduxProps) {
    const theme = useTheme2();
    return <SearchPage {...props} theme={theme} />;
});
