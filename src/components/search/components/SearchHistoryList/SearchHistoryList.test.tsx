import React from 'react';
import { shallow } from 'enzyme';
import SearchHistoryList from './SearchHistoryList';
import { SearchQuery } from '../../store/slices/search/shared/state';
import { SearchEntity } from 'common/services/pmsearch/types';

describe('<SearchHistoryList/>', () => {
    const placeholderCallbacks = {
        onSearchHistoryClick: () => void 0,
        onClearSearchHistoryClick: () => void 0,
    };

    const historyItems: SearchQuery[] = [
        {
            pattern: 'metrics query 1',
            entityFlags: SearchEntity.Metrics,
            pageNum: 1,
        },
        {
            pattern: 'instances query 2',
            entityFlags: SearchEntity.Instances,
            pageNum: 1,
        },
        {
            pattern: 'indoms query 3',
            entityFlags: SearchEntity.InstanceDomains,
            pageNum: 1,
        },
    ];

    test('renders without crashing', () => {
        shallow(<SearchHistoryList searchHistory={[]} {...placeholderCallbacks} />);
    });

    test('renders multiple columns by default', () => {
        const component = shallow(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        expect(component.exists('[data-test="multicol"]')).toBe(true);
    });

    test('items have title filled', () => {
        const component = shallow(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        const buttons = component.find('[data-test="search-history-go"]');
        buttons.forEach(button => expect(button.prop('title')).toBeDefined());
    });

    test('renders clear button by default', () => {
        const component = shallow(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        expect(component.exists('[data-test="search-history-reset"]')).toBe(true);
    });

    test('accepts both single column and multi column prop settings', () => {
        const singleCol = shallow(
            <SearchHistoryList searchHistory={historyItems} multiCol={false} {...placeholderCallbacks} />
        );
        expect(singleCol.exists('[data-test="singlecol"]')).toBe(true);

        const multiCol = shallow(
            <SearchHistoryList searchHistory={historyItems} multiCol={true} {...placeholderCallbacks} />
        );
        expect(multiCol.exists('[data-test="multicol"]')).toBe(true);
    });

    test('accepts conditional showing of clear button', () => {
        const hasClear = shallow(
            <SearchHistoryList searchHistory={historyItems} showClearBtn={true} {...placeholderCallbacks} />
        );
        expect(hasClear.exists('[data-test="search-history-reset"]')).toBe(true);

        const lacksClear = shallow(
            <SearchHistoryList searchHistory={historyItems} showClearBtn={false} {...placeholderCallbacks} />
        );
        expect(lacksClear.exists('[data-test="search-history-reset"]')).toBe(false);
    });

    test('calls onSearchHistoryClick properly', () => {
        const onSearchHistoryClickMock = jest.fn(() => void 0);
        const component = shallow(
            <SearchHistoryList
                searchHistory={historyItems}
                {...placeholderCallbacks}
                onSearchHistoryClick={onSearchHistoryClickMock}
            />
        );
        const buttons = component.find('[data-test="search-history-go"]');
        buttons.forEach(button => button.simulate('click'));
        expect(onSearchHistoryClickMock).toHaveBeenCalledTimes(historyItems.length);
    });

    test('calls onClearSearchHistoryClick properly', () => {
        const onClearSearchHistoryClickMock = jest.fn(() => void 0);
        const component = shallow(
            <SearchHistoryList
                searchHistory={historyItems}
                {...placeholderCallbacks}
                onClearSearchHistoryClick={onClearSearchHistoryClickMock}
            />
        );
        const button = component.find('[data-test="search-history-reset"]');
        button.simulate('click');
        expect(onClearSearchHistoryClickMock).toHaveBeenCalled();
    });

    test('renders passed all search items', () => {
        const component = shallow(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        expect(component.find('[data-test="search-history-go"]').length).toBe(historyItems.length);
    });

    test('handles no search items', () => {
        const component = shallow(<SearchHistoryList searchHistory={[]} {...placeholderCallbacks} />);
        expect(component.exists('[data-test="search-history-go"]')).toBe(false);
    });
});
