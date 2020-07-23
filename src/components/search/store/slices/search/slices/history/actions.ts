import { ADD_HISTORY, CLEAR_HISTORY } from './types';
import { SearchQuery } from '../../shared/state';

export interface AddHistoryAction {
    type: typeof ADD_HISTORY;
    payload: SearchQuery;
}

export interface ClearHistoryAction {
    type: typeof CLEAR_HISTORY;
}

export type HistoryAction = ClearHistoryAction | AddHistoryAction;
