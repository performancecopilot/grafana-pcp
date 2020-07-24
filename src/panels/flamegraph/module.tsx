import { PanelPlugin } from '@grafana/data';
import { FlameGraphPanel } from './FlameGraphPanel';
import { defaults, Options } from './types';

export const plugin = new PanelPlugin<Options>(FlameGraphPanel).setPanelOptions(builder =>
    builder
        .addNumberInput({
            path: 'minSamples',
            name: 'Min samples',
            defaultValue: defaults.minSamples,
        })
        .addBooleanSwitch({
            path: 'hideUnresolvedStackFrames',
            name: 'Hide unresolved',
            defaultValue: defaults.hideUnresolvedStackFrames,
        })
        .addBooleanSwitch({
            path: 'hideIdleStacks',
            name: 'Hide idle stacks',
            defaultValue: defaults.hideIdleStacks,
        })
);
