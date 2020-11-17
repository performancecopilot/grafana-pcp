import { shallow } from 'enzyme';
import React from 'react';
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
        shallow(<Labels {...labelsProps} />);
    });

    test('displays arbitrary labels', () => {
        const wrapper = shallow(<Labels {...labelsProps} />);
        Object.entries(labelsProps.labels).forEach(([key, value]) => {
            expect(wrapper.exists(`[data-test="${key}"]`)).toBe(true);
            expect(wrapper.find(`[data-test="${key}-value"]`).text()).toBe(value.toString());
        });
    });
});
