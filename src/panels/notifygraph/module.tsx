import { PanelPlugin, NullValueMode } from '@grafana/data';
import NotifyGraphPanel from './NotifyGraphPanel';
import { LegendDisplayMode } from '@grafana/ui';
import { Options } from './types';

const nOpts = n => Array.from(Array(n).keys());
const numsToPanelOpts = t => ({ value: t, label: t.toString() });

export const plugin = new PanelPlugin<Options>(NotifyGraphPanel).setPanelOptions(builder => {
    builder
        .addBooleanSwitch({
            path: 'graph.showBars',
            name: 'Bars',
            description: '',
            defaultValue: false,
        })
        .addBooleanSwitch({
            path: 'graph.showLines',
            name: 'Lines',
            description: '',
            defaultValue: true,
        })
        .addSelect({
            path: 'graph.lineWidth',
            name: 'Line Width',
            description: '',
            settings: {
                options: nOpts(10).map(numsToPanelOpts),
            },
            defaultValue: 1,
        })
        .addBooleanSwitch({
            path: 'graph.showPoints',
            name: 'Poins',
            description: '',
            defaultValue: false,
        })
        .addBooleanSwitch({
            path: 'graph.isStacked',
            name: 'Stack',
            description: '',
            defaultValue: false,
        })
        .addSelect({
            path: 'graph.nullValue',
            name: 'Null value',
            description: '',
            settings: {
                options: Object.entries(NullValueMode).map(([label, value]) => ({
                    value: value as NullValueMode,
                    label,
                })),
            },
            defaultValue: NullValueMode.Null,
        })
        .addBooleanSwitch({
            path: 'legend.isLegendVisible',
            name: 'Show legend',
            description: '',
            defaultValue: true,
        })
        .addSelect({
            path: 'legend.displayMode',
            name: 'Legend mode',
            description: '',
            settings: {
                options: Object.entries(LegendDisplayMode).map(([label, value]) => ({
                    value: value as LegendDisplayMode,
                    label,
                })),
            },
            defaultValue: LegendDisplayMode.List,
        })
        .addSelect({
            path: 'legend.placement',
            name: 'Legend placement',
            description: '',
            settings: {
                options: [
                    { value: 'under', label: 'under' },
                    { value: 'right', label: 'right' },
                    { value: 'over', label: 'over' },
                ],
            },
            defaultValue: 'under',
        });
});
