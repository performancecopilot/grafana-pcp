import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { bookmarksReducer } from './slices/bookmarks/reducer';
import { entityReducer } from './slices/entity/reducer';
import { historyReducer } from './slices/history/reducer';
import { queryReducer } from './slices/query/reducer';
import { resultReducer } from './slices/result/reducer';
import { viewReducer } from './slices/view/reducer';

const persistanceConfig = {
    key: 'grafana-pcp-app:search',
    storage: storage,
    whitelist: ['bookmarks', 'history'],
};

const searchReducer = persistReducer(
    persistanceConfig,
    combineReducers({
        bookmarks: bookmarksReducer,
        view: viewReducer,
        entity: entityReducer,
        query: queryReducer,
        history: historyReducer,
        result: resultReducer,
    })
);

export { searchReducer };
