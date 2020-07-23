import { Reducer } from 'redux';
import { HistoryState, initialHistory } from './state';
import { HistoryAction } from './actions';
import { ADD_HISTORY, CLEAR_HISTORY } from './types';
import Config from '../../../../../config/config';

const historyReducer: Reducer<HistoryState, HistoryAction> = (state, action) => {
    if (state === undefined) {
        return initialHistory();
    }
    switch (action.type) {
        case ADD_HISTORY: {
            const newState = [action.payload, ...state];
            if (newState.length > Config.MAX_SEARCH_SHORTCUTS) {
                newState.pop();
            }
            return newState;
        }
        case CLEAR_HISTORY:
            return [];
        default:
            return state;
    }
};

export { historyReducer };
