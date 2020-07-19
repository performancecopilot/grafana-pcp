export interface MetricEntityMeta {
    indom: string;
    pmid: string;
    semantics: string;
    type: string;
    units: string;
    source: string;
}

export interface MetricEntityLabels {
    [key: string]: string | number | boolean;
}

export interface MetricEntitySeries {
    series: string;
    meta: MetricEntityMeta;
    labels?: MetricEntityLabels;
}

export type MetricSiblingsEntity = string[];

export interface MetricEntity {
    name: string;
    // These are monkey patched for now
    oneline?: string;
    help?: string;
    series: MetricEntitySeries[];
}
