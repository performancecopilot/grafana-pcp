import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import rootReducer from './reducer';
import { Services } from '../services/services';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initStore = async (services: Services) => {
    const middleware = thunk.withExtraArgument(services);
    const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(middleware)));
    const persistor = persistStore(store);
    return { store, persistor };
};

export { initStore };
