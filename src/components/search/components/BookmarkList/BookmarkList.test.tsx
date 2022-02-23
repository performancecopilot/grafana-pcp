import { shallow } from 'enzyme';
import React from 'react';
import { GrafanaThemeType } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { EntityType } from '../../../../common/services/pmsearch/types';
import { BookmarkItem } from '../../store/slices/search/slices/bookmarks/state';
import { BookmarkList } from './BookmarkList';

describe('<BookmarkList/>', () => {
    const placeholderCallbacks = {
        onBookmarkClick: () => void 0,
        onClearBookmarksClick: () => void 0,
    };
    const theme = getTheme(GrafanaThemeType.Light);

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
        shallow(<BookmarkList bookmarks={[]} {...placeholderCallbacks} theme={theme} />);
    });

    test('renders multiple columns by default', () => {
        const component = shallow(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        expect(component.exists('[data-test="multicol"]')).toBe(true);
    });

    test('items have title filled', () => {
        const component = shallow(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        const buttons = component.find('[data-test="bookmark-go"]');
        buttons.forEach(button => expect(button.prop('title')).toBeDefined());
    });

    test('renders clear button by default', () => {
        const component = shallow(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        expect(component.exists('[data-test="bookmark-reset"]')).toBe(true);
    });

    test('accepts both single column and multi column prop settings', () => {
        const singleCol = shallow(
            <BookmarkList bookmarks={bookmarkItems} multiCol={false} {...placeholderCallbacks} theme={theme} />
        );
        expect(singleCol.exists('[data-test="singlecol"]')).toBe(true);

        const multiCol = shallow(
            <BookmarkList bookmarks={bookmarkItems} multiCol={true} {...placeholderCallbacks} theme={theme} />
        );
        expect(multiCol.exists('[data-test="multicol"]')).toBe(true);
    });

    test('accepts conditional showing of clear button', () => {
        const hasClear = shallow(
            <BookmarkList bookmarks={bookmarkItems} showClearBtn={true} {...placeholderCallbacks} theme={theme} />
        );
        expect(hasClear.exists('[data-test="bookmark-reset"]')).toBe(true);

        const lacksClear = shallow(
            <BookmarkList bookmarks={bookmarkItems} showClearBtn={false} {...placeholderCallbacks} theme={theme} />
        );
        expect(lacksClear.exists('[data-test="bookmark-reset"]')).toBe(false);
    });

    test('calls onBookmarkClick properly', () => {
        const onBookmarkClickMock = jest.fn(() => void 0);
        const component = shallow(
            <BookmarkList
                bookmarks={bookmarkItems}
                {...placeholderCallbacks}
                onBookmarkClick={onBookmarkClickMock}
                theme={theme}
            />
        );
        const buttons = component.find('[data-test="bookmark-go"]');
        buttons.forEach(button => button.simulate('click'));
        expect(onBookmarkClickMock).toHaveBeenCalledTimes(bookmarkItems.length);
    });

    test('calls onClearBookmarksClick properly', () => {
        const onClearBookmarksClickMock = jest.fn(() => void 0);
        const component = shallow(
            <BookmarkList
                bookmarks={bookmarkItems}
                {...placeholderCallbacks}
                onClearBookmarksClick={onClearBookmarksClickMock}
                theme={theme}
            />
        );
        const button = component.find('[data-test="bookmark-reset"]');
        button.simulate('click');
        expect(onClearBookmarksClickMock).toHaveBeenCalled();
    });

    test('renders passed all bookmarks items', () => {
        const component = shallow(<BookmarkList bookmarks={bookmarkItems} {...placeholderCallbacks} theme={theme} />);
        expect(component.find('[data-test="bookmark-go"]').length).toBe(bookmarkItems.length);
    });

    test('handles no bookmarks items', () => {
        const component = shallow(<BookmarkList bookmarks={[]} {...placeholderCallbacks} theme={theme} />);
        expect(component.exists('[data-test="bookmark-go"]')).toBe(false);
    });
});
