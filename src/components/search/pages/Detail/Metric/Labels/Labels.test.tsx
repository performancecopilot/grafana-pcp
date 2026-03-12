import React from 'react';
import { render, screen } from '@testing-library/react';
import { Labels, LabelsProps } from './Labels';

describe('Metric <Labels/>', () => {
    let labelsProps: LabelsProps;

    beforeEach(() => {
        labelsProps = {
            labels: {
                test0: 'string1',
                test1: '',
                test2: 1337,
                test3: 3.14,
                test4: true,
                test5: false,
            },
        };
    });

    test('renders without crashing', () => {
        render(<Labels {...labelsProps} />);
    });

    test('displays arbitrary labels', () => {
        render(<Labels {...labelsProps} />);
        Object.entries(labelsProps.labels).forEach(([key, value]) => {
            expect(screen.getByTestId(key)).toBeInTheDocument();
            expect(screen.getByTestId(`${key}-value`).textContent).toBe(value.toString());
        });
    });
});
