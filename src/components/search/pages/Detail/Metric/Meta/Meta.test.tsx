import React from 'react';
import { render, screen } from '@testing-library/react';
import { Meta, MetaProps } from './Meta';

describe('Metric <Meta/>', () => {
    let metaProps: MetaProps;

    beforeEach(() => {
        metaProps = {
            onIndomClick: jest.fn(),
            meta: {
                pmid: 'pmid',
                type: 'type',
                semantics: 'semantics',
                units: 'units',
                indom: 'indom',
                source: 'source',
            },
        };
    });

    test('renders without crashing', () => {
        render(<Meta {...metaProps} />);
    });

    test('displays pmid', () => {
        render(<Meta {...metaProps} />);
        expect(screen.getByTestId('pmid')).toBeInTheDocument();
    });

    test('displays type', () => {
        render(<Meta {...metaProps} />);
        expect(screen.getByTestId('type')).toBeInTheDocument();
    });

    test('displays semantics', () => {
        render(<Meta {...metaProps} />);
        expect(screen.getByTestId('semantics')).toBeInTheDocument();
    });

    test('displays units', () => {
        render(<Meta {...metaProps} />);
        expect(screen.getByTestId('units')).toBeInTheDocument();
    });

    test('displays indom', () => {
        render(<Meta {...metaProps} />);
        expect(screen.getByTestId('indom')).toBeInTheDocument();
    });

    test('displays source', () => {
        render(<Meta {...metaProps} />);
        expect(screen.getByTestId('source')).toBeInTheDocument();
    });
});
