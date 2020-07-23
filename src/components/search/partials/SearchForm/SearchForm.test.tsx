jest.mock('../../services/PmSearchApiService');
jest.mock('../../services/PmSeriesApiService');
jest.mock('../../services/EntityDetailService');
import { SearchForm, SearchFormReduxProps, SearchFormProps, SearchFormState } from './SearchForm';
import { GrafanaThemeType } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { shallow } from 'enzyme';
import React from 'react';
import { AutosuggestPropsSingleSection } from 'react-autosuggest';
import PmSearchApiService from '../../services/PmSearchApiService';
import PmSeriesApiService from '../../services/PmSeriesApiService';
import EntityService from '../../services/EntityDetailService';
import { Services } from '../../services/services';
import { SearchEntity, AutocompleteSuggestion } from '../../models/endpoints/search';
import { QuerySearchActionCreator } from '../../store/slices/search/shared/actionCreators';

describe('<SearchForm/>', () => {
    let mockReduxProps: SearchFormReduxProps;
    let searchFormProps: SearchFormProps;
    const PmSearchApiServiceMock: jest.Mock<PmSearchApiService> = PmSearchApiService as any;
    const PmSeriesApiServiceMock: jest.Mock<PmSeriesApiService> = PmSeriesApiService as any;
    const EntityServiceMock: jest.Mock<EntityService> = EntityService as any;
    const searchService = new PmSearchApiServiceMock(null!, null!);
    const seriesService = new PmSeriesApiServiceMock(null!, null!);
    const entityService = new EntityServiceMock(null!, null!);
    const theme = getTheme(GrafanaThemeType.Light);

    const services: Services = {
        searchService,
        seriesService,
        entityService,
    };

    beforeEach(() => {
        mockReduxProps = {
            query: {
                pattern: '',
                entityFlags: SearchEntity.All,
                pageNum: 1,
            },
            querySearch: jest.fn(),
        };
        PmSearchApiServiceMock.mockClear();
        PmSeriesApiServiceMock.mockClear();
        EntityServiceMock.mockClear();
        searchFormProps = {
            ...mockReduxProps,
            theme,
            services,
        };
    });

    test('renders without crashing', () => {
        shallow(<SearchForm {...searchFormProps} />);
    });

    test('displays query input', () => {
        const wrapper = shallow(<SearchForm {...searchFormProps} />);
        expect(wrapper.exists('[data-test="query-input"]')).toBe(true);
    });

    test('displays search entity types checkboxes', () => {
        const wrapper = shallow(<SearchForm {...searchFormProps} />);
        expect(wrapper.exists('[data-test="metrics-toggle"]')).toBe(true);
        expect(wrapper.exists('[data-test="instances-toggle"]')).toBe(true);
        expect(wrapper.exists('[data-test="indoms-toggle"]')).toBe(true);
    });

    test('displays search submit button', () => {
        const wrapper = shallow(<SearchForm {...searchFormProps} />);
        expect(wrapper.exists('[data-test="submit-button"]')).toBe(true);
    });

    test('updates query state when props change', () => {
        const wrapper = shallow(<SearchForm {...searchFormProps} />);
        const newQuery = { pattern: 'statsd', entityFlags: SearchEntity.Metrics, pageNum: 1 };
        wrapper.setProps({
            ...searchFormProps,
            query: newQuery,
        });
        const state: SearchFormState = wrapper.state() as any;
        expect(state.query.pattern).toBe(newQuery.pattern);
        expect(state.query.entityFlags).toBe(newQuery.entityFlags);
    });

    test('suggestions can attempt to fetch items', () => {
        const wrapper = shallow(<SearchForm {...searchFormProps} />);
        const autosuggest = wrapper.find('[data-test="query-input"]');
        const autosuggestProps: AutosuggestPropsSingleSection<AutocompleteSuggestion> = autosuggest.props() as any;
        const mockQuery = { reason: 'input-changed', value: 'disk' };
        const autocompleteMock: jest.Mock = searchFormProps.services.searchService.autocomplete as any;
        autocompleteMock.mockReturnValue(Promise.resolve([]));
        autosuggestProps.onSuggestionsFetchRequested({ reason: 'input-changed', value: 'disk' });
        expect(autocompleteMock.mock.calls[0][0]).toEqual({ query: mockQuery.value });
        expect(autocompleteMock).toHaveBeenCalled();
    });

    test('submiting without query pattern doesnt trigger search', () => {
        const wrapper = shallow(<SearchForm {...searchFormProps} />);
        const form = wrapper.find('[data-test="form"]');
        expect(form.exists('[type="submit"][data-test="submit-button"]')).toBe(true);
        form.simulate('submit', { preventDefault() {} });
        const querySearch: jest.Mock<QuerySearchActionCreator> = mockReduxProps.querySearch as any;
        expect(querySearch).not.toHaveBeenCalled();
    });

    test('submiting triggers search', () => {
        const query = {
            ...searchFormProps.query,
            pattern: 'statsd',
            pageNum: 1,
        };
        const wrapper = shallow(<SearchForm {...{ ...searchFormProps, query }} />);
        const state: SearchFormState = wrapper.state() as any;
        // have to simulate submit on form since enzyme fails to propagate button click to form submit
        const form = wrapper.find('[data-test="form"]');
        expect(form.exists('[type="submit"][data-test="submit-button"]')).toBe(true);
        form.simulate('submit', { preventDefault() {} });
        const querySearch: jest.Mock<QuerySearchActionCreator> = mockReduxProps.querySearch as any;
        expect(querySearch.mock.calls[0][0]).toEqual({ ...state.query, pageNum: 1 });
        expect(querySearch).toHaveBeenCalled();
    });
});
