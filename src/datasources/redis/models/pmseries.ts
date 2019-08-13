export const PM_INDOM_NULL = "none";

export interface Description {
    series: string;
    semantics: string;
    indom: string;
}

export interface Instance {
    series: string;
    id: number;
    instance: string;
    name: string;
}

export interface MetricValue {
    series: string;
    timestamp: number;
    instance?: string;
    value: string;
}
