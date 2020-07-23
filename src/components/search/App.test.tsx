import { shallow } from 'enzyme';
import React from 'react';
import { App, AppProps } from './App';
import { ViewState } from './store/slices/search/slices/view/state';

describe('<App/>', () => {
    let appProps: AppProps;

    beforeEach(() => {
        appProps = { view: ViewState.Index };
    });

    test('renders without crashing', () => {
        shallow(<App {...appProps} />);
    });

    test('can render detail page', () => {
        const wrapper = shallow(<App {...{ ...appProps, view: ViewState.Detail }} />);
        expect(wrapper.exists('[data-test="detail-page"]')).toBe(true);
    });

    test('can render search page', () => {
        const wrapper = shallow(<App {...{ ...appProps, view: ViewState.Search }} />);
        expect(wrapper.exists('[data-test="search-page"]')).toBe(true);
    });

    test('can render index page', () => {
        const wrapper = shallow(<App {...{ ...appProps, view: ViewState.Index }} />);
        expect(wrapper.exists('[data-test="index-page"]')).toBe(true);
    });

    test('renders search form', () => {
        const wrapper = shallow(<App {...appProps} />);
        expect(wrapper.exists('[data-test="search-form"]')).toBe(true);
    });

    test('renders actions', () => {
        const wrapper = shallow(<App {...appProps} />);
        expect(wrapper.exists('[data-test="actions"]')).toBe(true);
    });

    test('renders aside', () => {
        const wrapper = shallow(<App {...appProps} />);
        expect(wrapper.exists('[data-test="aside"]')).toBe(true);
    });
});
