import React from 'react';
import { render, screen } from '@testing-library/react';
import { Instances, InstancesProps } from './Instances';

describe('Instance Domain <Instances/>', () => {
    let instancesProps: InstancesProps;

    beforeEach(() => {
        instancesProps = {
            instances: [
                { name: 'virbr0-nic' },
                { name: 'virbr0' },
                { name: 'wlp0s20f3' },
                { name: 'ens20u2' },
                { name: 'lo' },
                { name: 'veth2d4d8bb' },
                { name: 'docker0' },
            ],
        };
    });

    test('renders without crashing', () => {
        render(<Instances {...instancesProps} />);
    });

    test('displays all instances provided', () => {
        render(<Instances {...instancesProps} />);
        instancesProps.instances.forEach(instance => {
            expect(screen.getByTestId(`instance-${instance.name}`)).toBeInTheDocument();
        });
    });

    test('handles no instances case', () => {
        render(<Instances instances={[]} />);
    });
});
