import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { EntityType, TextItemResponseField } from '../../../../../../common/services/pmsearch/types';
import Config from '../../../../config/config';
import { Services } from '../../../../services/services';
import { RootState } from '../../../reducer';
import { loadIndom, loadMetric, loadMetricSiblings } from '../slices/entity/actionCreators';
import { EntityAction } from '../slices/entity/actions';
import { HistoryAction } from '../slices/history/actions';
import { ADD_HISTORY } from '../slices/history/types';
import { SetQueryAction } from '../slices/query/actions';
import { SET_QUERY } from '../slices/query/types';
import { LoadResultAction } from '../slices/result/actions';
import { ResultData } from '../slices/result/state';
import { LOAD_RESULT_ERROR, LOAD_RESULT_INIT, LOAD_RESULT_PENDING, LOAD_RESULT_SUCCESS } from '../slices/result/types';
import { SetViewAction, ViewAction } from '../slices/view/actions';
import { ViewState } from '../slices/view/state';
import { SET_VIEW } from '../slices/view/types';
import { SearchQuery } from './state';

type QuerySearchAction = LoadResultAction | SetViewAction | HistoryAction | SetQueryAction;

export type QuerySearchActionCreator = (
    query: SearchQuery
) => ThunkAction<Promise<void>, RootState, Services, QuerySearchAction>;

export const querySearch: QuerySearchActionCreator =
    query =>
    async (dispatch: ThunkDispatch<{}, {}, QuerySearchAction>, getState, { searchService }): Promise<void> => {
        dispatch({
            type: SET_VIEW,
            payload: ViewState.Search,
        });
        dispatch({
            type: LOAD_RESULT_INIT,
        });

        const limit = Config.RESULTS_PER_PAGE;
        const offset = (query.pageNum - 1) * limit;

        dispatch({
            type: SET_QUERY,
            payload: query,
        });

        try {
            dispatch({
                type: LOAD_RESULT_PENDING,
            });
            const { pattern, entityFlags } = query;
            const response = await searchService.text({
                query: pattern,
                type: entityFlags,
                limit,
                offset,
                highlight: [TextItemResponseField.Oneline, TextItemResponseField.Helptext, TextItemResponseField.Name],
            });
            const result: ResultData = {
                data: response,
            };
            dispatch({
                type: LOAD_RESULT_SUCCESS,
                payload: result,
            });
        } catch (error) {
            dispatch({
                type: LOAD_RESULT_ERROR,
                error,
            });
            return;
        }

        // Now check if we should update search history
        if (query.pageNum === 1) {
            const { history } = getState().search;
            if (!history.some(record => record.pattern === query.pattern && record.entityFlags === query.entityFlags)) {
                dispatch({
                    type: ADD_HISTORY,
                    payload: query,
                });
            }
        }
    };

type ClearSearchAction = SetQueryAction | ViewAction;

export type ClearSearchActionCreator = () => ThunkAction<void, RootState, {}, ClearSearchAction>;

export const clearSearch: ClearSearchActionCreator =
    () => (dispatch: ThunkDispatch<{}, {}, ClearSearchAction>, getState) => {
        const currentState = getState();
        dispatch({
            type: SET_QUERY,
            payload: {
                ...currentState.search.query,
                pattern: '',
            },
        });
        dispatch({
            type: SET_VIEW,
            payload: ViewState.Index,
        });
    };

type OpenDetailAction = EntityAction | ViewAction;

export type OpenDetailActionCreator = (
    id: string,
    type: EntityType
) => ThunkAction<Promise<void>, {}, Services, OpenDetailAction>;

export const openDetail: OpenDetailActionCreator =
    (id, type) =>
    async (dispatch: ThunkDispatch<{}, Services, OpenDetailAction>, {}): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch({
            type: SET_VIEW,
            payload: ViewState.Detail,
        });
        switch (type) {
            case EntityType.Metric: {
                return dispatch(loadMetric(id)).then(metricName => {
                    return dispatch(loadMetricSiblings(metricName));
                });
            }
            case EntityType.InstanceDomain: {
                return dispatch(loadIndom(id));
            }
        }
    };
