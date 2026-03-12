import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from '@grafana/data';
import { EntityType, TextResponse } from '../../../../common/services/pmsearch/types';
import { OpenDetailActionCreator, QuerySearchActionCreator } from '../../store/slices/search/shared/actionCreators';
import { FetchStatus } from '../../store/slices/search/shared/state';
import { QueryState } from '../../store/slices/search/slices/query/state';
import { ResultDataState } from '../../store/slices/search/slices/result/state';
import { stripHtml } from '../../utils/utils';
import {
    SearchPage,
    SearchPageProps,
    SearchPageReduxDispatchProps,
    SearchPageReduxProps,
    SearchPageReduxStateProps,
} from './SearchPage';

describe('<SearchPage/>', () => {
    let mockReduxStateProps: SearchPageReduxStateProps;
    let mockReduxDispatchProps: SearchPageReduxDispatchProps;
    let mockReduxProps: SearchPageReduxProps;
    let searchPageProps: SearchPageProps;
    const theme = createTheme();

    beforeEach(() => {
        mockReduxStateProps = {
            query: {
                pattern: 'disk',
                entityFlags: 7,
                pageNum: 1,
            },
            result: {
                status: 2,
                data: {
                    total: 86,
                    elapsed: 0.001047,
                    results: [
                        {
                            name: '60.10',
                            type: EntityType.InstanceDomain,
                            indom: '60.10',
                            oneline: 'set of all disk partitions',
                            helptext: '',
                        },
                        {
                            name: 'random',
                            type: EntityType.Instance,
                            indom: '60.20',
                            oneline: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, illum!',
                            helptext:
                                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum accusantium enim quidem. Repellendus quos, iusto ipsam, in rem corporis, expedita aspernatur quisquam id provident itaque obcaecati quo eligendi non quae!',
                        },
                        {
                            name: 'disk.all.aveq',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total time averaged count of request queue length, summed for all disks',
                            helptext:
                                'When converted to a rate, this metric represents the average across all disks of the time averaged request queue length during the sampling interval.',
                        },
                        {
                            name: 'disk.all.blkread',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'block read operations, summed for all disks',
                            helptext: 'Cumulative number of disk block read operations since system boot time.',
                        },
                        {
                            name: 'disk.all.blktotal',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total (read+write) block operations, summed for all disks',
                            helptext: 'Cumulative number of disk block read and write operations.',
                        },
                        {
                            name: 'disk.all.blkwrite',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'block write operations, summed for all disks',
                            helptext: 'Cumulative number of disk block write operations.',
                        },
                        {
                            name: 'disk.all.read',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total read operations, summed for all disks',
                            helptext: 'Cumulative number of disk read operations since system boot time.',
                        },
                        {
                            name: 'disk.all.read_bytes',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'count of bytes read for all disk devices',
                            helptext: '',
                        },
                    ],
                    limit: 8,
                    offset: 0,
                },
            },
        };
        mockReduxDispatchProps = {
            openDetail: jest.fn(),
            querySearch: jest.fn(),
        };
        mockReduxProps = { ...mockReduxStateProps, ...mockReduxDispatchProps };
        searchPageProps = { ...mockReduxProps, theme };
    });

    test('renders without crashing', () => {
        render(<SearchPage {...searchPageProps} />);
    });

    test('handles no results gracefully', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        result.elapsed = 0;
        result.total = 0;
        result.results = [];
        render(<SearchPage {...searchPageProps} />);
    });

    test('handles incorrect server response gracefully', () => {
        (searchPageProps.result as ResultDataState).data = null;
        render(<SearchPage {...searchPageProps} />);
    });

    test('renders each search result returned', () => {
        render(<SearchPage {...searchPageProps} />);
        const passedResults = ((searchPageProps.result as ResultDataState).data as TextResponse).results;
        // Each SearchResult renders one 'read-more' button
        expect(screen.getAllByTestId('read-more').length).toBe(passedResults.length);
    });

    test('renders total match count', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        render(<SearchPage {...searchPageProps} />);
        expect(screen.getByTestId('total').textContent).toBe(result.total.toString());
    });

    test('renders time elapsed', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        render(<SearchPage {...searchPageProps} />);
        expect(screen.getByTestId('elapsed').textContent).toBe(result.elapsed.toString());
    });

    test('can open search result detail', async () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        render(<SearchPage {...searchPageProps} />);
        const readMoreBtns = screen.getAllByTestId('read-more');

        const indomResult = result.results[0];
        const instanceResult = result.results[1];
        const metricResult = result.results[2];

        await userEvent.click(readMoreBtns[0]);
        await userEvent.click(readMoreBtns[1]);
        await userEvent.click(readMoreBtns[2]);

        const openDetail = mockReduxDispatchProps.openDetail as jest.Mock<OpenDetailActionCreator>;
        expect(openDetail.mock.calls[0]).toEqual([stripHtml(indomResult.indom as string), EntityType.InstanceDomain]);
        expect(openDetail.mock.calls[1]).toEqual([
            stripHtml(instanceResult.indom as string),
            EntityType.InstanceDomain,
        ]);
        expect(openDetail.mock.calls[2]).toEqual([stripHtml(metricResult.name as string), metricResult.type]);
        expect(openDetail).toHaveBeenCalled();
    });

    test('renders pagination when total result count is higher than maximum items per page', () => {
        render(<SearchPage {...searchPageProps} />);
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    test('omits pagination when total result count is lower than maximum items per page', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        result.total = result.results.length;
        render(<SearchPage {...searchPageProps} />);
        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    test('can exec query via pagination', async () => {
        const query = searchPageProps.query as QueryState;
        render(<SearchPage {...searchPageProps} />);
        // Click page 2 in pagination (Grafana Pagination renders numbered buttons)
        await userEvent.click(screen.getByRole('button', { name: '2' }));
        const querySearch = mockReduxDispatchProps.querySearch as jest.Mock<QuerySearchActionCreator>;
        expect(querySearch.mock.calls[0][0]).toEqual({ ...query, pageNum: 2 });
        expect(querySearch).toHaveBeenCalled();
    });

    test('shows loader when results are being loaded', () => {
        (searchPageProps.result as ResultDataState).status = FetchStatus.PENDING;
        render(<SearchPage {...searchPageProps} />);
        expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
    });

    test('hides loader when results are loaded', () => {
        render(<SearchPage {...searchPageProps} />);
        expect(screen.queryByTestId('spinner-container')).not.toBeInTheDocument();
    });
});
