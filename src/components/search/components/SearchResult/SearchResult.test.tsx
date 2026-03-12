import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTheme } from '@grafana/data';
import { EntityType, TextItemResponse } from '../../../../common/services/pmsearch/types';
import { SearchResult } from './SearchResult';

describe('<SearchResult/>', () => {
    const openDetailMock = jest.fn<void, TextItemResponse[]>(() => void 0);
    const theme = createTheme();
    // will test most cases with each metric type
    const metricItem: TextItemResponse = {
        name: 'statsd.settings.dropped',
        indom: '20.0',
        helptext:
            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi nam temporibus excepturi corporis atque, quibusdam, suscipit repellat ipsam officiis consectetur, accusamus eaque esse.',
        oneline: 'Lorem, ipsum dolor sit amet.',
        type: EntityType.Metric,
    };
    const instanceItem: TextItemResponse = {
        name: 'cpu0',
        indom: '10.0',
        helptext:
            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse sit, atque distinctio voluptatum sed maiores iusto quisquam.',
        oneline: 'Lorem, ipsum dolor.',
        type: EntityType.Instance,
    };
    const indomItem: TextItemResponse = {
        name: '23.2',
        indom: '23.2',
        helptext: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut, cupiditate.',
        oneline: 'Lorem, ipsum.',
        type: EntityType.InstanceDomain,
    };

    beforeEach(() => {
        openDetailMock.mockClear();
    });

    test('renders without crashing', () => {
        const { unmount: u1 } = render(
            <SearchResult item={metricItem} openDetail={openDetailMock} theme={theme} />
        );
        u1();
        const { unmount: u2 } = render(
            <SearchResult item={instanceItem} openDetail={openDetailMock} theme={theme} />
        );
        u2();
        render(<SearchResult item={indomItem} openDetail={openDetailMock} theme={theme} />);
    });

    test('renders description', () => {
        const { unmount: u1 } = render(
            <SearchResult item={{ ...metricItem, helptext: '' }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').textContent!.length).toBeGreaterThan(0);
        u1();

        const { unmount: u2 } = render(
            <SearchResult item={{ ...metricItem, oneline: '' }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').textContent!.length).toBeGreaterThan(0);
        u2();

        const { unmount: u3 } = render(
            <SearchResult item={{ ...instanceItem, helptext: '' }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').textContent!.length).toBeGreaterThan(0);
        u3();

        const { unmount: u4 } = render(
            <SearchResult item={{ ...instanceItem, oneline: '' }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').textContent!.length).toBeGreaterThan(0);
        u4();

        const { unmount: u5 } = render(
            <SearchResult item={{ ...indomItem, helptext: '' }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').textContent!.length).toBeGreaterThan(0);
        u5();

        render(<SearchResult item={{ ...indomItem, oneline: '' }} openDetail={openDetailMock} theme={theme} />);
        expect(screen.getByTestId('description').textContent!.length).toBeGreaterThan(0);
    });

    test('renders oneline by default', () => {
        const { unmount: u1 } = render(
            <SearchResult item={metricItem} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').textContent).toBe(metricItem.oneline);
        u1();

        const { unmount: u2 } = render(
            <SearchResult item={instanceItem} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').textContent).toBe(instanceItem.oneline);
        u2();

        render(<SearchResult item={indomItem} openDetail={openDetailMock} theme={theme} />);
        expect(screen.getByTestId('description').textContent).toBe(indomItem.oneline);
    });

    test('renders read more button', () => {
        const { unmount: u1 } = render(
            <SearchResult item={metricItem} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('read-more')).toBeInTheDocument();
        u1();

        const { unmount: u2 } = render(
            <SearchResult item={instanceItem} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('read-more')).toBeInTheDocument();
        u2();

        render(<SearchResult item={indomItem} openDetail={openDetailMock} theme={theme} />);
        expect(screen.getByTestId('read-more')).toBeInTheDocument();
    });

    test('can call openDetail', async () => {
        const { unmount: u1 } = render(
            <SearchResult item={metricItem} openDetail={openDetailMock} theme={theme} />
        );
        await userEvent.click(screen.getByTestId('read-more'));
        expect(openDetailMock.mock.calls[0][0]).toBe(metricItem);
        u1();

        const { unmount: u2 } = render(
            <SearchResult item={instanceItem} openDetail={openDetailMock} theme={theme} />
        );
        await userEvent.click(screen.getByTestId('read-more'));
        expect(openDetailMock.mock.calls[1][0]).toBe(instanceItem);
        u2();

        render(<SearchResult item={indomItem} openDetail={openDetailMock} theme={theme} />);
        await userEvent.click(screen.getByTestId('read-more'));
        expect(openDetailMock.mock.calls[2][0]).toBe(indomItem);
        expect(openDetailMock).toHaveBeenCalledTimes(3);
    });

    test('supports HTML inside name', () => {
        const metricName = '<b>statsd</b>.settings.dropped';
        const { unmount: u1 } = render(
            <SearchResult item={{ ...metricItem, name: metricName }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('name').innerHTML).toBe(metricName);
        u1();

        const instanceName = 'cpu1';
        const { unmount: u2 } = render(
            <SearchResult item={{ ...instanceItem, name: instanceName }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('name').innerHTML).toBe(instanceName);
        u2();

        const indomName = '60.1';
        render(<SearchResult item={{ ...indomItem, name: indomName }} openDetail={openDetailMock} theme={theme} />);
        expect(screen.getByTestId('name').innerHTML).toBe(indomName);
    });

    test('supports HTML inside description', () => {
        const oneline = '<b>test</b> highlighting';
        const { unmount: u1 } = render(
            <SearchResult item={{ ...metricItem, oneline }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').querySelector('p')!.innerHTML).toBe(oneline);
        u1();

        const { unmount: u2 } = render(
            <SearchResult item={{ ...instanceItem, oneline }} openDetail={openDetailMock} theme={theme} />
        );
        expect(screen.getByTestId('description').querySelector('p')!.innerHTML).toBe(oneline);
        u2();

        render(<SearchResult item={{ ...indomItem, oneline }} openDetail={openDetailMock} theme={theme} />);
        expect(screen.getByTestId('description').querySelector('p')!.innerHTML).toBe(oneline);
    });
});
