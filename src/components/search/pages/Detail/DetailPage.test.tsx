import { DetailPage, DetailPageReduxProps, DetailPageProps } from './DetailPage';
import React from 'react';
import { shallow } from 'enzyme';
import { MetricDetailPageBasicProps } from './Metric/Metric';
import { InstanceDomainDetailPageBasicProps } from './InstanceDomain/InstanceDomain';
import { InstanceDomainDetailState, MetricDetailState } from '../../store/slices/search/slices/entity/state';
import { EntityType } from '../../models/endpoints/search';
import { FetchStatus } from '../../store/slices/search/shared/state';
import { MetricEntity } from '../../models/entities/metric';
import { IndomEntity } from '../../models/entities/indom';

describe('<DetailPage/>', () => {
    let mockReduxProps: DetailPageReduxProps;
    let instanceDomainDetailStateMock: InstanceDomainDetailState;
    let metricDetailStateMock: MetricDetailState;
    let detailPageProps: DetailPageProps;

    beforeEach(() => {
        instanceDomainDetailStateMock = {
            type: EntityType.InstanceDomain,
            indom: {
                data: {
                    context: 927862141,
                    indom: '60.3',
                    labels: {
                        device_type: 'interface',
                        domainname: 'localdomain',
                        hostname: 'localhost.localdomain',
                        indom_name: 'per interface',
                        machineid: 'e89b1710db70431e96453dae52cd95c2',
                    },
                    'text-oneline': 'set of network interfaces',
                    'text-help': 'set of network interfaces',
                    instances: [
                        {
                            instance: 5,
                            name: 'docker0',
                            labels: {
                                domainname: 'localdomain',
                                hostname: 'localhost.localdomain',
                                machineid: 'e89b1710db70431e96453dae52cd95c2',
                            },
                        },
                        {
                            instance: 2,
                            name: 'wlp0s20f3',
                            labels: {
                                domainname: 'localdomain',
                                hostname: 'localhost.localdomain',
                                machineid: 'e89b1710db70431e96453dae52cd95c2',
                            },
                        },
                        {
                            instance: 35,
                            name: 'veth80732b1',
                            labels: {
                                domainname: 'localdomain',
                                hostname: 'localhost.localdomain',
                                machineid: 'e89b1710db70431e96453dae52cd95c2',
                            },
                        },
                        {
                            instance: 0,
                            name: 'lo',
                            labels: {
                                domainname: 'localdomain',
                                hostname: 'localhost.localdomain',
                                machineid: 'e89b1710db70431e96453dae52cd95c2',
                            },
                        },
                        {
                            instance: 4,
                            name: 'virbr0-nic',
                            labels: {
                                domainname: 'localdomain',
                                hostname: 'localhost.localdomain',
                                machineid: 'e89b1710db70431e96453dae52cd95c2',
                            },
                        },
                        {
                            instance: 3,
                            name: 'virbr0',
                            labels: {
                                domainname: 'localdomain',
                                hostname: 'localhost.localdomain',
                                machineid: 'e89b1710db70431e96453dae52cd95c2',
                            },
                        },
                        {
                            instance: 1,
                            name: 'ens20u2',
                            labels: {
                                domainname: 'localdomain',
                                hostname: 'localhost.localdomain',
                                machineid: 'e89b1710db70431e96453dae52cd95c2',
                            },
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
        shallow(<DetailPage {...detailPageProps} />);
    });

    test('can render metric detail', () => {
        const wrapper = shallow(<DetailPage {...detailPageProps} />);
        expect(wrapper.exists('[data-test="metric-detail"]')).toBe(true);
    });

    test('can render instance domain detail', () => {
        const wrapper = shallow(<DetailPage {...{ ...detailPageProps, entity: instanceDomainDetailStateMock }} />);
        expect(wrapper.exists('[data-test="instance-domain-detail"]')).toBe(true);
    });

    test('handles no data gracefully', () => {
        shallow(<DetailPage {...{ ...detailPageProps, entity: null }} />);
    });

    test('can add metric bookmark', () => {
        const wrapper = shallow<DetailPage, DetailPageProps, {}>(<DetailPage {...detailPageProps} />);
        const metricDetail = wrapper.find('[data-test="metric-detail"]');
        const metricDetailProps: MetricDetailPageBasicProps = metricDetail.props() as any;
        const id = ((detailPageProps.entity as MetricDetailState).metric.data as MetricEntity).name;
        const type = (detailPageProps.entity as MetricDetailState).type;
        metricDetailProps.onBookmark({
            id,
            type,
        });
        const addBookmark: jest.Mock<typeof mockReduxProps.addBookmark> = mockReduxProps.addBookmark as any;
        expect(addBookmark.mock.calls[0][0]).toEqual({ id, type });
        expect(addBookmark).toHaveBeenCalled();
    });

    test('can add indom bookmark', () => {
        const props = { ...detailPageProps, entity: instanceDomainDetailStateMock };
        const wrapper = shallow<DetailPage, DetailPageProps, {}>(<DetailPage {...props} />);
        const instanceDomainDetail = wrapper.find('[data-test="instance-domain-detail"]');
        const instanceDomainDetailProps: InstanceDomainDetailPageBasicProps = instanceDomainDetail.props() as any;
        const id = ((props.entity as InstanceDomainDetailState).indom.data as IndomEntity).indom;
        const type = (props.entity as InstanceDomainDetailState).type;
        instanceDomainDetailProps.onBookmark({
            id,
            type,
        });
        const addBookmark: jest.Mock<typeof mockReduxProps.addBookmark> = mockReduxProps.addBookmark as any;
        expect(addBookmark.mock.calls[0][0]).toEqual({ id, type });
        expect(addBookmark).toHaveBeenCalled();
    });

    test('can remove metric bookmark', () => {
        const wrapper = shallow<DetailPage, DetailPageProps, {}>(<DetailPage {...detailPageProps} />);
        const metricDetail = wrapper.find('[data-test="metric-detail"]');
        const metricDetailProps: MetricDetailPageBasicProps = metricDetail.props() as any;
        const id = ((detailPageProps.entity as MetricDetailState).metric.data as MetricEntity).name;
        const type = (detailPageProps.entity as MetricDetailState).type;
        metricDetailProps.onUnbookmark({
            id,
            type,
        });
        const removeBookmark: jest.Mock<typeof mockReduxProps.removeBookmark> = mockReduxProps.removeBookmark as any;
        expect(removeBookmark.mock.calls[0][0]).toEqual({ id, type });
        expect(removeBookmark).toHaveBeenCalled();
    });

    test('can remove indom bookmark', () => {
        const props = { ...detailPageProps, entity: instanceDomainDetailStateMock };
        const wrapper = shallow<DetailPage, DetailPageProps, {}>(<DetailPage {...props} />);
        const instanceDomainDetail = wrapper.find('[data-test="instance-domain-detail"]');
        const instanceDomainDetailProps: InstanceDomainDetailPageBasicProps = instanceDomainDetail.props() as any;
        // const locationSrvMock = jest.fn();
        // (wrapper.instance().locationSrv as any) = locationSrvMock;
        const id = ((props.entity as InstanceDomainDetailState).indom.data as IndomEntity).indom;
        const type = (props.entity as InstanceDomainDetailState).type;
        instanceDomainDetailProps.onUnbookmark({
            id,
            type,
        });
        const removeBookmark: jest.Mock<typeof mockReduxProps.removeBookmark> = mockReduxProps.removeBookmark as any;
        expect(removeBookmark.mock.calls[0][0]).toEqual({ id, type });
        expect(removeBookmark).toHaveBeenCalled();
    });

    test('can preview metric with graph dashboard', () => {
        const wrapper = shallow<DetailPage, DetailPageProps, {}>(<DetailPage {...detailPageProps} />);
        const locationSrvMock = { update: jest.fn() };
        (wrapper.instance().locationSrv as any) = locationSrvMock;
        const metricDetail = wrapper.find('[data-test="metric-detail"]');
        const metricDetailProps: MetricDetailPageBasicProps = metricDetail.props() as any;
        const id = ((detailPageProps.entity as MetricDetailState).metric.data as MetricEntity).name;
        metricDetailProps.onPreview({
            id,
            type: 'graph',
        });
        expect(locationSrvMock.update.mock.calls[0][0]).toEqual({
            path: '/d/grafana-pcp-app-graph-preview/graph-preview',
            query: {
                'var-entity': id,
                refresh: '5s',
            },
        });
    });

    test('can preview metric with table dashboard', () => {
        const wrapper = shallow<DetailPage, DetailPageProps, {}>(<DetailPage {...detailPageProps} />);
        const locationSrvMock = { update: jest.fn() };
        (wrapper.instance().locationSrv as any) = locationSrvMock;
        const metricDetail = wrapper.find('[data-test="metric-detail"]');
        const metricDetailProps: MetricDetailPageBasicProps = metricDetail.props() as any;
        const id = ((detailPageProps.entity as MetricDetailState).metric.data as MetricEntity).name;
        metricDetailProps.onPreview({
            id,
            type: 'table',
        });
        expect(locationSrvMock.update.mock.calls[0][0]).toEqual({
            path: '/d/grafana-pcp-app-table-preview/table-preview',
            query: {
                'var-entity': id,
                refresh: '5s',
            },
        });
    });
});
