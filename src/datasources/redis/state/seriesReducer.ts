import { combineReducers } from 'redux';
import { metricsSlice } from './metricsSlice';

export const seriesReducer = combineReducers({
    metrics: metricsSlice.reducer,
});
