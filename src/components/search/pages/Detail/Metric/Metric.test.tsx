import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from '@grafana/data';

// Series is a Redux-connected component; mock it to avoid needing a store
jest.mock('./Series/Series', () => ({
    __esModule: true,
    default: () => <div data-test="series-name" />,
}));
import { EntityType } from '../../../../../common/services/pmsearch/types';
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
    const theme = createTheme();

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
        render(<MetricDetailPage {...metricDetailProps} />);
    });

    test('displays preview button', () => {
        render(<MetricDetailPage {...metricDetailProps} />);
        expect(screen.getByTestId('preview-button')).toBeInTheDocument();
    });

    test('can trigger preview with table dashboard for string metric type', async () => {
        (metricDetailProps.metric.data as MetricEntity).series[0].meta.type = 'string';
        render(<MetricDetailPage {...metricDetailProps} />);
        await userEvent.click(screen.getByTestId('preview-button'));
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const previewCallback = metricDetailProps.onPreview as jest.Mock;
        expect(previewCallback.mock.calls[0][0]).toEqual({ id: metricName, type: 'table' });
        expect(previewCallback).toHaveBeenCalled();
    });

    test('can trigger preview with graph dashboard for non-string metric type', async () => {
        (metricDetailProps.metric.data as MetricEntity).series[0].meta.type = 'u64';
        render(<MetricDetailPage {...metricDetailProps} />);
        await userEvent.click(screen.getByTestId('preview-button'));
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const previewCallback = metricDetailProps.onPreview as jest.Mock;
        expect(previewCallback.mock.calls[0][0]).toEqual({ id: metricName, type: 'graph' });
        expect(previewCallback).toHaveBeenCalled();
    });

    test('displays bookmark button when metric is not bookmarked', () => {
        // default props does not contain metric that is bookmarked in items mock
        render(<MetricDetailPage {...metricDetailProps} />);
        expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
    });

    test('displays unbookmark button when metric is bookmarked', () => {
        (metricDetailProps.metric.data as MetricEntity).name = 'statsd.pmda.received';
        render(<MetricDetailPage {...metricDetailProps} />);
        expect(screen.getByTestId('unbookmark-button')).toBeInTheDocument();
    });

    test('can trigger bookmark', async () => {
        render(<MetricDetailPage {...metricDetailProps} />);
        await userEvent.click(screen.getByTestId('bookmark-button'));
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const bookmarkCallback = metricDetailProps.onBookmark as jest.Mock;
        expect(bookmarkCallback.mock.calls[0][0]).toEqual({ id: metricName, type: EntityType.Metric });
        expect(bookmarkCallback).toHaveBeenCalled();
    });

    test('can trigger unbookmark', async () => {
        (metricDetailProps.metric.data as MetricEntity).name = 'statsd.pmda.received';
        render(<MetricDetailPage {...metricDetailProps} />);
        await userEvent.click(screen.getByTestId('unbookmark-button'));
        const metricName = (metricDetailProps.metric.data as MetricEntity).name;
        const unbookmarkCallback = metricDetailProps.onUnbookmark as jest.Mock;
        expect(unbookmarkCallback.mock.calls[0][0]).toEqual({ id: metricName, type: EntityType.Metric });
        expect(unbookmarkCallback).toHaveBeenCalled();
    });

    test('displays title', () => {
        render(<MetricDetailPage {...metricDetailProps} />);
        const title = screen.getByTestId('title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe(metricDetailProps.metric.data?.name);
    });

    test('displays description', () => {
        render(<MetricDetailPage {...metricDetailProps} />);
        expect(screen.getByTestId('description')).toBeInTheDocument();
    });

    test('description prioritizes long help text', () => {
        render(<MetricDetailPage {...metricDetailProps} />);
        const description = screen.getByTestId('description');
        expect(description.textContent).toBe(metricDetailProps.metric.data?.help);
    });

    test('description falls back to oneline help when long help text is not available', () => {
        (metricDetailProps.metric.data as MetricEntity).help = '';
        render(<MetricDetailPage {...metricDetailProps} />);
        const description = screen.getByTestId('description');
        expect(description.textContent).toBe(metricDetailProps.metric.data?.oneline);
    });

    test('displays series', () => {
        render(<MetricDetailPage {...metricDetailProps} />);
        const seriesElements = screen.getAllByTestId('series-name');
        expect(seriesElements.length).toBe(metricDetailProps.metric.data?.series.length);
    });

    test('handles lack of metric data gracefully', () => {
        metricDetailProps.metric.data = null;
        render(<MetricDetailPage {...metricDetailProps} />);
    });

    test('handles error while fetching metric data gracefully', () => {
        metricDetailProps.metric.data = null;
        metricDetailProps.metric.status = FetchStatus.ERROR;
        render(<MetricDetailPage {...metricDetailProps} />);
    });

    test('handles lack of series gracefully', () => {
        (metricDetailProps.metric.data as MetricEntity).series = [];
        render(<MetricDetailPage {...metricDetailProps} />);
    });

    test('shows loader when metric is being loaded', () => {
        metricDetailProps.metric.status = FetchStatus.PENDING;
        render(<MetricDetailPage {...metricDetailProps} />);
        expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
    });

    test('hides loader when metric is loaded', () => {
        render(<MetricDetailPage {...metricDetailProps} />);
        expect(screen.queryByTestId('spinner-container')).not.toBeInTheDocument();
    });
});
