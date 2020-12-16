import { GrafanaThemeType } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { shallow } from 'enzyme';
import React from 'react';
import { EntityType } from '../../../../../common/services/pmsearch/types';
import { LoaderBasicProps } from '../../../components/Loader/Loader';
import { IndomEntity } from '../../../models/entities/indom';
import { FetchStatus } from '../../../store/slices/search/shared/state';
import {
    InstanceDomainDetailPage,
    InstanceDomainDetailPageBasicProps,
    InstanceDomainDetailPageProps,
    InstanceDomainDetailPageReduxProps,
} from './InstanceDomain';
import { InstancesProps } from './Instances/Instances';

describe('Detail Page <InstanceDomainPage/>', () => {
    let mockReduxProps: InstanceDomainDetailPageReduxProps;
    let instanceDomainDetailEntityProps: InstanceDomainDetailPageBasicProps;
    let instanceDomainDetailProps: InstanceDomainDetailPageProps;

    const theme = getTheme(GrafanaThemeType.Light);

    beforeEach(() => {
        mockReduxProps = {
            bookmarks: [
                {
                    id: '60.1',
                    type: EntityType.InstanceDomain,
                },
                {
                    id: '60.2',
                    type: EntityType.InstanceDomain,
                },
            ],
        };
        instanceDomainDetailEntityProps = {
            onBookmark: jest.fn(),
            onUnbookmark: jest.fn(),
            indom: {
                data: {
                    indom: {
                        name: '60.3',
                        oneline: 'set of network interfaces',
                        helptext: 'example helptext that may not really exist',
                    },
                    instances: [
                        {
                            name: 'virbr0-nic',
                        },
                        {
                            name: 'virbr0',
                        },
                        {
                            name: 'wlp0s20f3',
                        },
                        {
                            name: 'ens20u2',
                        },
                        {
                            name: 'lo',
                        },
                        {
                            name: 'veth2d4d8bb',
                        },
                        {
                            name: 'docker0',
                        },
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
        instanceDomainDetailProps = { ...mockReduxProps, ...instanceDomainDetailEntityProps, theme };
    });

    test('renders without crashing', () => {
        shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
    });

    test('displays bookmark button when instance domain is not bookmarked', () => {
        // default props does not contain metric that is bookmarked in items mock
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(wrapper.exists('[data-test="bookmark-button"]')).toBe(true);
    });

    test('displays unbookmark button when instance domain is bookmarked', () => {
        // this metric is not in bookmarked items mock
        (instanceDomainDetailProps.indom.data as IndomEntity).indom.name = '60.2';
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(wrapper.exists('[data-test="unbookmark-button"]')).toBe(true);
    });

    test('can trigger bookmark', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const bookmarkButton = wrapper.find('[data-test="bookmark-button"]');
        bookmarkButton.simulate('click');
        const indom = (instanceDomainDetailProps.indom.data as IndomEntity).indom;
        const bookmarkCallback: jest.Mock<
            typeof instanceDomainDetailProps.onBookmark
        > = instanceDomainDetailProps.onBookmark as any;
        expect(bookmarkCallback.mock.calls[0][0]).toEqual({ id: indom.name, type: EntityType.InstanceDomain });
        expect(bookmarkCallback).toHaveBeenCalled();
    });

    test('can trigger unbookmark', () => {
        (instanceDomainDetailProps.indom.data as IndomEntity).indom.name = '60.2';
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const unbookmarkButton = wrapper.find('[data-test="unbookmark-button"]');
        unbookmarkButton.simulate('click');
        const indom = (instanceDomainDetailProps.indom.data as IndomEntity).indom;
        const unbookmarkCallback: jest.Mock<
            typeof instanceDomainDetailProps.onBookmark
        > = instanceDomainDetailProps.onUnbookmark as any;
        expect(unbookmarkCallback.mock.calls[0][0]).toEqual({ id: indom.name, type: EntityType.InstanceDomain });
        expect(unbookmarkCallback).toHaveBeenCalled();
    });

    test('displays title', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const title = wrapper.find('[data-test="title"]');
        expect(title.exists()).toBe(true);
        expect(title.text()).toBe(instanceDomainDetailProps.indom.data?.indom.name);
    });

    test('displays description', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.exists()).toBe(true);
    });

    test('displays instances', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const instances = wrapper.find('[data-test="instances"]');
        expect(instances.exists()).toBe(true);
    });

    test('description priortizes long help text', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.text()).toBe(
            instanceDomainDetailProps.indom.data ? instanceDomainDetailProps.indom.data.indom.helptext : ''
        );
    });

    test('description falls back to oneline help when long help text is not available', () => {
        (instanceDomainDetailProps.indom.data as IndomEntity).indom.helptext = '';
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.text()).toBe(
            instanceDomainDetailProps.indom.data ? instanceDomainDetailProps.indom.data.indom.oneline : ''
        );
    });

    test('renders instances', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const instances = wrapper.find('[data-test="instances"]');
        const instancesProps = instances.props() as InstancesProps;
        expect(instances.exists()).toBe(true);
        expect(instancesProps.instances).toBe(instanceDomainDetailProps.indom.data?.instances);
    });

    test('handles lack of instance domain data gracefully', () => {
        instanceDomainDetailProps.indom.data = null;
        shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
    });

    test('shows loader when instance domain is being loaded', () => {
        instanceDomainDetailProps.indom.status = FetchStatus.PENDING;
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const loader = wrapper.find('[data-test="loader"]');
        const loaderProps: LoaderBasicProps = loader.props() as any;
        expect(loaderProps.loaded).toBe(false);
    });

    test('shows loader when instance domain is loaded', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const loader = wrapper.find('[data-test="loader"]');
        const loaderProps: LoaderBasicProps = loader.props() as any;
        expect(loaderProps.loaded).toBe(true);
    });
});
