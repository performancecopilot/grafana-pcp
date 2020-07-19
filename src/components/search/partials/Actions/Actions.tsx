import React from 'react';
import { VerticalGroup, Button } from '@grafana/ui';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, bindActionCreators } from 'redux';
import { actionsBtnWithNoSpacing } from './styles';
import { RootState } from '../../store/reducer';
import { ViewState } from '../../store/slices/search/slices/view/state';
import { querySearch } from '../../store/slices/search/shared/actionCreators';
import { setView } from '../../store/slices/search/slices/view/actionCreators';

const mapStateToProps = (state: RootState) => ({
    query: state.search.query,
    view: state.search.view,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, AnyAction>) =>
    bindActionCreators({ querySearch, setView }, dispatch);

export type ActionsReduxStateProps = ReturnType<typeof mapStateToProps>;

export type ActionsReduxDispatchProps = ReturnType<typeof mapDispatchToProps>;

export type ActionsReduxProps = ActionsReduxStateProps & ActionsReduxDispatchProps;

export type ActionsProps = ActionsReduxProps;

export class Actions extends React.Component<ActionsProps, {}> {
    constructor(props: ActionsProps) {
        super(props);
        this.queryLatestSearch = this.queryLatestSearch.bind(this);
        this.openIndex = this.openIndex.bind(this);
    }

    get showBackToPatternBtn() {
        const { query, view } = this.props;
        return query.pattern && view === ViewState.Detail;
    }

    get showBackToIndexPageBtn() {
        return this.props.view !== ViewState.Index;
    }

    openIndex() {
        this.props.setView(ViewState.Index);
    }

    queryLatestSearch() {
        const { query } = this.props;
        this.props.querySearch(query);
    }

    render() {
        const { openIndex, queryLatestSearch, showBackToPatternBtn, showBackToIndexPageBtn, props } = this;
        const { query } = props;
        return (
            <VerticalGroup spacing="xs">
                {showBackToIndexPageBtn && (
                    <Button
                        variant="link"
                        size="md"
                        icon="book"
                        className={actionsBtnWithNoSpacing}
                        onClick={openIndex}
                        data-test="back-to-index"
                    >
                        Back To Bookmarks &amp; Latest Searches
                    </Button>
                )}
                {showBackToPatternBtn && (
                    <Button
                        variant="link"
                        size="md"
                        icon="arrow-left"
                        className={actionsBtnWithNoSpacing}
                        onClick={queryLatestSearch}
                        data-test="back-to-results"
                    >
                        Back To Results for: <em>{query.pattern}</em>
                    </Button>
                )}
            </VerticalGroup>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
