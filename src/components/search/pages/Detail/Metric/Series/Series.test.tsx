import { shallow } from 'enzyme';
import React from 'react';
import { LabelsProps } from '../Labels/Labels';
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
        shallow(<Series {...seriesProps} />);
    });

    test('renders series name', () => {
        const wrapper = shallow(<Series {...seriesProps} />);
        expect(wrapper.exists('[data-test="series-name"]')).toBe(true);
    });

    test('render tab switcher', () => {
        const wrapper = shallow(<Series {...seriesProps} />);
        expect(wrapper.exists('[data-test="tab-switcher"]')).toBe(true);
    });

    test('reacts to tab change', () => {
        const wrapper = shallow(<Series {...{ ...seriesProps, initTab: SeriesTabOpt.Meta }} />);
        expect(wrapper.exists('[data-test="meta"]')).toBe(true);
        wrapper.setState({ selectedOption: SeriesTabOpt.Labels });
        expect(wrapper.exists('[data-test="labels"]')).toBe(true);
    });

    test('can render metric labels', () => {
        const wrapper = shallow(<Series {...{ ...seriesProps, initTab: SeriesTabOpt.Labels }} />);
        const labels = wrapper.find('[data-test="labels"]');
        const labelsProps: LabelsProps = labels.props() as any;
        expect(labelsProps.labels).toEqual(seriesProps.series.labels);
    });

    test('fails gracefuly when no labels are present', () => {
        const wrapper = shallow(
            <Series
                {...{
                    openDetail: jest.fn(),
                    series: { series: seriesProps.series.series, meta: seriesProps.series.meta },
                    initTab: SeriesTabOpt.Meta,
                }}
            />
        );
        expect(wrapper.exists('[data-test="labels"]')).toBe(false);
    });

    test('can render metric meta', () => {
        const wrapper = shallow(<Series {...{ ...seriesProps, initTab: SeriesTabOpt.Meta }} />);
        expect(wrapper.exists('[data-test="meta"]')).toBe(true);
    });

    test('renders meta tab by default', () => {
        const wrapper = shallow(<Series {...seriesProps} />);
        expect(wrapper.exists('[data-test="meta"]')).toBe(true);
    });
});
