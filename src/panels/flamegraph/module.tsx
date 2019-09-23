import { PanelPlugin } from '@grafana/ui';
import { FlameGraphPanel } from './FlameGraphPanel';
import { FlameGraphPanelEditor } from './FlameGraphPanelEditor';
import { defaults, Options } from './types';

export const plugin = new PanelPlugin<Options>(FlameGraphPanel).setDefaults(defaults).setEditor(FlameGraphPanelEditor);
