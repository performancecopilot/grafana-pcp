import React from 'react';
import { mount } from 'enzyme';
import { FlameGraphPanel } from './FlameGraphPanel';
import { FieldConfigSource, LoadingState, PanelData } from '@grafana/data';
import { grafana } from 'datasources/lib/specs/fixtures';
import { defaults } from './types';

describe('FlameGraphPanel', () => {
    it('should render a loading screen', () => {
        const panel = mountPanel({
            state: LoadingState.Done,
            series: [],
            timeRange: grafana.timeRange(),
        });
        expect(panel.html()).toMatchSnapshot();
    });
});

function mountPanel(data: PanelData) {
    const fieldConfig: FieldConfigSource = {
        defaults: {},
        overrides: [],
    };

    const options = defaults;

    return mount(
        <FlameGraphPanel
            id={1}
            data={data}
            timeRange={data.timeRange}
            timeZone={'utc'}
            options={options}
            onOptionsChange={() => {}}
            fieldConfig={fieldConfig}
            onFieldConfigChange={() => {}}
            transparent={false}
            width={800}
            height={600}
            replaceVariables={v => v}
            onChangeTimeRange={() => {}}
            renderCounter={1}
            title="Panel"
        />
    );
}
