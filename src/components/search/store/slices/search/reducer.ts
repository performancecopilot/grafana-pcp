import { combineReducers } from 'redux';
import { bookmarksReducer } from './slices/bookmarks/reducer';
import { viewReducer } from './slices/view/reducer';
import { entityReducer } from './slices/entity/reducer';
import { queryReducer } from './slices/query/reducer';
import { historyReducer } from './slices/history/reducer';
import { resultReducer } from './slices/result/reducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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
