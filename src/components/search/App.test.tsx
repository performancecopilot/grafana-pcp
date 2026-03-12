import React from 'react';
import { render, screen } from '@testing-library/react';
import { App, AppProps } from './App';
import { ViewState } from './store/slices/search/slices/view/state';

// Mock all connected child components to avoid Redux store requirements
jest.mock('./pages/Detail/DetailPage', () => ({
    __esModule: true,
    default: () => <div data-test="detail-page" />,
}));
jest.mock('./pages/Index/IndexPage', () => ({
    __esModule: true,
    default: () => <div data-test="index-page" />,
}));
jest.mock('./pages/Search/SearchPage', () => ({
    __esModule: true,
    default: () => <div data-test="search-page" />,
}));
jest.mock('./partials/Actions/Actions', () => ({
    __esModule: true,
    default: () => <div data-test="actions" />,
}));
jest.mock('./partials/Aside/Aside', () => ({
    __esModule: true,
    default: () => <div data-test="aside" />,
}));
jest.mock('./partials/SearchForm/SearchForm', () => ({
    __esModule: true,
    default: () => <div data-test="search-form" />,
}));

describe('<App/>', () => {
    let appProps: AppProps;

    beforeEach(() => {
        appProps = { view: ViewState.Index };
    });

    test('renders without crashing', () => {
        render(<App {...appProps} />);
    });

    test('can render detail page', () => {
        render(<App {...{ ...appProps, view: ViewState.Detail }} />);
        expect(screen.getByTestId('detail-page')).toBeInTheDocument();
    });

    test('can render search page', () => {
        render(<App {...{ ...appProps, view: ViewState.Search }} />);
        expect(screen.getByTestId('search-page')).toBeInTheDocument();
    });

    test('can render index page', () => {
        render(<App {...{ ...appProps, view: ViewState.Index }} />);
        expect(screen.getByTestId('index-page')).toBeInTheDocument();
    });

    test('renders search form', () => {
        render(<App {...appProps} />);
        expect(screen.getByTestId('search-form')).toBeInTheDocument();
    });

    test('renders actions', () => {
        render(<App {...appProps} />);
        expect(screen.getByTestId('actions')).toBeInTheDocument();
    });

    test('renders aside', () => {
        render(<App {...appProps} />);
        expect(screen.getByTestId('aside')).toBeInTheDocument();
    });
});
