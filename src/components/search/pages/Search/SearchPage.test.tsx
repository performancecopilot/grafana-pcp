import {
    SearchPageReduxStateProps,
    SearchPageReduxDispatchProps,
    SearchPageReduxProps,
    SearchPageProps,
    SearchPage,
} from './SearchPage';
import { getTheme } from '@grafana/ui';
import { GrafanaThemeType } from '@grafana/data';
import { shallow } from 'enzyme';
import React from 'react';
import { EntityType, TextResponse } from '../../models/endpoints/search';
import { ResultDataState } from '../../store/slices/search/slices/result/state';
import { SearchResultProps } from '../../components/SearchResult/SearchResult';
import { OpenDetailActionCreator, QuerySearchActionCreator } from '../../store/slices/search/shared/actionCreators';
import { QueryState } from '../../store/slices/search/slices/query/state';
import { FetchStatus } from '../../store/slices/search/shared/state';
import { LoaderBasicProps } from '../../components/Loader/Loader';

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
                            docid: 'e2fbdde2fa19c29a5385b82de5744a87f2333c77',
                            count: 1,
                            score: 0,
                            name: '60.10',
                            type: EntityType.InstanceDomain,
                            indom: '',
                            oneline: 'set of all <b>disk</b> partitions',
                            helptext: '',
                        },
                        {
                            docid: 'ae9a90d0ae9f61f4bf4b431215ad2ae5771a74ec',
                            count: 2,
                            score: 0,
                            name: '<b>disk</b>.all.avactive',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total count of active time, summed for all disks',
                            helptext:
                                'Counts the number of milliseconds for which at least one I/O is in\nprogress on each <b>disk</b>, summed across all disks.\n\nWhen converted to a rate and divided by the number of disks (hinv.ndisk),\nthis metric represents the average utilization of all disks during the\nsampling interval.  A value of 0.25 (or 25%) means that on average every\ndisk was active (i.e. busy) one quarter of the time.',
                        },
                        {
                            docid: '16412319d4613137f21b6a030e9de71a51a18065',
                            count: 3,
                            score: 0,
                            name: '<b>disk</b>.all.aveq',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total time averaged count of request queue length, summed for all disks',
                            helptext:
                                'When converted to a rate, this metric represents the average across all disks\nof the time averaged request queue length during the sampling interval.  A\nvalue of 1.5 (or 150%) suggests that (on average) each all <b>disk</b> experienced a\ntime averaged queue length of 1.5 requests during the sampling interval.',
                        },
                        {
                            docid: '5d30d5061b5159720984526fa155c27408d65fde',
                            count: 4,
                            score: 0,
                            name: '<b>disk</b>.all.blkread',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'block read operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> block read operations since system boot time\n(subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            docid: 'ff4bd24a15efed169f1b0c79b6e7ac29d6f09171',
                            count: 5,
                            score: 0,
                            name: '<b>disk</b>.all.blktotal',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total (read+write) block operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> block read and write operations since system\nboot time (subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            docid: 'f720d8bea05750c5b3e607151753d850d1030edd',
                            count: 6,
                            score: 0,
                            name: '<b>disk</b>.all.blkwrite',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'block write operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> block write operations since system boot time\n(subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            docid: 'b4e970668dea3b77fac5b78e39617fabccd7cec3',
                            count: 7,
                            score: 0,
                            name: '<b>disk</b>.all.read',
                            type: EntityType.Metric,
                            indom: '',
                            oneline: 'total read operations, summed for all disks',
                            helptext:
                                'Cumulative number of <b>disk</b> read operations since system boot time\n(subject to counter wrap), summed over all <b>disk</b> devices.',
                        },
                        {
                            docid: 'c6a3f583cc86db82fa977819684d2564e508519d',
                            count: 8,
                            score: 0,
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
        resultProps.openDetail(result.results[0]);
        const openDetail: jest.Mock<OpenDetailActionCreator> = mockReduxDispatchProps.openDetail as any;
        expect(openDetail.mock.calls[0]).toEqual([result.results[0].name, result.results[0].type]);
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
