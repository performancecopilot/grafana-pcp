import { SET_VIEW } from './types';
import { ViewState } from './state';

export interface SetViewAction {
    type: typeof SET_VIEW;
    payload: ViewState;
}

export type ViewAction = SetViewAction;
