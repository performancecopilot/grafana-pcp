import { ClearHistoryAction } from './actions';
import { CLEAR_HISTORY } from './types';

export type ClearSearchHistoryActionCreator = () => ClearHistoryAction;

export const clearSearchHistory: ClearSearchHistoryActionCreator = () => {
    return { type: CLEAR_HISTORY };
};
