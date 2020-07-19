import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { LoadMetricAction, LoadIndomAction, LoadMetricSiblingsAction } from './actions';
import {
    LOAD_METRIC_INIT,
    LOAD_METRIC_PENDING,
    LOAD_METRIC_SUCCESS,
    LOAD_METRIC_ERROR,
    LOAD_INDOM_INIT,
    LOAD_INDOM_PENDING,
    LOAD_INDOM_SUCCESS,
    LOAD_INDOM_ERROR,
    LOAD_METRIC_SIBLINGS_INIT,
    LOAD_METRIC_SIBLINGS_PENDING,
    LOAD_METRIC_SIBLINGS_SUCCESS,
    LOAD_METRIC_SIBLINGS_ERROR,
} from './types';
import { Services } from '../../../../../services/services';
import { indomFetchEndpoint } from '../../../../../mocks/endpoints';
export const loadMetric = (id: string): ThunkAction<Promise<string>, {}, Services, LoadMetricAction> => async (
    dispatch: ThunkDispatch<{}, {}, LoadMetricAction>,
    {},
    { entityService }
): Promise<string> => {
    dispatch({ type: LOAD_METRIC_INIT });
    dispatch({ type: LOAD_METRIC_PENDING });
    try {
        const data = await entityService.metric(id);
        dispatch({
            type: LOAD_METRIC_SUCCESS,
            payload: {
                data,
            },
        });
        return data.name;
    } catch (e) {
        dispatch({ type: LOAD_METRIC_ERROR });
        throw e;
    }
};

export const loadMetricSiblings = (
    metricName: string
): ThunkAction<Promise<void>, {}, Services, LoadMetricSiblingsAction> => async (
    dispatch: ThunkDispatch<{}, {}, LoadMetricSiblingsAction>,
    {},
    { seriesService }
): Promise<void> => {
    dispatch({ type: LOAD_METRIC_SIBLINGS_INIT });
    dispatch({ type: LOAD_METRIC_SIBLINGS_PENDING });
    try {
        const parents = metricName.split('.').slice(0, -1);
        const data = (await seriesService.metrics({ match: `${parents.join('.')}*` })) as string[];
        dispatch({
            type: LOAD_METRIC_SIBLINGS_SUCCESS,
            payload: {
                data: data.sort(),
            },
        });
    } catch (e) {
        dispatch({ type: LOAD_METRIC_SIBLINGS_ERROR });
        throw e;
    }
};

export const loadIndom = (id: string): ThunkAction<Promise<void>, {}, Services, LoadIndomAction> => async (
    dispatch: ThunkDispatch<{}, {}, LoadIndomAction>,
    {},
    {}
): Promise<void> => {
    dispatch({ type: LOAD_INDOM_INIT });
    dispatch({ type: LOAD_INDOM_PENDING });
    try {
        const data = await indomFetchEndpoint(id);
        dispatch({
            type: LOAD_INDOM_SUCCESS,
            payload: {
                data,
            },
        });
    } catch {
        dispatch({ type: LOAD_INDOM_ERROR });
    }
};
