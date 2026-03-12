import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from '@grafana/data';
import { PmSearchApiService } from '../../../../common/services/pmsearch/PmSearchApiService';
import { SearchEntity } from '../../../../common/services/pmsearch/types';
import { PmSeriesApiService } from '../../../../common/services/pmseries/PmSeriesApiService';
import EntityService from '../../services/EntityDetailService';
import { Services } from '../../services/services';
import { QuerySearchActionCreator } from '../../store/slices/search/shared/actionCreators';
import { SearchForm, SearchFormProps, SearchFormReduxProps } from './SearchForm';

jest.mock('../../../../common/services/pmsearch/PmSearchApiService');
jest.mock('../../../../common/services/pmseries/PmSeriesApiService');
jest.mock('../../services/EntityDetailService');

describe('<SearchForm/>', () => {
    let mockReduxProps: SearchFormReduxProps;
    let searchFormProps: SearchFormProps;
    const PmSearchApiServiceMock: jest.Mock<PmSearchApiService> = PmSearchApiService as any;
    const PmSeriesApiServiceMock: jest.Mock<PmSeriesApiService> = PmSeriesApiService as any;
    const EntityServiceMock: jest.Mock<EntityService> = EntityService as any;
    const searchService = new PmSearchApiServiceMock(null!, null!);
    const seriesService = new PmSeriesApiServiceMock(null!, null!);
    const entityService = new EntityServiceMock(null!, null!);
    const theme = createTheme();

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
        render(<SearchForm {...searchFormProps} />);
    });

    test('displays query input', () => {
        render(<SearchForm {...searchFormProps} />);
        expect(screen.getByPlaceholderText('Search Phrase')).toBeInTheDocument();
    });

    test('displays search entity types checkboxes', () => {
        render(<SearchForm {...searchFormProps} />);
        expect(screen.getByLabelText('Metrics')).toBeInTheDocument();
        expect(screen.getByLabelText('Instances')).toBeInTheDocument();
        expect(screen.getByLabelText('Instance Domains')).toBeInTheDocument();
    });

    test('displays search submit button', () => {
        render(<SearchForm {...searchFormProps} />);
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('updates query state when props change', () => {
        const newQuery = { pattern: 'statsd', entityFlags: SearchEntity.Metrics, pageNum: 1 };
        const { rerender } = render(<SearchForm {...searchFormProps} />);
        rerender(<SearchForm {...{ ...searchFormProps, query: newQuery }} />);
        const input = screen.getByPlaceholderText('Search Phrase') as HTMLInputElement;
        expect(input.value).toBe(newQuery.pattern);
    });

    test('suggestions can attempt to fetch items', async () => {
        const autocompleteMock = searchFormProps.services.searchService.autocomplete as jest.Mock;
        autocompleteMock.mockReturnValue(Promise.resolve([]));
        render(<SearchForm {...searchFormProps} />);
        const input = screen.getByPlaceholderText('Search Phrase');
        await userEvent.type(input, 'disk');
        expect(autocompleteMock).toHaveBeenCalled();
        expect(autocompleteMock).toHaveBeenCalledWith({ query: expect.stringContaining('di') });
    });

    test('submitting without query pattern does not trigger search', () => {
        render(<SearchForm {...searchFormProps} />);
        fireEvent.submit(screen.getByTestId('form'));
        const querySearch = mockReduxProps.querySearch as jest.Mock<QuerySearchActionCreator>;
        expect(querySearch).not.toHaveBeenCalled();
    });

    test('submitting triggers search', () => {
        const query = {
            ...searchFormProps.query,
            pattern: 'statsd',
            pageNum: 1,
        };
        render(<SearchForm {...{ ...searchFormProps, query }} />);
        fireEvent.submit(screen.getByTestId('form'));
        const querySearch = mockReduxProps.querySearch as jest.Mock<QuerySearchActionCreator>;
        expect(querySearch).toHaveBeenCalledWith({
            pattern: 'statsd',
            entityFlags: SearchEntity.All,
            pageNum: 1,
        });
        expect(querySearch).toHaveBeenCalled();
    });
});
