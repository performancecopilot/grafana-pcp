import { GraphTooltipOptions, VizLegendOptions } from '@grafana/ui';

export enum PredicateOperator {
    LesserThan = '<',
    GreaterThan = '>',
}

export interface Predicate {
    metric: string;
    operator: PredicateOperator;
    value: number;
}

export interface Metric {
    name: string;
    helptext: string;
}

export interface DerivedMetric {
    name: string;
    expr: string;
}

export interface LinkItem {
    title: string;
    name: string;
    uid: string;
    active?: boolean;
}

export interface TroubleshootingInfo {
    name: string;
    /** one line explanation of the issue */
    warning?: string;
    /** a paragraph describing the cause and resolution */
    description?: string;
    /** list of involved metrics */
    metrics: Metric[];
    /** list of derived metrics */
    derivedMetrics?: DerivedMetric[];
    /** test to determine if problem */
    predicate?: Predicate;
    /** list of extern URLs (for example kbase articles) for addressing the issue */
    urls?: string[];
    /** notes describing any problems with the node (for example why predicate is broken) */
    notes?: string;

    parents?: LinkItem[];
    children?: LinkItem[];
}

export interface Options {
    troubleshooting: TroubleshootingInfo;
    legend: VizLegendOptions;
    tooltipOptions: GraphTooltipOptions;
}
