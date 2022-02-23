import { shallow } from 'enzyme';
import React from 'react';
import { GrafanaThemeType } from '@grafana/data';
import { getTheme } from '@grafana/ui';
import { Card } from './Card';

describe('<Card/>', () => {
    const theme = getTheme(GrafanaThemeType.Light);

    test('renders without crashing', () => {
        shallow(
            <Card theme={theme}>
                <p>Test</p>
            </Card>
        );
    });

    test('should have default background "strong"', () => {
        const card = shallow(
            <Card theme={theme}>
                <p>Default &quot;strong&quot;</p>
            </Card>
        );
        expect(card.render().prop('data-test')).toBe('strong');
    });

    test('accepts both "strong" and "weak" background types', () => {
        shallow(
            <Card theme={theme} background="strong">
                <p>Strong Bg</p>
            </Card>
        );

        shallow(
            <Card theme={theme} background="weak">
                <p>Weak Bg</p>
            </Card>
        );
    });

    test('renders passed children', () => {
        const child = <div data-test="child">Test</div>;
        const card = shallow(
            <Card theme={theme} background="strong">
                {child}
            </Card>
        );
        expect(card.find('[data-test="child"]').length).toBe(1);
    });
});
