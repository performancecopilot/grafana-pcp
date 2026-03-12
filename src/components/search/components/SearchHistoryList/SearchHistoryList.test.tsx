import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchEntity } from '../../../../common/services/pmsearch/types';
import { SearchQuery } from '../../store/slices/search/shared/state';
import SearchHistoryList from './SearchHistoryList';

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
        render(<SearchHistoryList searchHistory={[]} {...placeholderCallbacks} />);
    });

    test('renders multiple columns by default', () => {
        render(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        expect(screen.getByTestId('multicol')).toBeInTheDocument();
    });

    test('items have title filled', () => {
        render(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        const buttons = screen.getAllByTestId('search-history-go');
        buttons.forEach(button => expect(button.title).toBeDefined());
    });

    test('renders clear button by default', () => {
        render(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        expect(screen.getByTestId('search-history-reset')).toBeInTheDocument();
    });

    test('accepts both single column and multi column prop settings', () => {
        const { unmount } = render(
            <SearchHistoryList searchHistory={historyItems} multiCol={false} {...placeholderCallbacks} />
        );
        expect(screen.getByTestId('singlecol')).toBeInTheDocument();
        unmount();

        render(<SearchHistoryList searchHistory={historyItems} multiCol={true} {...placeholderCallbacks} />);
        expect(screen.getByTestId('multicol')).toBeInTheDocument();
    });

    test('accepts conditional showing of clear button', () => {
        const { unmount } = render(
            <SearchHistoryList searchHistory={historyItems} showClearBtn={true} {...placeholderCallbacks} />
        );
        expect(screen.getByTestId('search-history-reset')).toBeInTheDocument();
        unmount();

        render(<SearchHistoryList searchHistory={historyItems} showClearBtn={false} {...placeholderCallbacks} />);
        expect(screen.queryByTestId('search-history-reset')).not.toBeInTheDocument();
    });

    test('calls onSearchHistoryClick properly', async () => {
        const onSearchHistoryClickMock = jest.fn();
        render(
            <SearchHistoryList
                searchHistory={historyItems}
                {...placeholderCallbacks}
                onSearchHistoryClick={onSearchHistoryClickMock}
            />
        );
        const buttons = screen.getAllByTestId('search-history-go');
        for (const button of buttons) {
            await userEvent.click(button);
        }
        expect(onSearchHistoryClickMock).toHaveBeenCalledTimes(historyItems.length);
    });

    test('calls onClearSearchHistoryClick properly', async () => {
        const onClearSearchHistoryClickMock = jest.fn();
        render(
            <SearchHistoryList
                searchHistory={historyItems}
                {...placeholderCallbacks}
                onClearSearchHistoryClick={onClearSearchHistoryClickMock}
            />
        );
        await userEvent.click(screen.getByTestId('search-history-reset'));
        expect(onClearSearchHistoryClickMock).toHaveBeenCalled();
    });

    test('renders all search items', () => {
        render(<SearchHistoryList searchHistory={historyItems} {...placeholderCallbacks} />);
        expect(screen.getAllByTestId('search-history-go').length).toBe(historyItems.length);
    });

    test('handles no search items', () => {
        render(<SearchHistoryList searchHistory={[]} {...placeholderCallbacks} />);
        expect(screen.queryByTestId('search-history-go')).not.toBeInTheDocument();
    });
});
