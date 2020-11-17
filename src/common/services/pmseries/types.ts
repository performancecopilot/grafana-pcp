import { DataSourceInstanceSettings } from '@grafana/data';
import { InstanceName, Labels, Semantics } from 'common/types/pcp';

export interface PmSeriesApiConfig {
    dsInstanceSettings: DataSourceInstanceSettings;
    timeoutMs: number;
    baseUrl: string;
}

export type SeriesId = string;
export type SeriesInstanceId = string;

export interface SeriesNoRecordResponse {
    success: boolean;
}

export interface SeriesDescQueryParams {
    series: string[]; // list of series identifiers
}
export interface SeriesDescItemResponse {
    series: string;
    source: string;
    pmid: string;
    indom: string;
    semantics: Semantics;
    type: string;
    units: string;
}
export type SeriesDescResponse = SeriesDescItemResponse[];

// this one has no related 'maybe' response type
export interface SeriesPingResponse {
    success: boolean;
}

export interface SeriesQueryQueryParams {
    expr: string; // Query string in [pmseries](https://pcp.io/man/man1/pmseries.1.html) format
}
export interface SeriesQueryItemResponse {
    series: string;
    instance: string;
    timestamp: number;
    value: string;
}
export type SeriesQueryResponse = string[] | SeriesQueryItemResponse[];

export interface SeriesInstancesQueryParams {
    /** Comma-separated list of series identifiers */
    series?: string[];
    /** Glob pattern string to match on all labels */
    match?: string;
}
export interface SeriesInstancesItemResponse {
    series: SeriesId;
    source: string;
    instance: SeriesInstanceId;
    id: number;
    name: InstanceName;
}
export type SeriesInstancesResponse = SeriesInstancesItemResponse[];

export interface SeriesLabelsQueryParams {
    series?: string[]; // Comma-separated list of series identifiers
    match?: string; // Glob pattern string to match on all labels
    name?: string; // Find all known label values for given name
    names?: string[]; // Comma-separated list of label names
}
export interface SeriesLabelsItemResponse {
    series: string;
    labels: Labels;
}
export interface SeriesLabelsLabelValuesItemResponse {
    [key: string]: Array<string | number | boolean>;
}
export type SeriesLabelsResponse = string[] | SeriesLabelsItemResponse[] | SeriesLabelsLabelValuesItemResponse;

export interface SeriesMetricsQueryParams {
    series?: string[];
    match?: string;
}
export interface SeriesMetricsItemResponse {
    series: string;
    name: string;
}
export type SeriesMetricsResponse = string[] | SeriesMetricsItemResponse[];

export interface SeriesValuesQueryParams {
    series?: string[];
    samples?: number;
    interval?: string;
    start?: string;
    finish?: string;
    offset?: string;
    align?: string;
    zone?: string;
}
export interface SeriesValuesItemResponse {
    series: string;
    instance?: string;
    /** unix timestamp in milliseconds */
    timestamp: number;
    value: string;
}
export type SeriesValuesResponse = SeriesValuesItemResponse[];
