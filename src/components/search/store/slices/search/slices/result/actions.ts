import { ResultData } from './state';
import { LOAD_RESULT_ERROR, LOAD_RESULT_INIT, LOAD_RESULT_PENDING, LOAD_RESULT_SUCCESS } from './types';

export interface LoadResultInitAction {
    type: typeof LOAD_RESULT_INIT;
}

export interface LoadResultPendingAction {
    type: typeof LOAD_RESULT_PENDING;
}

export interface LoadResultSuccessAction {
    type: typeof LOAD_RESULT_SUCCESS;
    payload: ResultData;
}

export interface LoadResultErrorAction {
    type: typeof LOAD_RESULT_ERROR;
    error: any;
}

export type LoadResultAction =
    | LoadResultInitAction
    | LoadResultPendingAction
    | LoadResultSuccessAction
    | LoadResultErrorAction;

export type ResultAction = LoadResultAction;
