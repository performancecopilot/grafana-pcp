import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Series, SeriesProps, SeriesTabOpt } from './Series';

describe('Metric <Series/>', () => {
    let seriesProps: SeriesProps;

    beforeEach(() => {
        seriesProps = {
            openDetail: jest.fn(),
            series: {
                series: 'series1',
                meta: {
                    indom: 'indom',
                    pmid: 'pmid',
                    semantics: 'sematics',
                    type: 'type',
                    units: 'units',
                    source: 'source',
                },
                labels: {
                    label1: 'label 1',
                    label2: 'label 2',
                },
            },
        };
    });

    test('renders without crashing', () => {
        render(<Series {...seriesProps} />);
    });

    test('renders series name', () => {
        render(<Series {...seriesProps} />);
        expect(screen.getByTestId('series-name')).toBeInTheDocument();
    });

    test('render tab switcher', () => {
        render(<Series {...seriesProps} />);
        // RadioButtonGroup renders radio inputs; check for the options by label text
        expect(screen.getByLabelText('Metadata')).toBeInTheDocument();
        expect(screen.getByLabelText('Labels')).toBeInTheDocument();
    });

    test('reacts to tab change', async () => {
        render(<Series {...{ ...seriesProps, initTab: SeriesTabOpt.Meta }} />);
        // Meta tab is shown by default
        expect(screen.getByTestId('pmid')).toBeInTheDocument();
        // Switch to Labels tab
        await userEvent.click(screen.getByLabelText('Labels'));
        // Labels tab content is now shown
        expect(screen.getByTestId('label1')).toBeInTheDocument();
    });

    test('can render metric labels', () => {
        render(<Series {...{ ...seriesProps, initTab: SeriesTabOpt.Labels }} />);
        // Labels renders each key as a data-test attribute
        expect(screen.getByTestId('label1')).toBeInTheDocument();
        expect(screen.getByTestId('label2')).toBeInTheDocument();
        expect(screen.getByTestId('label1-value').textContent).toBe(seriesProps.series.labels!['label1'].toString());
        expect(screen.getByTestId('label2-value').textContent).toBe(seriesProps.series.labels!['label2'].toString());
    });

    test('fails gracefully when no labels are present', async () => {
        render(
            <Series
                {...{
                    openDetail: jest.fn(),
                    series: { series: seriesProps.series.series, meta: seriesProps.series.meta },
                    initTab: SeriesTabOpt.Meta,
                }}
            />
        );
        // Switch to Labels tab
        await userEvent.click(screen.getByLabelText('Labels'));
        // No labels available message is shown
        expect(screen.getByText('No labels available.')).toBeInTheDocument();
    });

    test('can render metric meta', () => {
        render(<Series {...{ ...seriesProps, initTab: SeriesTabOpt.Meta }} />);
        // Meta renders pmid, type, semantics, etc. as data-test attributes
        expect(screen.getByTestId('pmid')).toBeInTheDocument();
    });

    test('renders meta tab by default', () => {
        render(<Series {...seriesProps} />);
        expect(screen.getByTestId('pmid')).toBeInTheDocument();
    });
});
