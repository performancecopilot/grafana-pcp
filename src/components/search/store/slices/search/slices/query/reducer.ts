import { Reducer } from 'redux';
import { QueryAction } from './actions';
import { initialQuery, initialState, QueryState } from './state';
import { CLEAR_QUERY, SET_QUERY } from './types';

const queryReducer: Reducer<QueryState, QueryAction> = (state, action) => {
    if (state === undefined) {
        return initialState;
    }
    switch (action.type) {
        case SET_QUERY:
            return action.payload;
        case CLEAR_QUERY:
            return initialQuery();
        default:
            return state;
    }
};

export { queryReducer };
