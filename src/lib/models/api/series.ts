import { Semantics, Labels, InstanceName } from '../pcp/pcp';
import { SeriesId, SeriesInstanceId } from '../pcp/pmseries';
import { PmapiInstanceId } from '../pcp/pmapi';

export interface SeriesNoRecordResponse {
    success: boolean;
}

export interface SeriesDescQueryParams {
    series: string[]; // list of series identifiers
    client?: string; // Request identifier sent back with response
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

export type SeriesDescMaybeResponse = SeriesDescResponse | SeriesNoRecordResponse;

export interface SeriesQueryQueryParams {
    expr: string; // Query string in [pmseries](https://pcp.io/man/man1/pmseries.1.html) format
    client?: string; // Request identifier sent back with response
}

export interface SeriesQueryItemResponse {
    series: string;
    instance: string;
    timestamp: number;
    value: string;
}

export type SeriesQueryResponse = string[] | SeriesQueryItemResponse[];

export type SeriesQueryMaybeResponse = SeriesQueryResponse | SeriesNoRecordResponse;

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
    id: PmapiInstanceId;
    name: InstanceName;
}

export type SeriesInstancesResponse = SeriesInstancesItemResponse[];

export interface SeriesLabelsQueryParams {
    series?: string[]; // Comma-separated list of series identifiers
    match?: string; // Glob pattern string to match on all labels
    name?: string; // Find all known label values for given name
    names?: string[]; // Comma-separated list of label names
    client?: string; // Request identifier sent back with response
}

export interface SeriesLabelsItemResponse {
    series: string;
    labels: Labels;
}

export interface SeriesLabelsLabelValuesItemResponse {
    [key: string]: Array<string | number | boolean>;
}

export type SeriesLabelsResponse = string[] | SeriesLabelsItemResponse[] | SeriesLabelsLabelValuesItemResponse;

export type SeriesLabelsMaybeResponse = SeriesLabelsResponse | SeriesNoRecordResponse;

export interface SeriesMetricsQueryParams {
    series?: string[];
    match?: string;
    client?: string;
}

export interface SeriesMetricsItemResponse {
    series: string;
    name: string;
}

export type SeriesMetricsResponse = string[] | SeriesMetricsItemResponse[];

export type SeriesMetricsMaybeResponse = SeriesMetricsResponse | SeriesNoRecordResponse;

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
    instance: string;
    timestamp: number;
    value: string | number;
}

export type SeriesMaybeResponse =
    | SeriesDescMaybeResponse
    | SeriesQueryMaybeResponse
    | SeriesLabelsMaybeResponse
    | SeriesMetricsMaybeResponse;
