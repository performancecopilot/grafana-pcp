import {
    IndexPageReduxProps,
    IndexPageReduxStateProps,
    IndexPageReduxDispatchProps,
    IndexPageProps,
    IndexPage,
} from './IndexPage';
import { shallow } from 'enzyme';
import React from 'react';
import { EntityType, SearchEntity } from '../../models/endpoints/search';
import { BookmarkListProps } from '../../components/BookmarkList/BookmarkList';
import { SearchHistoryListProps } from '../../components/SearchHistoryList/SearchHistoryList';
import { OpenDetailActionCreator, QuerySearchActionCreator } from '../../store/slices/search/shared/actionCreators';
import { ClearSearchHistoryActionCreator } from '../../store/slices/search/slices/history/actionCreators';

describe('<IndexPage/>', () => {
    let mockReduxStateProps: IndexPageReduxStateProps;
    let mockReduxDispatchProps: IndexPageReduxDispatchProps;
    let mockReduxProps: IndexPageReduxProps;
    let indexPageProps: IndexPageProps;

    beforeEach(() => {
        mockReduxStateProps = {
            bookmarks: [
                {
                    id: 'statsd.settings.dropped',
                    type: EntityType.Metric,
                },
                {
                    id: '60.2',
                    type: EntityType.InstanceDomain,
                },
            ],
            searchHistory: [
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
            ],
        };
        mockReduxDispatchProps = {
            querySearch: jest.fn(),
            openDetail: jest.fn(),
            clearBookmarks: jest.fn(),
            clearSearchHistory: jest.fn(),
        };
        mockReduxProps = { ...mockReduxStateProps, ...mockReduxDispatchProps };
        indexPageProps = mockReduxProps;
    });

    test('renders without crashing', () => {
        shallow(<IndexPage {...indexPageProps} />);
    });

    test('renders bookmarks', () => {
        const wrapper = shallow(<IndexPage {...indexPageProps} />);
        const bookmarkList = wrapper.find('[data-test="bookmark-list"]');
        expect(bookmarkList.exists()).toBe(true);
        const props: BookmarkListProps = bookmarkList.props() as any;
        expect(props.bookmarks).toBe(indexPageProps.bookmarks);
    });

    test('renders search history', () => {
        const wrapper = shallow(<IndexPage {...indexPageProps} />);
        const searchHistoryList = wrapper.find('[data-test="search-history-list"]');
        expect(searchHistoryList.exists()).toBe(true);
        const props: SearchHistoryListProps = searchHistoryList.props() as any;
        expect(props.searchHistory).toBe(indexPageProps.searchHistory);
    });

    test('can navigate to bookmark', () => {
        const wrapper = shallow(<IndexPage {...indexPageProps} />);
        const bookmarkList = wrapper.find('[data-test="bookmark-list"]');
        const props: BookmarkListProps = bookmarkList.props() as any;
        const bookmark = indexPageProps.bookmarks[0];
        props.onBookmarkClick(bookmark.id, bookmark.type);
        const openDetail: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.openDetail as any;
        expect(openDetail).toHaveBeenCalled();
        expect(openDetail.mock.calls[0]).toEqual([bookmark.id, bookmark.type]);
    });

    test('can navigate to search query', () => {
        const wrapper = shallow(<IndexPage {...indexPageProps} />);
        const searchHistoryList = wrapper.find('[data-test="search-history-list"]');
        const props: SearchHistoryListProps = searchHistoryList.props() as any;
        const searchHistoryItem = indexPageProps.searchHistory[0];
        props.onSearchHistoryClick(searchHistoryItem);
        const querySearch: jest.Mock<QuerySearchActionCreator> = mockReduxDispatchProps.querySearch as any;
        expect(querySearch).toHaveBeenCalled();
        expect(querySearch.mock.calls[0][0]).toBe(searchHistoryItem);
    });

    test('can clear bookmakrs', () => {
        const wrapper = shallow(<IndexPage {...indexPageProps} />);
        const bookmarkList = wrapper.find('[data-test="bookmark-list"]');
        const props: BookmarkListProps = bookmarkList.props() as any;
        props.onClearBookmarksClick();
        const clearBookmarks: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.clearBookmarks as any;
        expect(clearBookmarks).toHaveBeenCalled();
    });

    test('can clear search query history', () => {
        const wrapper = shallow(<IndexPage {...indexPageProps} />);
        const searchHistoryList = wrapper.find('[data-test="search-history-list"]');
        const props: SearchHistoryListProps = searchHistoryList.props() as any;
        props.onClearSearchHistoryClick();
        const clearSearchHistory: jest.Mock<ClearSearchHistoryActionCreator> = mockReduxDispatchProps.clearSearchHistory as any;
        expect(clearSearchHistory).toHaveBeenCalled();
    });
});
