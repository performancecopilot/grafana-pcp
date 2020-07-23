import { Aside, AsideReduxStateProps, AsideReduxDispatchProps, AsideReduxProps, AsideProps } from './Aside';
import { getTheme } from '@grafana/ui';
import { GrafanaThemeType } from '@grafana/data';
import React from 'react';
import { MetricDataState, initialEntity, MetricDetailState } from '../../store/slices/search/slices/entity/state';
import { FetchStatus } from '../../store/slices/search/shared/state';
import { initialView, ViewState } from '../../store/slices/search/slices/view/state';
import { initialHistory } from '../../store/slices/search/slices/history/state';
import { initialBookmarks, BookmarkItem } from '../../store/slices/search/slices/bookmarks/state';
import { shallow } from 'enzyme';
import { EntityType, SearchEntity } from '../../models/endpoints/search';
import { OpenDetailActionCreator } from '../../store/slices/search/shared/actionCreators';
import { ClearBookmarksActionCreator } from '../../store/slices/search/slices/bookmarks/actionCreators';

describe('<Aside/>', () => {
    let mockReduxStateProps: AsideReduxStateProps;
    let mockReduxDispatchProps: AsideReduxDispatchProps;
    let mockReduxProps: AsideReduxProps;
    let asideProps: AsideProps;
    const theme = getTheme(GrafanaThemeType.Light);

    const metric: MetricDataState = {
        status: FetchStatus.SUCCESS,
        data: {
            name: 'statsd.pmda.received',
            series: [],
        },
    };

    beforeEach(() => {
        mockReduxStateProps = {
            view: initialView(),
            entity: initialEntity(),
            searchHistory: initialHistory(),
            bookmarks: initialBookmarks(),
        };
        mockReduxDispatchProps = {
            querySearch: jest.fn(),
            openDetail: jest.fn(),
            clearBookmarks: jest.fn(),
            clearSearchHistory: jest.fn(),
        };
        mockReduxProps = { ...mockReduxStateProps, ...mockReduxDispatchProps };
        asideProps = { ...mockReduxProps, theme };
    });

    test('renders without crashing', () => {
        shallow(<Aside {...asideProps} />);
    });

    test('renders bookmarks and search history on search page', () => {
        const view = ViewState.Search;
        const wrapper = shallow(<Aside {...{ ...asideProps, view }} />);
        expect(wrapper.exists('[data-test="bookmark-list"]')).toBe(true);
        expect(wrapper.exists('[data-test="search-history-list"]')).toBe(true);
    });

    test('renders related metrics on metric detail page', () => {
        const view = ViewState.Detail;
        const entity: MetricDetailState = {
            type: EntityType.Metric,
            metric,
            siblings: {
                status: FetchStatus.SUCCESS,
                data: ['statsd.pmda.dropped', 'statsd.pmda.parsed', 'statsd.pmda.aggregated'],
            },
        };
        const wrapper = shallow(<Aside {...{ ...asideProps, view, entity }} />);
        expect(wrapper.find('[data-test="sibling-link"]').length).toBe(entity.siblings?.data?.length);
    });

    test('displays loader while related metrics are being loaded', () => {
        const view = ViewState.Detail;
        const entity: MetricDetailState = {
            type: EntityType.Metric,
            metric,
            siblings: {
                status: FetchStatus.PENDING,
                data: null,
            },
        };
        const wrapper = shallow(<Aside {...{ ...asideProps, view, entity }} />);
        expect(wrapper.exists('[data-test="loader"]')).toBe(true);
    });

    test('handles related metrics loading error gracefully', () => {
        const view = ViewState.Detail;
        const entity: MetricDetailState = {
            type: EntityType.Metric,
            metric,
            siblings: {
                status: FetchStatus.ERROR,
                data: null,
            },
        };
        const wrapper = shallow(<Aside {...{ ...asideProps, view, entity }} />);
        expect(wrapper.exists('[data-test="error-loading"]')).toBe(true);
    });

    test('can navigate on related metric click', () => {
        const view = ViewState.Detail;
        const siblings = ['statsd.pmda.dropped', 'statsd.pmda.parsed', 'statsd.pmda.aggregated'];
        const entity: MetricDetailState = {
            type: EntityType.Metric,
            metric,
            siblings: {
                status: FetchStatus.SUCCESS,
                data: siblings,
            },
        };
        const wrapper = shallow(<Aside {...{ ...asideProps, view, entity }} />);
        const buttons = wrapper.find('[data-test="sibling-link"]');
        buttons.forEach(button => button.simulate('click'));
        const openDetail: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.openDetail as any;
        expect(openDetail.mock.calls[0]).toEqual([siblings[0], EntityType.Metric]);
        expect(openDetail.mock.calls[1]).toEqual([siblings[1], EntityType.Metric]);
        expect(openDetail.mock.calls[2]).toEqual([siblings[2], EntityType.Metric]);
        expect(openDetail).toHaveBeenCalledTimes(siblings.length);
    });

    test('can navigate to bookmark', () => {
        const view = ViewState.Search;
        const bookmarks = [
            {
                id: 'statsd.pmda.dropped',
                type: EntityType.Metric,
            },
        ];
        const wrapper = shallow(<Aside {...{ ...asideProps, view, bookmarks }} />);
        const bookmarksList = wrapper.find('[data-test="bookmark-list"]');
        const onBookmarkClickCallback = bookmarksList.prop('onBookmarkClick') as any;
        const bookmarksPassed = bookmarksList.prop('bookmarks') as BookmarkItem[];
        onBookmarkClickCallback(bookmarksPassed[0]);
        const openDetail: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.openDetail as any;
        expect(openDetail.mock.calls[0][0]).toBe(bookmarks[0]);
        expect(openDetail).toHaveBeenCalled();
    });

    test('can navigate to search query', () => {
        const view = ViewState.Search;
        const searchHistory = [
            {
                pattern: 'test',
                pageNum: 1,
                entityFlags: SearchEntity.Instances | SearchEntity.Metrics,
            },
        ];
        const wrapper = shallow(<Aside {...{ ...asideProps, view, searchHistory }} />);
        const searchHistoryList = wrapper.find('[data-test="search-history-list"]');
        const onSearchHistoryClickCallback = searchHistoryList.prop('onSearchHistoryClick') as any;
        const searchHistoryPassed = searchHistoryList.prop('searchHistory') as BookmarkItem[];
        onSearchHistoryClickCallback(searchHistoryPassed[0]);
        const querySearch: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.querySearch as any;
        expect(querySearch.mock.calls[0][0]).toBe(searchHistory[0]);
        expect(querySearch).toHaveBeenCalled();
    });

    test('can trigger bookmarks clear', () => {
        const view = ViewState.Search;
        const wrapper = shallow(<Aside {...{ ...asideProps, view }} />);
        const bookmarksList = wrapper.find('[data-test="bookmark-list"]');
        const onClearBookmarksCallback = bookmarksList.prop('onClearBookmarksClick') as any;
        onClearBookmarksCallback();
        const clearBookmarks: jest.Mock<ClearBookmarksActionCreator> = mockReduxDispatchProps.clearBookmarks as any;
        expect(clearBookmarks).toHaveBeenCalled();
    });

    test('can trigger history clear', () => {
        const view = ViewState.Search;
        const wrapper = shallow(<Aside {...{ ...asideProps, view }} />);
        const searchHistoryList = wrapper.find('[data-test="search-history-list"]');
        const onClearSearchHistoryClick = searchHistoryList.prop('onClearSearchHistoryClick') as any;
        onClearSearchHistoryClick();
        const clearSearchHistory: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.clearSearchHistory as any;
        expect(clearSearchHistory).toHaveBeenCalled();
    });
});
