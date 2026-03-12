import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntityType, SearchEntity } from '../../../../common/services/pmsearch/types';
import {
    IndexPage,
    IndexPageProps,
    IndexPageReduxDispatchProps,
    IndexPageReduxProps,
    IndexPageReduxStateProps,
} from './IndexPage';

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
        render(<IndexPage {...indexPageProps} />);
    });

    test('renders bookmarks', () => {
        render(<IndexPage {...indexPageProps} />);
        const bookmarkBtns = screen.getAllByTestId('bookmark-go');
        expect(bookmarkBtns.length).toBe(indexPageProps.bookmarks.length);
    });

    test('renders search history', () => {
        render(<IndexPage {...indexPageProps} />);
        const historyBtns = screen.getAllByTestId('search-history-go');
        expect(historyBtns.length).toBe(indexPageProps.searchHistory.length);
    });

    test('can navigate to bookmark', async () => {
        render(<IndexPage {...indexPageProps} />);
        const bookmark = indexPageProps.bookmarks[0];
        const bookmarkBtns = screen.getAllByTestId('bookmark-go');
        await userEvent.click(bookmarkBtns[0]);
        expect(mockReduxDispatchProps.openDetail).toHaveBeenCalled();
        expect((mockReduxDispatchProps.openDetail as jest.Mock).mock.calls[0]).toEqual([bookmark.id, bookmark.type]);
    });

    test('can navigate to search query', async () => {
        render(<IndexPage {...indexPageProps} />);
        const searchHistoryItem = indexPageProps.searchHistory[0];
        const historyBtns = screen.getAllByTestId('search-history-go');
        await userEvent.click(historyBtns[0]);
        expect(mockReduxDispatchProps.querySearch).toHaveBeenCalled();
        expect((mockReduxDispatchProps.querySearch as jest.Mock).mock.calls[0][0]).toBe(searchHistoryItem);
    });

    test('can clear bookmarks', async () => {
        render(<IndexPage {...indexPageProps} />);
        await userEvent.click(screen.getByTestId('bookmark-reset'));
        expect(mockReduxDispatchProps.clearBookmarks).toHaveBeenCalled();
    });

    test('can clear search query history', async () => {
        render(<IndexPage {...indexPageProps} />);
        await userEvent.click(screen.getByTestId('search-history-reset'));
        expect(mockReduxDispatchProps.clearSearchHistory).toHaveBeenCalled();
    });
});
