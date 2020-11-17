import { shallow } from 'enzyme';
import React from 'react';
import { Instances, InstancesProps } from './Instances';

describe('Instance Domain <Instances/>', () => {
    let instancesProps: InstancesProps;

    beforeEach(() => {
        instancesProps = {
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
        };
    });

    test('renders without crashing', () => {
        shallow(<Instances {...instancesProps} />);
    });

    test('displays all instances provided', () => {
        const wrapper = shallow(<Instances {...instancesProps} />);
        instancesProps.instances.forEach(instance => {
            expect(wrapper.exists(`[data-test="instance-${instance.name}"]`)).toBe(true);
        });
    });

    test('handles no instances case', () => {
        shallow(<Instances instances={[]} />);
    });
});
