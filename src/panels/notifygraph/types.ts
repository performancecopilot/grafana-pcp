import { NullValueMode } from '@grafana/data';
import { LegendPlacement, LegendDisplayMode } from '@grafana/ui';

export interface GraphOptions {
    showBars: boolean;
    showLines: boolean;
    lineWidth: number;
    showPoints: boolean;
    isStacked: boolean;
    nullValue: NullValueMode;
}

export interface LegendOptions {
    placement: LegendPlacement;
    isLegendVisible: boolean;
    displayMode: LegendDisplayMode;
}

export interface ThresholdOptions {
    metric: string;
    operator: ThresholdsOperator;
    value: number;
}

export interface LinkItem {
    title: string;
    name: string;
    uid: string;
    active?: boolean;
}

export interface MetricItem {
    name: string;
    title?: string;
}

export interface MetaOptions {
    name: string;
    warning: string;
    metrics: MetricItem[];
    derived: string[];
    urls: string[];
    issues: string[];
    details?: string;
    children: LinkItem[];
    parents: LinkItem[];
}

export interface Options {
    graph: GraphOptions;
    legend: LegendOptions;
    threshold?: ThresholdOptions;
    meta: MetaOptions;
    scripted: boolean;
}

export enum ThresholdsOperator {
    LesserThan = '<',
    GreaterThan = '>',
}
