import { GrafanaThemeType } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { shallow } from 'enzyme';
import React from 'react';
import { EntityType } from '../../../../../common/services/pmsearch/types';
import { LoaderBasicProps } from '../../../components/Loader/Loader';
import { MetricEntity } from '../../../models/entities/metric';
import { FetchStatus } from '../../../store/slices/search/shared/state';
import {
    MetricDetailPage,
    MetricDetailPageBasicProps,
    MetricDetailPageProps,
    MetricDetailPageReduxProps,
} from './Metric';

describe('Detail Page <MetricDetailpage/>', () => {
    let mockReduxProps: MetricDetailPageReduxProps;
    let metricDetailEntityProps: MetricDetailPageBasicProps;
    let metricDetailProps: MetricDetailPageProps;
    const theme = getTheme(GrafanaThemeType.Light);

    beforeEach(() => {
        mockReduxProps = {
            bookmarks: [
                {
                    id: 'statsd.pmda.received',
                    type: EntityType.Metric,
                },
                {
                    id: 'statsd.pmda.dropped',
                    type: EntityType.Instance,
                },
            ],
        };
        metricDetailEntityProps = {
            onBookmark: jest.fn(),
            onUnbookmark: jest.fn(),
            onPreview: jest.fn(),
            metric: {
                data: {
                    name: 'statsd.pmda.parsed',
                    oneline: 'random statsd metric oneline help',
                    help: 'random statsd metric long help',
                    series: [
                        {
                            series: 'series1',
                            meta: {
                                indom: 'indom',
                                pmid: 'pmid',
                                semantics: 'sematics',
                                type: 'u64',
                                units: 'units',
                                source: 'source',
                            },
                            labels: {
                                label1: 'label 1',
                                label2: 'label 2',
                            },
                        },
                    ],
                },
                status: FetchStatus.SUCCESS,
            },
        };
        metricDetailProps = { ...mockReduxProps, ...metricDetailEntityProps, theme };
    });

    test('renders without crashing', () => {
        shallow(<MetricDetailPage {...metricDetailProps} />);
    });

    test('displays preview button', () => {
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        expect(wrapper.exists('[data-test="preview-button"]')).toBe(true);
    });

    test('can trigger preview with table dashboard for string metric type', () => {
        (metricDetailProps.metric.data as MetricEntity).series[0].meta.type = 'string';
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const previewButton = wrapper.find('[data-test="preview-button"]');
        previewButton.simulate('click');
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const previewCallback: jest.Mock<typeof metricDetailProps.onPreview> = metricDetailProps.onPreview as any;
        expect(previewCallback.mock.calls[0][0]).toEqual({ id: metricName, type: 'table' });
        expect(previewCallback).toHaveBeenCalled();
    });

    test('can trigger preview with graph dashboard for non-string metric type', () => {
        (metricDetailProps.metric.data as MetricEntity).series[0].meta.type = 'u64';
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const previewButton = wrapper.find('[data-test="preview-button"]');
        previewButton.simulate('click');
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const previewCallback: jest.Mock<typeof metricDetailProps.onPreview> = metricDetailProps.onPreview as any;
        expect(previewCallback.mock.calls[0][0]).toEqual({ id: metricName, type: 'graph' });
        expect(previewCallback).toHaveBeenCalled();
    });

    test('displays bookmark button when metric is not bookmarked', () => {
        // default props does not contain metric that is bookmarked in items mock
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        expect(wrapper.exists('[data-test="bookmark-button"]')).toBe(true);
    });

    test('displays unbookmark button when metric is bookmarked', () => {
        // this metric is not in bookmarked items mock
        (metricDetailProps.metric.data as MetricEntity).name = 'statsd.pmda.received';
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        expect(wrapper.exists('[data-test="unbookmark-button"]')).toBe(true);
    });

    test('can trigger bookmark', () => {
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const bookmarkButton = wrapper.find('[data-test="bookmark-button"]');
        bookmarkButton.simulate('click');
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const bookmarkCallback: jest.Mock<typeof metricDetailProps.onBookmark> = metricDetailProps.onBookmark as any;
        expect(bookmarkCallback.mock.calls[0][0]).toEqual({ id: metricName, type: EntityType.Metric });
        expect(bookmarkCallback).toHaveBeenCalled();
    });

    test('can trigger unbookmark', () => {
        (metricDetailProps.metric.data as MetricEntity).name = 'statsd.pmda.received';
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const unbookmarkButton = wrapper.find('[data-test="unbookmark-button"]');
        unbookmarkButton.simulate('click');
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const unbookmarkCallback: jest.Mock<typeof metricDetailProps.onUnbookmark> = metricDetailProps.onUnbookmark as any;
        expect(unbookmarkCallback.mock.calls[0][0]).toEqual({ id: metricName, type: EntityType.Metric });
        expect(unbookmarkCallback).toHaveBeenCalled();
    });

    test('displays title', () => {
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const title = wrapper.find('[data-test="title"]');
        expect(title.exists()).toBe(true);
        expect(title.text()).toBe(metricDetailProps.metric.data?.name);
    });

    test('displays description', () => {
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.exists());
    });

    test('description prioritizes long help text', () => {
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.text()).toBe(metricDetailProps.metric.data?.help);
    });

    test('description falls back to oneline help when long help text is not available', () => {
        (metricDetailProps.metric.data as MetricEntity).help = '';
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.text()).toBe(metricDetailProps.metric.data?.oneline);
    });

    test('displays series', () => {
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const series = wrapper.find('[data-test="series"]');
        expect(series.length).toBe(metricDetailProps.metric.data?.series.length);
    });

    test('handles lack of metric data gracefully', () => {
        metricDetailProps.metric.data = null;
        shallow(<MetricDetailPage {...metricDetailProps} />);
    });

    test('handles error while fetching metric data gracefully', () => {
        metricDetailProps.metric.data = null;
        metricDetailProps.metric.status = FetchStatus.ERROR;
        shallow(<MetricDetailPage {...metricDetailProps} />);
    });

    test('handles lack of series gracefully', () => {
        (metricDetailProps.metric.data as MetricEntity).series = [];
        shallow(<MetricDetailPage {...metricDetailProps} />);
    });

    test('shows loader when metric is being loaded', () => {
        metricDetailProps.metric.status = FetchStatus.PENDING;
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const loader = wrapper.find('[data-test="loader"]');
        const loaderProps: LoaderBasicProps = loader.props() as any;
        expect(loaderProps.loaded).toBe(false);
    });

    test('hides loader when metric is loaded', () => {
        const wrapper = shallow(<MetricDetailPage {...metricDetailProps} />);
        const loader = wrapper.find('[data-test="loader"]');
        const loaderProps: LoaderBasicProps = loader.props() as any;
        expect(loaderProps.loaded).toBe(true);
    });
});
