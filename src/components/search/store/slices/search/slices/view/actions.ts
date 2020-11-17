import { ViewState } from './state';
import { SET_VIEW } from './types';

export interface SetViewAction {
    type: typeof SET_VIEW;
    payload: ViewState;
}

export type ViewAction = SetViewAction;
