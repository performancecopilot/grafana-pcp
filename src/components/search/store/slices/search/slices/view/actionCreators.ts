import { ViewState } from './state';
import { SetViewAction } from './actions';
import { SET_VIEW } from './types';

export type SetViewActionCreator = (view: ViewState) => SetViewAction;

export const setView: SetViewActionCreator = view => {
    return { type: SET_VIEW, payload: view };
};
