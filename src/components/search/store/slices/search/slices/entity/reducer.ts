import { Reducer } from 'redux';
import { EntityState, initialEntity } from './state';
import { EntityAction } from './actions';
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
import { FetchStatus } from '../../shared/state';
import { EntityType } from '../../../../../models/endpoints/search';

const entityReducer: Reducer<EntityState, EntityAction> = (state, action) => {
    if (state === undefined) {
        return initialEntity();
    }
    switch (action.type) {
        case LOAD_METRIC_INIT:
            return {
                type: EntityType.Metric,
                metric: {
                    status: FetchStatus.INIT,
                    data: null,
                },
            };
        case LOAD_METRIC_PENDING:
            if (state?.type === EntityType.Metric) {
                return {
                    ...state,
                    metric: {
                        ...state.metric,
                        status: FetchStatus.PENDING,
                    },
                };
            }
            break;
        case LOAD_METRIC_SUCCESS:
            if (state?.type === EntityType.Metric) {
                return {
                    ...state,
                    metric: {
                        status: FetchStatus.SUCCESS,
                        data: action.payload.data,
                    },
                };
            }
            break;
        case LOAD_METRIC_ERROR:
            if (state?.type === EntityType.Metric) {
                return {
                    ...state,
                    metric: {
                        status: FetchStatus.ERROR,
                        data: null,
                    },
                };
            }
            break;
        case LOAD_METRIC_SIBLINGS_INIT:
            if (state?.type === EntityType.Metric) {
                return {
                    ...state,
                    siblings: {
                        status: FetchStatus.INIT,
                        data: null,
                    },
                };
            }
            return state;
        case LOAD_METRIC_SIBLINGS_PENDING:
            if (state?.type === EntityType.Metric) {
                return {
                    ...state,
                    siblings: {
                        status: FetchStatus.PENDING,
                        data: null,
                    },
                };
            }
            return state;
        case LOAD_METRIC_SIBLINGS_SUCCESS:
            if (state?.type === EntityType.Metric) {
                return {
                    ...state,
                    siblings: {
                        status: FetchStatus.SUCCESS,
                        data: action.payload.data,
                    },
                };
            }
            return state;
        case LOAD_METRIC_SIBLINGS_ERROR:
            if (state?.type === EntityType.Metric) {
                return {
                    ...state,
                    siblings: {
                        status: FetchStatus.ERROR,
                        data: null,
                    },
                };
            }
            return state;
        case LOAD_INDOM_INIT:
            return {
                type: EntityType.InstanceDomain,
                indom: {
                    status: FetchStatus.INIT,
                    data: null,
                },
            };
        case LOAD_INDOM_PENDING:
            if (state?.type === EntityType.InstanceDomain) {
                return {
                    ...state,
                    indom: {
                        ...state.indom,
                        status: FetchStatus.PENDING,
                    },
                };
            }
            break;
        case LOAD_INDOM_SUCCESS:
            if (state?.type === EntityType.InstanceDomain) {
                return {
                    ...state,
                    indom: {
                        status: FetchStatus.SUCCESS,
                        data: action.payload.data,
                    },
                };
            }
            break;
        case LOAD_INDOM_ERROR:
            if (state?.type === EntityType.InstanceDomain) {
                return {
                    ...state,
                    indom: {
                        status: FetchStatus.ERROR,
                        data: null,
                    },
                };
            }
            break;
    }
    return state;
};

export { entityReducer };
