import { Reducer } from 'redux';
import { ViewState, initialView } from './state';
import { ViewAction } from './actions';
import { SET_VIEW } from './types';

const viewReducer: Reducer<ViewState, ViewAction> = (state, action) => {
    if (state === undefined) {
        return initialView();
    }
    switch (action.type) {
        case SET_VIEW:
            return action.payload;
        default:
            return state;
    }
};

export { viewReducer };
