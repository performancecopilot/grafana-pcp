import { PanelPlugin } from '@grafana/data';
import BreadcrumbsPanel from './BreadcrumbsPanel';
import { Options } from './types';

export const plugin = new PanelPlugin<Options>(BreadcrumbsPanel);
