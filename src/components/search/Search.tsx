import React from 'react';
import { AppRootProps } from '@grafana/data';
import { Provider } from 'react-redux';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Persistor } from 'redux-persist';
import Loader from './components/Loader/Loader';
import { initStore } from './store/store';
import { Store, AnyAction } from 'redux';
import { initServices, Services } from './services/services';
import ServicesContext from './contexts/services';

interface AppRootState {
    store: Store<any, AnyAction> | null;
    services: Services | null;
    persistor: Persistor | null;
    loading: boolean;
    errorMsg: string;
}

export class Search extends React.Component<AppRootProps, AppRootState> {
    state: AppRootState = {
        store: null,
        services: null,
        persistor: null,
        loading: true,
        errorMsg: '',
    };

    constructor(props: AppRootProps) {
        super(props);
    }

    componentDidMount() {
        // Bloat for Grafana App plugin tabs, which we don't actually use in app itself, hence this wrapper
        this.updateNav();
        initServices()
            .then(services => {
                this.setState({ services });
                return initStore(services);
            })
            .then(({ store, persistor }) => {
                this.setState({ store, persistor, loading: false });
            })
            .catch((err: Error) => {
                this.setState({ loading: false, errorMsg: err.message });
            });
    }

    componentDidUpdate(prevProps: AppRootProps) {
        if (this.props.query !== prevProps.query) {
            if (this.props.query.tab !== prevProps.query.tab) {
                this.updateNav();
            }
        }
    }

    updateNav() {
        const { path, onNavChanged, meta } = this.props;
        const node = {
            text: 'Performance Co-Pilot',
            img: meta.info.logos.large,
            subTitle: 'Full-Text Search',
            url: path,
        };
        onNavChanged({
            node,
            main: node,
        });
    }

    // Render main App component without above bloat
    render() {
        const { store, loading, persistor, errorMsg, services } = this.state;
        if (loading) {
            return <Loader loaded={false} />;
        }
        if (store === null || services === null) {
            return <p>{errorMsg}</p>;
        }
        return (
            <Provider store={store}>
                {/* Seems like redux-persist has really buggy typings
                // @ts-ignore */}
                <PersistGate persistor={persistor}>
                    {loaded => (
                        <Loader loaded={loaded}>
                            <ServicesContext.Provider value={services}>
                                <App />
                            </ServicesContext.Provider>
                        </Loader>
                    )}
                </PersistGate>
            </Provider>
        );
    }
}

export default Search;
