import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from '@grafana/data';
import { EntityType } from '../../../../common/services/pmsearch/types';
import { BookmarkItem } from '../../store/slices/search/slices/bookmarks/state';
import { BookmarkList } from './BookmarkList';

describe('<BookmarkList/>', () => {
    const placeholderCallbacks = {
        onBookmarkClick: () => void 0,
        onClearBookmarksClick: () => void 0,
    };
    const theme = createTheme();

    const bookmarkItems: BookmarkItem[] = [
        {
            id: 'statsd.settings.dropped',
            type: EntityType.Metric,
        },
        {
            id: '60.2',
            type: EntityType.InstanceDomain,
        },
    ];

    test('renders without crashing', () => {
        render(<BookmarkList bookmarks={[]} {...placeholderCallbacks} theme={theme} />);
    });

    test('renders multiple columns by default', () => {
        render(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        expect(screen.getByTestId('multicol')).toBeInTheDocument();
    });

    test('items have title filled', () => {
        render(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        const buttons = screen.getAllByTestId('bookmark-go');
        buttons.forEach(button => expect(button.title).toBeTruthy());
    });

    test('renders clear button by default', () => {
        render(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        expect(screen.getByTestId('bookmark-reset')).toBeInTheDocument();
    });

    test('accepts both single column and multi column prop settings', () => {
        const { unmount } = render(
            <BookmarkList bookmarks={bookmarkItems} multiCol={false} {...placeholderCallbacks} theme={theme} />
        );
        expect(screen.getByTestId('singlecol')).toBeInTheDocument();
        unmount();

        render(<BookmarkList bookmarks={bookmarkItems} multiCol={true} {...placeholderCallbacks} theme={theme} />);
        expect(screen.getByTestId('multicol')).toBeInTheDocument();
    });

    test('accepts conditional showing of clear button', () => {
        const { unmount } = render(
            <BookmarkList bookmarks={bookmarkItems} showClearBtn={true} {...placeholderCallbacks} theme={theme} />
        );
        expect(screen.getByTestId('bookmark-reset')).toBeInTheDocument();
        unmount();

        render(<BookmarkList bookmarks={bookmarkItems} showClearBtn={false} {...placeholderCallbacks} theme={theme} />);
        expect(screen.queryByTestId('bookmark-reset')).not.toBeInTheDocument();
    });

    test('calls onBookmarkClick properly', async () => {
        const onBookmarkClickMock = jest.fn();
        render(
            <BookmarkList
                bookmarks={bookmarkItems}
                {...placeholderCallbacks}
                onBookmarkClick={onBookmarkClickMock}
                theme={theme}
            />
        );
        const buttons = screen.getAllByTestId('bookmark-go');
        for (const button of buttons) {
            await userEvent.click(button);
        }
        expect(onBookmarkClickMock).toHaveBeenCalledTimes(bookmarkItems.length);
    });

    test('calls onClearBookmarksClick properly', async () => {
        const onClearBookmarksClickMock = jest.fn();
        render(
            <BookmarkList
                bookmarks={bookmarkItems}
                {...placeholderCallbacks}
                onClearBookmarksClick={onClearBookmarksClickMock}
                theme={theme}
            />
        );
        await userEvent.click(screen.getByTestId('bookmark-reset'));
        expect(onClearBookmarksClickMock).toHaveBeenCalled();
    });

    test('renders passed all bookmarks items', () => {
        render(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        expect(screen.getAllByTestId('bookmark-go').length).toBe(bookmarkItems.length);
    });

    test('handles no bookmarks items', () => {
        render(<BookmarkList bookmarks={[]} {...placeholderCallbacks} theme={theme} />);
        expect(screen.queryByTestId('bookmark-go')).not.toBeInTheDocument();
    });
});
