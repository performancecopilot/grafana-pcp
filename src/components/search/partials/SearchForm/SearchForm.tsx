import React from 'react';
import Autosuggest, {
    SuggestionsFetchRequestedParams,
    RenderSuggestionParams,
    SuggestionSelectedEventData,
    Theme,
} from 'react-autosuggest';
import { VerticalGroup, Button, HorizontalGroup, Checkbox, withTheme, Themeable } from '@grafana/ui';
import { connect } from 'react-redux';

import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators, AnyAction } from 'redux';
import {
    searchContainer,
    searchFormGroup,
    searchSubmitBtn,
    searchBlockWrapper,
    autosuggestContainerOpen,
    autosuggestContainer,
    autosuggestInput,
    autosuggestInputOpen,
    autosuggestSuggestionsContainer,
    autosuggestSuggestionsContainerOpen,
    autosuggestInputFocused,
    autosuggestSuggestionsList,
    autosuggestSuggestion,
    autosuggestSuggestionFirst,
    autosuggestSuggestionHighlighted,
    autosuggestSectionContainer,
    autosuggestSectionContainerFirst,
    autosuggestSectionTitle,
} from './styles';
import { RootState } from '../../store/reducer';
import withServices, { WithServicesProps } from '../../components/withServices/withServices';
import { SearchEntity, AutocompleteSuggestion } from '../../models/endpoints/search';
import { querySearch } from '../../store/slices/search/shared/actionCreators';
import Config from '../../config/config';

