import { FieldConfigSource, FieldType, LoadingState, MISSING_VALUE, MutableDataFrame, PanelData } from '@grafana/data';
import { mount } from 'enzyme';
import React from 'react';
import { grafana } from '../../datasources/lib/specs/fixtures';
import { FlameGraphPanel } from './FlameGraphPanel';
import { defaults } from './types';

// this test inports d3-flame-graph, which needs ES6 modules
// node.js doesn't support ES6 modules, but we can transpile them using @babel/plugin-transform-modules-commonjs
// however, the @grafana/toolkit build command doesn't set NODE_ENV=test, so the plugin doesn't get activated :|
// when jest is invoked directly it works (because jest sets NODE_ENV=test)
describe('FlameGraphPanel', () => {
    it('should render a loading screen', () => {
        const panel = mountPanel({
            state: LoadingState.Done,
            series: [],
            timeRange: grafana.timeRange(),
        });
        expect(panel.html()).toMatchSnapshot();
    });

    it('should render a flame graph', () => {
        const panel = mountPanel({
            state: LoadingState.Done,
            series: [
                new MutableDataFrame({
                    name: '',
                    fields: [
                        { name: 'Time', type: FieldType.time, values: [1, 2, 3] },
                        {
                            name: '\n    write+24\n    0x3266377830202020\n',
                            config: { custom: { instance: { name: '\n    write+24\n    0x3266377830202020\n' } } },
                            values: [MISSING_VALUE, 2],
                        },
                        {
                            name: '\n    write+24\n    0x3266377830202020\n    0x123',
                            config: {
                                custom: { instance: { name: '\n    write+24\n    0x3266377830202020\n    0x123' } },
                            },
                            values: [3],
                        },
                        {
                            name: '\n    writev+24\n    0x400007ffd\n',
                            config: { custom: { instance: { name: '\n    writev+24\n    0x400007ffd\n' } } },
                            values: [MISSING_VALUE, MISSING_VALUE, 4],
                        },
                        {
                            name: '\n    zmalloc_get_rss+20\n',
                            config: { custom: { instance: { name: '\n    zmalloc_get_rss+20\n' } } },
                            values: [6],
                        },
                    ],
                }),
            ],
            timeRange: grafana.timeRange(),
        });
        expect(
            panel
                .render()
                .find('title')
                .map((_, elem) => elem.firstChild.data)
                .toArray()
        ).toMatchInlineSnapshot(`
            Array [
              "root (100.000%, 15 samples)",
              "write+24 (33.333%, 5 samples)",
              "writev+24 (26.667%, 4 samples)",
              "zmalloc_get_rss+20 (40.000%, 6 samples)",
              "0x3266377830202020 (33.333%, 5 samples)",
              "0x400007ffd (26.667%, 4 samples)",
              "0x123 (20.000%, 3 samples)",
            ]
        `);
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
