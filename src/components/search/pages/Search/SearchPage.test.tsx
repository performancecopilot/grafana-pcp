import { shallow } from 'enzyme';
import React from 'react';
import { GrafanaThemeType } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { EntityType, TextResponse } from '../../../../common/services/pmsearch/types';
import { LoaderBasicProps } from '../../components/Loader/Loader';
import { SearchResultProps } from '../../components/SearchResult/SearchResult';
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
    const theme = getTheme(GrafanaThemeType.Light);

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
                            oneline: 'set of all <b>disk</b> partitions',
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
                            name: '<b>disk</b>.all.aveq',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total time averaged count of request queue length, summed for all disks',
                            helptext:
                                'When converted to a rate, this metric represents the average across all disks\nof the time averaged request queue length during the sampling interval.  A\nvalue of 1.5 (or 150%) suggests that (on average) each all <b>disk</b> experienced a\ntime averaged queue length of 1.5 requests during the sampling interval.',
                        },
                        {
                            name: '<b>disk</b>.all.blkread',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'block read operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> block read operations since system boot time\n(subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            name: '<b>disk</b>.all.blktotal',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total (read+write) block operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> block read and write operations since system\nboot time (subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            name: '<b>disk</b>.all.blkwrite',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'block write operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> block write operations since system boot time\n(subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            name: '<b>disk</b>.all.read',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total read operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> read operations since system boot time\n(subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            name: '<b>disk</b>.all.read_bytes',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'count of bytes read for all <b>disk</b> devices',
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
        shallow(<SearchPage {...searchPageProps} />);
    });

    test('handles no results gracefully', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        result.elapsed = 0;
        result.total = 0;
        result.results = [];
        shallow(<SearchPage {...searchPageProps} />);
    });

    test('handles incorrect server response gracefully', () => {
        (searchPageProps.result as ResultDataState).data = null;
        shallow(<SearchPage {...searchPageProps} />);
    });

    test('renders each search result returned', () => {
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        const passedResults = ((searchPageProps.result as ResultDataState).data as TextResponse).results;
        passedResults.forEach((x, i) => {
            const item = wrapper.find(`[data-test="search-result-${i}"]`);
            expect(item.exists()).toBe(true);
            const resultProps: SearchResultProps = item.props() as any;
            expect(resultProps.item).toBe(x);
        });
    });

    test('renders total match count', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        expect(wrapper.find('[data-test="total"]').text()).toBe(result.total.toString());
    });

    test('renders time elapsed', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        expect(wrapper.find('[data-test="elapsed"]').text()).toBe(result.elapsed.toString());
    });

    test('can open search result detail', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        const searchResult = wrapper.find('[data-test="search-result-0"]');
        const resultProps: SearchResultProps = searchResult.props() as any;
        const indomResult = result.results[0];
        const instanceResult = result.results[1];
        const metricResult = result.results[2];
        resultProps.openDetail(indomResult);
        resultProps.openDetail(instanceResult);
        resultProps.openDetail(metricResult);
        const openDetail: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.openDetail as any;
        expect(openDetail.mock.calls[0]).toEqual([stripHtml(indomResult.indom as string), EntityType.InstanceDomain]);
        expect(openDetail.mock.calls[1]).toEqual([
            stripHtml(instanceResult.indom as string),
            EntityType.InstanceDomain,
        ]);
        expect(openDetail.mock.calls[2]).toEqual([stripHtml(metricResult.name as string), metricResult.type]);
        expect(openDetail).toHaveBeenCalled();
    });

    test('renders pagination when total result count is higher than maximum items per page', () => {
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        expect(wrapper.exists('[data-test="pagination"]')).toBe(true);
    });

    test('omits paginations when total result count is lower than maximum items per page', () => {
        const result = (searchPageProps.result as ResultDataState).data as TextResponse;
        result.total = result.results.length;
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        expect(wrapper.exists('[data-test="pagination"]')).toBe(false);
    });

    test('can exec query via pagination', () => {
        const query = searchPageProps.query as QueryState;
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        const pagination = wrapper.find('[data-test="pagination"]');
        const paginationProps = pagination.props() as any;
        paginationProps.onNavigate(2);
        const querySearch: jest.Mock<QuerySearchActionCreator> = mockReduxDispatchProps.querySearch as any;
        expect(querySearch.mock.calls[0][0]).toEqual({ ...query, pageNum: 2 });
        expect(querySearch).toHaveBeenCalled();
    });

    test('shows loader when results are being loaded', () => {
        (searchPageProps.result as ResultDataState).status = FetchStatus.PENDING;
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        const loader = wrapper.find('[data-test="loader"]');
        const loaderProps: LoaderBasicProps = loader.props() as any;
        expect(loaderProps.loaded).toBe(false);
    });

    test('hides loader when results are loaded', () => {
        const wrapper = shallow(<SearchPage {...searchPageProps} />);
        const loader = wrapper.find('[data-test="loader"]');
        const loaderProps: LoaderBasicProps = loader.props() as any;
        expect(loaderProps.loaded).toBe(true);
    });
});
