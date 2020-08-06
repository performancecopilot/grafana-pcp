import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import { seriesReducer } from './seriesReducer';
import PmSeriesApiService from '../../../lib/services/PmSeriesApiService';

const rootReducer = combineReducers({
    series: seriesReducer,
});

export function configureAppStore(thunkExtraArgument: ThunkExtraArgument) {
    const middleware = getDefaultMiddleware({
        thunk: {
            extraArgument: thunkExtraArgument,
        },
    });

    return configureStore({
        reducer: rootReducer,
        middleware,
    });
}

export type RootState = ReturnType<typeof rootReducer>;
export type RootStore = ReturnType<typeof configureAppStore>;
export interface ThunkExtraArgument {
    pmSeriesApi: PmSeriesApiService;
}
export interface AppThunkApiConfig {
    state: RootState;
    extra: ThunkExtraArgument;
}
