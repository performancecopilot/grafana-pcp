import React from 'react';
import { render, screen } from '@testing-library/react';
import { locationService } from '@grafana/runtime';
import { EntityType } from '../../../../common/services/pmsearch/types';
import { FetchStatus } from '../../store/slices/search/shared/state';
import { InstanceDomainDetailState, MetricDetailState } from '../../store/slices/search/slices/entity/state';
import { DetailPage, DetailPageProps, DetailPageReduxProps } from './DetailPage';

jest.mock('@grafana/runtime', () => ({
    ...jest.requireActual('@grafana/runtime'),
    locationService: { push: jest.fn() },
}));

let capturedMetricDetailProps: any = null;
let capturedInstanceDomainDetailProps: any = null;

jest.mock('./Metric/Metric', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: function MockMetricDetailPage(props: any) {
            capturedMetricDetailProps = props;
            return <div data-test="metric-detail" />;
        },
    };
});

jest.mock('./InstanceDomain/InstanceDomain', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: function MockInstanceDomainDetailPage(props: any) {
            capturedInstanceDomainDetailProps = props;
            return <div data-test="instance-domain-detail" />;
        },
    };
});

describe('<DetailPage/>', () => {
    let mockReduxProps: DetailPageReduxProps;
    let instanceDomainDetailStateMock: InstanceDomainDetailState;
    let metricDetailStateMock: MetricDetailState;
    let detailPageProps: DetailPageProps;

    beforeEach(() => {
        capturedMetricDetailProps = null;
        capturedInstanceDomainDetailProps = null;
        (locationService.push as jest.Mock).mockClear();

        instanceDomainDetailStateMock = {
            type: EntityType.InstanceDomain,
            indom: {
                data: {
                    indom: {
                        name: '60.3',
                        oneline: 'set of network interfaces',
                    },
                    instances: [
                        { name: 'virbr0-nic' },
                        { name: 'virbr0' },
                        { name: 'wlp0s20f3' },
                        { name: 'ens20u2' },
                        { name: 'lo' },
                        { name: 'veth2d4d8bb' },
                        { name: 'docker0' },
                    ],
                    metrics: [
                        {
                            name: 'network.interface.wireless',
                            oneline: 'boolean for whether interface is wireless',
                        },
                        {
                            name: 'network.interface.up',
                            oneline: 'boolean for whether interface is currently up or down',
                        },
                    ],
                },
                status: FetchStatus.SUCCESS,
            },
        };

        metricDetailStateMock = {
            type: EntityType.Metric,
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

        mockReduxProps = {
            entity: metricDetailStateMock,
            addBookmark: jest.fn(),
            removeBookmark: jest.fn(),
        };

        detailPageProps = mockReduxProps;
    });

    test('renders without crashing', () => {
        render(<DetailPage {...detailPageProps} />);
    });

    test('can render metric detail', () => {
        render(<DetailPage {...detailPageProps} />);
        expect(screen.getByTestId('metric-detail')).toBeInTheDocument();
    });

    test('can render instance domain detail', () => {
        render(<DetailPage {...{ ...detailPageProps, entity: instanceDomainDetailStateMock }} />);
        expect(screen.getByTestId('instance-domain-detail')).toBeInTheDocument();
    });

    test('handles no data gracefully', () => {
        render(<DetailPage {...{ ...detailPageProps, entity: null }} />);
    });

    test('can add metric bookmark', () => {
        render(<DetailPage {...detailPageProps} />);
        const id = (metricDetailStateMock.metric.data as any).name;
        const type = metricDetailStateMock.type;
        capturedMetricDetailProps.onBookmark({ id, type });
        expect(mockReduxProps.addBookmark).toHaveBeenCalledWith({ id, type });
    });

    test('can add indom bookmark', () => {
        render(<DetailPage {...{ ...detailPageProps, entity: instanceDomainDetailStateMock }} />);
        const name = (instanceDomainDetailStateMock.indom.data as any).indom.name as string;
        const type = instanceDomainDetailStateMock.type;
        capturedInstanceDomainDetailProps.onBookmark({ id: name, type });
        expect(mockReduxProps.addBookmark).toHaveBeenCalledWith({ id: name, type });
    });

    test('can remove metric bookmark', () => {
        render(<DetailPage {...detailPageProps} />);
        const id = (metricDetailStateMock.metric.data as any).name;
        const type = metricDetailStateMock.type;
        capturedMetricDetailProps.onUnbookmark({ id, type });
        expect(mockReduxProps.removeBookmark).toHaveBeenCalledWith({ id, type });
    });

    test('can remove indom bookmark', () => {
        render(<DetailPage {...{ ...detailPageProps, entity: instanceDomainDetailStateMock }} />);
        const name = (instanceDomainDetailStateMock.indom.data as any).indom.name as string;
        const type = instanceDomainDetailStateMock.type;
        capturedInstanceDomainDetailProps.onUnbookmark({ id: name, type });
        expect(mockReduxProps.removeBookmark).toHaveBeenCalledWith({ id: name, type });
    });

    test('can preview metric with graph dashboard', () => {
        render(<DetailPage {...detailPageProps} />);
        const id = (metricDetailStateMock.metric.data as any).name;
        capturedMetricDetailProps.onPreview({ id, type: 'graph' });
        const pushMock = locationService.push as jest.Mock;
        expect(pushMock).toHaveBeenCalledTimes(1);
        const calledUrl: string = pushMock.mock.calls[0][0];
        expect(calledUrl).toContain('pcp-valkey-metric-preview-graph');
        expect(calledUrl).toContain(`var-metric=${encodeURIComponent(id)}`);
        expect(calledUrl).toContain('refresh=5s');
    });

    test('can preview metric with table dashboard', () => {
        render(<DetailPage {...detailPageProps} />);
        const id = (metricDetailStateMock.metric.data as any).name;
        capturedMetricDetailProps.onPreview({ id, type: 'table' });
        const pushMock = locationService.push as jest.Mock;
        expect(pushMock).toHaveBeenCalledTimes(1);
        const calledUrl: string = pushMock.mock.calls[0][0];
        expect(calledUrl).toContain('pcp-valkey-metric-preview-table');
        expect(calledUrl).toContain(`var-metric=${encodeURIComponent(id)}`);
        expect(calledUrl).toContain('refresh=5s');
    });
});
