import {
    InstanceDomainDetailPage,
    InstanceDomainDetailPageReduxProps,
    InstanceDomainDetailPageBasicProps,
    InstanceDomainDetailPageProps,
} from './InstanceDomain';
import { getTheme } from '@grafana/ui';
import { GrafanaThemeType } from '@grafana/data';
import { shallow } from 'enzyme';
import React from 'react';
import { EntityType } from '../../../models/endpoints/search';
import { FetchStatus } from '../../../store/slices/search/shared/state';
import { IndomEntity } from '../../../models/entities/indom';
import { LoaderBasicProps } from '../../../components/Loader/Loader';

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
        const bookmarkCallback: jest.Mock<typeof instanceDomainDetailProps.onBookmark> = instanceDomainDetailProps.onBookmark as any;
        expect(bookmarkCallback.mock.calls[0][0]).toEqual({ id: indom, type: EntityType.InstanceDomain });
        expect(bookmarkCallback).toHaveBeenCalled();
    });

    test('can trigger unbookmark', () => {
        (instanceDomainDetailProps.indom.data as IndomEntity).indom.name = '60.2';
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const unbookmarkButton = wrapper.find('[data-test="unbookmark-button"]');
        unbookmarkButton.simulate('click');
        const indom = (instanceDomainDetailProps.indom.data as IndomEntity).indom;
        const unbookmarkCallback: jest.Mock<typeof instanceDomainDetailProps.onBookmark> = instanceDomainDetailProps.onUnbookmark as any;
        expect(unbookmarkCallback.mock.calls[0][0]).toEqual({ id: indom, type: EntityType.InstanceDomain });
        expect(unbookmarkCallback).toHaveBeenCalled();
    });

    test('displays title', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const title = wrapper.find('[data-test="title"]');
        expect(title.exists()).toBe(true);
        expect(title.text()).toBe(instanceDomainDetailProps.indom.data?.indom);
    });

    test('displays description', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.exists());
    });

    test('description priortizes long help text', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.text()).toBe(
            instanceDomainDetailProps.indom.data ? instanceDomainDetailProps.indom.data['text-help'] : ''
        );
    });

    test('description falls back to oneline help when long help text is not available', () => {
        (instanceDomainDetailProps.indom.data as IndomEntity)['text-help'] = '';
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = wrapper.find('[data-test="description"]');
        expect(description.text()).toBe(
            instanceDomainDetailProps.indom.data ? instanceDomainDetailProps.indom.data['text-oneline'] : ''
        );
    });

    test('displays list of all instance names + values', () => {
        const wrapper = shallow(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        (instanceDomainDetailProps.indom.data as IndomEntity).instances.forEach(instance => {
            const instanceRecord = wrapper.find(`[data-test="${instance.name}-record"]`);
            expect(instanceRecord.exists()).toBe(true);
            expect(instanceRecord.find('[data-test="instance-name"]').text()).toBe(instance.name);
        });
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
