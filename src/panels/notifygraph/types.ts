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
    name: string;
    description: string;
    label: string;
    operator: ThresholdsOperator;
    value: number | undefined;
    urls: string[];
    details: string;
    issues: string[];
}

export interface Options {
    graph: GraphOptions;
    legend: LegendOptions;
    threshold?: ThresholdOptions;
}

export enum ThresholdsOperator {
    Lesser = '<',
    LesserThanOrEqual = '<=',
    Equal = '=',
    GreaterThanOrEqual = '>=',
    GreaterThan = '>',
}
