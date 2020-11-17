import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { Services } from '../services/services';
import rootReducer from './reducer';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initStore = async (services: Services) => {
    const middleware = thunk.withExtraArgument(services);
    const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(middleware)));
    const persistor = persistStore(store);
    return { store, persistor };
};

export { initStore };
