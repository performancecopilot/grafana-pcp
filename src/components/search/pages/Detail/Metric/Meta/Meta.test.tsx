import { shallow } from 'enzyme';
import React from 'react';
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
        shallow(<Meta {...metaProps} />);
    });

    test('displays pmid', () => {
        const wrapper = shallow(<Meta {...metaProps} />);
        expect(wrapper.exists('[data-test="pmid"]')).toBe(true);
    });

    test('displays type', () => {
        const wrapper = shallow(<Meta {...metaProps} />);
        expect(wrapper.exists('[data-test="type"]')).toBe(true);
    });

    test('displays semantics', () => {
        const wrapper = shallow(<Meta {...metaProps} />);
        expect(wrapper.exists('[data-test="semantics"]')).toBe(true);
    });

    test('displays units', () => {
        const wrapper = shallow(<Meta {...metaProps} />);
        expect(wrapper.exists('[data-test="units"]')).toBe(true);
    });

    test('displays indom', () => {
        const wrapper = shallow(<Meta {...metaProps} />);
        expect(wrapper.exists('[data-test="indom"]')).toBe(true);
    });

    test('displays source', () => {
        const wrapper = shallow(<Meta {...metaProps} />);
        expect(wrapper.exists('[data-test="source"]')).toBe(true);
    });
});
