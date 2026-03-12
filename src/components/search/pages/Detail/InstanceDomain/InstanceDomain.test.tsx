import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from '@grafana/data';
import { EntityType } from '../../../../../common/services/pmsearch/types';
import { IndomEntity } from '../../../models/entities/indom';
import { FetchStatus } from '../../../store/slices/search/shared/state';
import {
    InstanceDomainDetailPage,
    InstanceDomainDetailPageBasicProps,
    InstanceDomainDetailPageProps,
    InstanceDomainDetailPageReduxProps,
} from './InstanceDomain';

describe('Detail Page <InstanceDomainPage/>', () => {
    let mockReduxProps: InstanceDomainDetailPageReduxProps;
    let instanceDomainDetailEntityProps: InstanceDomainDetailPageBasicProps;
    let instanceDomainDetailProps: InstanceDomainDetailPageProps;

    const theme = createTheme();

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
        instanceDomainDetailProps = { ...mockReduxProps, ...instanceDomainDetailEntityProps, theme };
    });

    test('renders without crashing', () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
    });

    test('displays bookmark button when instance domain is not bookmarked', () => {
        // default props does not contain metric that is bookmarked in items mock
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
    });

    test('displays unbookmark button when instance domain is bookmarked', () => {
        (instanceDomainDetailProps.indom.data as IndomEntity).indom.name = '60.2';
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(screen.getByTestId('unbookmark-button')).toBeInTheDocument();
    });

    test('can trigger bookmark', async () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        await userEvent.click(screen.getByTestId('bookmark-button'));
        const indom = (instanceDomainDetailProps.indom.data as IndomEntity).indom;
        const bookmarkCallback = instanceDomainDetailProps.onBookmark as jest.Mock;
        expect(bookmarkCallback.mock.calls[0][0]).toEqual({ id: indom.name, type: EntityType.InstanceDomain });
        expect(bookmarkCallback).toHaveBeenCalled();
    });

    test('can trigger unbookmark', async () => {
        (instanceDomainDetailProps.indom.data as IndomEntity).indom.name = '60.2';
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        await userEvent.click(screen.getByTestId('unbookmark-button'));
        const indom = (instanceDomainDetailProps.indom.data as IndomEntity).indom;
        const unbookmarkCallback = instanceDomainDetailProps.onUnbookmark as jest.Mock;
        expect(unbookmarkCallback.mock.calls[0][0]).toEqual({ id: indom.name, type: EntityType.InstanceDomain });
        expect(unbookmarkCallback).toHaveBeenCalled();
    });

    test('displays title', () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const title = screen.getByTestId('title');
        expect(title).toBeInTheDocument();
        expect(title.textContent).toBe(instanceDomainDetailProps.indom.data?.indom.name);
    });

    test('displays description', () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(screen.getByTestId('description')).toBeInTheDocument();
    });

    test('displays instances', () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(screen.getByTestId('instances')).toBeInTheDocument();
    });

    test('description prioritizes long help text', () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = screen.getByTestId('description');
        expect(description.textContent).toBe(instanceDomainDetailProps.indom.data?.indom.helptext);
    });

    test('description falls back to oneline help when long help text is not available', () => {
        (instanceDomainDetailProps.indom.data as IndomEntity).indom.helptext = '';
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const description = screen.getByTestId('description');
        expect(description.textContent).toBe(instanceDomainDetailProps.indom.data?.indom.oneline);
    });

    test('renders instances', () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        const instances = instanceDomainDetailProps.indom.data?.instances ?? [];
        instances.forEach(instance => {
            expect(screen.getByTestId(`instance-${instance.name}`)).toBeInTheDocument();
        });
    });

    test('handles lack of instance domain data gracefully', () => {
        instanceDomainDetailProps.indom.data = null;
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
    });

    test('shows loader when instance domain is being loaded', () => {
        instanceDomainDetailProps.indom.status = FetchStatus.PENDING;
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
    });

    test('shows loader when instance domain is loaded', () => {
        render(<InstanceDomainDetailPage {...instanceDomainDetailProps} />);
        expect(screen.queryByTestId('spinner-container')).not.toBeInTheDocument();
    });
});
