import { Options } from './types';
import { PanelPlugin } from '@grafana/data';
import BreadcrumbsPanel from './BreadcrumbsPanel';

export const plugin = new PanelPlugin<Options>(BreadcrumbsPanel);
