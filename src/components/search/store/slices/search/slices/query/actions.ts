import { CLEAR_QUERY, SET_QUERY } from './types';
import { SearchQuery } from '../../shared/state';

export interface ClearQueryAction {
    type: typeof CLEAR_QUERY;
}

export interface SetQueryAction {
    type: typeof SET_QUERY;
    payload: SearchQuery;
}

export type QueryAction = ClearQueryAction | SetQueryAction;
