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
    label: string;
    operator: ThresholdsOperator;
    value: number;
}

export interface MetaOptions {
    name: string;
    description: string;
    metrics: string[];
    derived: string[];
    urls: string[];
    issues: string[];
    details?: string;
    // dashboard Ids
    children: string[];
}

export interface Options {
    graph: GraphOptions;
    legend: LegendOptions;
    threshold?: ThresholdOptions;
    meta: MetaOptions;
}

export enum ThresholdsOperator {
    Lesser = '<',
    LesserThanOrEqual = '<=',
    Equal = '=',
    GreaterThanOrEqual = '>=',
    GreaterThan = '>',
}
