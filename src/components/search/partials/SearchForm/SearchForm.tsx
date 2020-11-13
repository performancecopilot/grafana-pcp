import React from 'react';
import Autosuggest, {
    SuggestionsFetchRequestedParams,
    RenderSuggestionParams,
    SuggestionSelectedEventData,
    Theme,
} from 'react-autosuggest';
import { VerticalGroup, Button, HorizontalGroup, Checkbox, withTheme, Themeable, Icon } from '@grafana/ui';
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
    autosuggestWrapper,
    autosuggestIcon,
} from './styles';
import { RootState } from '../../store/reducer';
import withServices, { WithServicesProps } from '../../components/withServices/withServices';
import { querySearch } from '../../store/slices/search/shared/actionCreators';
import Config from '../../config/config';
import { SearchEntity, AutocompleteSuggestion } from 'common/services/pmsearch/types';
import { getLogger } from 'loglevel';
const log = getLogger('search/SearchFrom');

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
    valid: boolean;
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
            valid: true,
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

    checkQueryValidity(): boolean {
        const { query } = this.state;
        const valid = query.pattern.trim().length !== 0 && query.entityFlags > 0;
        this.setState({ valid });
        return valid;
    }

    setEntityFlag(entity: SearchEntity) {
        this.setState(
            {
                query: {
                    ...this.state.query,
                    entityFlags: this.state.query.entityFlags ^ entity,
                },
            },
            this.checkQueryValidity
        );
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { query } = this.state;
        if (this.checkQueryValidity()) {
            this.props.querySearch({ ...query, pageNum: 1 });
        }
    }

    onInputChange(e: React.FormEvent<HTMLInputElement>) {
        this.setState(
            {
                query: {
                    ...this.state.query,
                    pattern: e.currentTarget.value,
                },
            },
            this.checkQueryValidity
        );
    }

    async onSuggestionsFetchRequested(request: SuggestionsFetchRequestedParams) {
        try {
            const suggestions = await this.props.services.searchService.autocomplete({ query: request.value });
            this.setState({ suggestions });
        } catch (error) {
            log.error('Error fetching autocomplete results:', error);
        }
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
                pattern: data.suggestion,
            },
        });
    }

    allowSuggestions(value: string): boolean {
        if (Config.ALLOW_SEARCH_SUGGESTIONS) {
            return value.length >= 2;
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
            props,
        } = this;
        const { suggestions, query } = state;
        const searchInputProps = {
            placeholder: 'Search Phrase',
            value: query.pattern,
            onChange: onInputChange,
            'data-test': 'text-input',
        };
        return (
            <div className={autosuggestWrapper}>
                <div className={autosuggestIcon(props.theme)}>
                    <Icon name="search" />
                </div>
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
            </div>
        );
    }

    render() {
        const {
            onSubmit,
            metricFlag,
            instancesFlag,
            instanceDomainsFlag,
            setEntityFlag,
            renderSearchInput,
            state,
        } = this;
        return (
            <form className={searchContainer} onSubmit={onSubmit} data-test="form">
                <VerticalGroup spacing="sm">
                    <div className={searchFormGroup}>
                        <div className={searchBlockWrapper}>{renderSearchInput()}</div>
                        <Button
                            disabled={!state.valid}
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
                                css=""
                            />
                            <Checkbox
                                value={instancesFlag}
                                onChange={() => setEntityFlag(SearchEntity.Instances)}
                                label="Instances"
                                data-test="instances-toggle"
                                css=""
                            />
                            <Checkbox
                                value={instanceDomainsFlag}
                                onChange={() => setEntityFlag(SearchEntity.InstanceDomains)}
                                label="Instance Domains"
                                data-test="indoms-toggle"
                                css=""
                            />
                        </HorizontalGroup>
                    </div>
                </VerticalGroup>
            </form>
        );
    }
}

export default withTheme(withServices(connect(mapStateToProps, mapDispatchToProps)(SearchForm)));
