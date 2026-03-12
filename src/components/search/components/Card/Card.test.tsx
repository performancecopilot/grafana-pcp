import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme } from '@grafana/data';
import { Card } from './Card';

describe('<Card/>', () => {
    const theme = createTheme();

    test('renders without crashing', () => {
        render(
            <Card theme={theme}>
                <p>Test</p>
            </Card>
        );
    });

    test('should have default background "strong"', () => {
        render(
            <Card theme={theme}>
                <p>Default &quot;strong&quot;</p>
            </Card>
        );
        expect(screen.getByTestId('strong')).toBeInTheDocument();
    });

    test('accepts both "strong" and "weak" background types', () => {
        const { unmount } = render(
            <Card theme={theme} background="strong">
                <p>Strong Bg</p>
            </Card>
        );
        expect(screen.getByTestId('strong')).toBeInTheDocument();
        unmount();

        render(
            <Card theme={theme} background="weak">
                <p>Weak Bg</p>
            </Card>
        );
        expect(screen.getByTestId('weak')).toBeInTheDocument();
    });

    test('renders passed children', () => {
        const child = <div data-test="child">Test</div>;
        render(
            <Card theme={theme} background="strong">
                {child}
            </Card>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
});