const mapStateToProps = (state: RootState) => ({
    query: state.search.query,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, AnyAction>) =>
    bindActionCreators({ querySearch }, dispatch);

export type SearchFormReduxStateProps = ReturnType<typeof mapStateToProps>;

export type SearchFormReduxDispatchProps = ReturnType<typeof mapDispatchToProps>;

export type SearchFormReduxProps = SearchFormReduxStateProps & SearchFormReduxDispatchProps;

export type SearchFormProps = SearchFormReduxProps & WithServicesProps & Themeable;

export interface SearchFormState {
    query: {
        pattern: string;
        entityFlags: SearchEntity;
    };
    suggestions: AutocompleteSuggestion[];
}

export class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
    state: SearchFormState = this.initialState;
    autosuggestTheme: Theme;

    get initialState() {
        return {
            query: {
                pattern: '',
                entityFlags: SearchEntity.All,
            },
            suggestions: [],
        };
    }

    get metricFlag(): boolean {
        return (this.state.query.entityFlags & (1 << 0)) > 0;
    }

    get instanceDomainsFlag(): boolean {
        return (this.state.query.entityFlags & (1 << 1)) > 0;
    }

    get instancesFlag(): boolean {
        return (this.state.query.entityFlags & (1 << 2)) > 0;
    }

    constructor(props: SearchFormProps) {
        super(props);
        this.state = { ...this.state, query: props.query };
        this.autosuggestTheme = {
            container: autosuggestContainer(props.theme),
            containerOpen: autosuggestContainerOpen,
            input: autosuggestInput(props.theme),
            inputOpen: autosuggestInputOpen,
            inputFocused: autosuggestInputFocused,
            suggestionsContainer: autosuggestSuggestionsContainer(props.theme),
            suggestionsContainerOpen: autosuggestSuggestionsContainerOpen,
            suggestionsList: autosuggestSuggestionsList,
            suggestion: autosuggestSuggestion(props.theme),
            suggestionFirst: autosuggestSuggestionFirst,
            suggestionHighlighted: autosuggestSuggestionHighlighted(props.theme),
            sectionContainer: autosuggestSectionContainer,
            sectionContainerFirst: autosuggestSectionContainerFirst,
            sectionTitle: autosuggestSectionTitle,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.allowSuggestions = this.allowSuggestions.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.renderSearchInput = this.renderSearchInput.bind(this);
        this.setEntityFlag = this.setEntityFlag.bind(this);
    }

    componentDidUpdate(oldProps: SearchFormProps) {
        const newProps = this.props;
        if (
            oldProps.query.pattern !== newProps.query.pattern ||
            oldProps.query.entityFlags !== newProps.query.entityFlags
        ) {
            this.setState({
                query: {
                    pattern: newProps.query.pattern,
                    entityFlags: newProps.query.entityFlags,
                },
                suggestions: [],
            });
        }
    }

    setEntityFlag(entity: SearchEntity) {
        this.setState({
            query: {
                ...this.state.query,
                entityFlags: this.state.query.entityFlags ^ entity,
            },
        });
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (this.state.query.pattern.trim().length) {
            this.props.querySearch({ ...this.state.query, pageNum: 1 });
        }
    }

    onInputChange(e: React.FormEvent<HTMLInputElement>) {
        this.setState({
            query: {
                ...this.state.query,
                pattern: e.currentTarget.value,
            },
        });
    }

    onSuggestionsFetchRequested(request: SuggestionsFetchRequestedParams): void {
        this.props.services.searchService.autocomplete({ query: request.value }).then(result => {
            this.setState({
                suggestions: result,
            });
        });
    }

    onSuggestionsClearRequested(): void {
        this.setState({
            suggestions: [],
        });
    }

    onSuggestionSelected(event: React.FormEvent<any>, data: SuggestionSelectedEventData<AutocompleteSuggestion>) {
        this.setState({
            query: {
                ...this.state.query,
                pattern: data.suggestionValue,
            },
        });
    }

    allowSuggestions(value: string): boolean {
        if (Config.ALLOW_SEARCH_SUGGESTIONS) {
            return value.length > 2;
        }
        return false;
    }

    getSuggestionValue(suggestion: AutocompleteSuggestion): string {
        return suggestion;
    }

    renderSuggestion(suggestion: AutocompleteSuggestion, params: RenderSuggestionParams): React.ReactNode {
        return <div>{suggestion}</div>;
    }

    renderSearchInput() {
        const {
            onSuggestionsClearRequested,
            onSuggestionsFetchRequested,
            onSuggestionSelected,
            getSuggestionValue,
            renderSuggestion,
            allowSuggestions,
            onInputChange,
            state,
            autosuggestTheme,
        } = this;
        const { suggestions, query } = state;
        const searchInputProps = {
            placeholder: 'Search Phrase',
            value: query.pattern,
            onChange: onInputChange,
            'data-test': 'text-input',
        };
        return (
            <Autosuggest
                theme={autosuggestTheme}
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                // Actually disables suggestions completely
                shouldRenderSuggestions={allowSuggestions}
                inputProps={searchInputProps}
                data-test="query-input"
            ></Autosuggest>
        );
    }

    render() {
        const { onSubmit, metricFlag, instancesFlag, instanceDomainsFlag, setEntityFlag, renderSearchInput } = this;
        return (
            <form className={searchContainer} onSubmit={onSubmit} data-test="form">
                <VerticalGroup spacing="sm">
                    <div className={searchFormGroup}>
                        <div className={searchBlockWrapper}>{renderSearchInput()}</div>
                        <Button
                            className={searchSubmitBtn}
                            variant="primary"
                            size="md"
                            type="submit"
                            data-test="submit-button"
                        >
                            Search
                        </Button>
                    </div>
                    <div className={searchFormGroup}>
                        <HorizontalGroup spacing="lg">
                            <Checkbox
                                value={metricFlag}
                                onChange={() => setEntityFlag(SearchEntity.Metrics)}
                                label="Metrics"
                                data-test="metrics-toggle"
                            />
                            <Checkbox
                                value={instancesFlag}
                                onChange={() => setEntityFlag(SearchEntity.Instances)}
                                label="Instances"
                                data-test="instances-toggle"
                            />
                            <Checkbox
                                value={instanceDomainsFlag}
                                onChange={() => setEntityFlag(SearchEntity.InstanceDomains)}
                                label="Instance Domains"
                                data-test="indoms-toggle"
                            />
                        </HorizontalGroup>
                    </div>
                </VerticalGroup>
            </form>
        );
    }
}

export default withTheme(withServices(connect(mapStateToProps, mapDispatchToProps)(SearchForm)));
