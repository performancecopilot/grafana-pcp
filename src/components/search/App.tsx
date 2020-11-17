import React from 'react';
import { connect } from 'react-redux';
import DetailPage from './pages/Detail/DetailPage';
import IndexPage from './pages/Index/IndexPage';
import SearchPage from './pages/Search/SearchPage';
import Actions from './partials/Actions/Actions';
import Aside from './partials/Aside/Aside';
import SearchForm from './partials/SearchForm/SearchForm';
import { RootState } from './store/reducer';
import { ViewState } from './store/slices/search/slices/view/state';
import { appLayout } from './styles';

const mapStateToProps = (state: RootState) => ({
    view: state.search.view,
});

export type AppReduxStateProps = ReturnType<typeof mapStateToProps>;

export type AppProps = AppReduxStateProps;

export class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    renderPageComponent() {
        const { view } = this.props;

        switch (view) {
            case ViewState.Detail:
                return <DetailPage data-test="detail-page" />;
            case ViewState.Search:
                return <SearchPage data-test="search-page" />;
            case ViewState.Index:
                return <IndexPage data-test="index-page" />;
            default:
                return;
        }
    }

    render() {
        return (
            <div className={appLayout}>
                <SearchForm data-test="search-form" />
                <Actions data-test="actions" />
                <Aside data-test="aside" />
                {this.renderPageComponent()}
            </div>
        );
    }
}

export default connect(mapStateToProps, {})(App);
