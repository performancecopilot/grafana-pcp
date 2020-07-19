import { Loader } from './Loader';
import React from 'react';
import { shallow, render } from 'enzyme';
import { GrafanaThemeType } from '@grafana/data';
import { getTheme } from '@grafana/ui';

describe('<Loader/>', () => {
    const theme = getTheme(GrafanaThemeType.Light);

    test('renders without crashing', () => {
        shallow(<Loader loaded={false} theme={theme} />);
    });

    test('renders loading indicator and children when loaded = false', () => {
        const component = render(<Loader loaded={false} theme={theme} />);
        expect(component.find('[data-test="spinner-container"]').length).toBe(1);
        expect(component.find('[data-test="content-container"]').length).toBe(1);
    });

    test('renders children only when loaded = true', () => {
        const childNode = 'Cheerio';
        const component = render(
            <Loader loaded={true} theme={theme}>
                {childNode}
            </Loader>
        );
        expect(component.html()).toBe(childNode);
    });
});
