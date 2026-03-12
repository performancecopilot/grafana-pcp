import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme } from '@grafana/data';
import { Loader } from './Loader';

describe('<Loader/>', () => {
    const theme = createTheme();

    test('renders without crashing', () => {
        render(<Loader loaded={false} theme={theme} />);
    });

    test('renders loading indicator and children when loaded = false', () => {
        render(<Loader loaded={false} theme={theme} />);
        expect(screen.getByTestId('spinner-container')).toBeInTheDocument();
        expect(screen.getByTestId('content-container')).toBeInTheDocument();
    });

    test('renders children only when loaded = true', () => {
        const childNode = 'Cheerio';
        const { container } = render(
            <Loader loaded={true} theme={theme}>
                {childNode}
            </Loader>
        );
        expect(container.textContent).toBe(childNode);
        expect(screen.queryByTestId('spinner-container')).not.toBeInTheDocument();
    });
});
