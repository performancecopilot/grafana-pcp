import { DataSourceInstanceSettings } from '@grafana/data';

export interface PmSearchApiConfig {
    dsInstanceSettings: DataSourceInstanceSettings;
    timeoutMs: number;
    baseUrl: string;
}

export enum SearchEntity {
    None = 0,
    Metrics = 1 << 0,
    InstanceDomains = 1 << 1,
    Instances = 1 << 2,
    All = Metrics | InstanceDomains | Instances,
}

export enum EntityType {
    Metric = 'metric',
    Instance = 'instance',
    InstanceDomain = 'indom',
}

export interface AutocompleteQueryParams {
    query: string;
    limit?: number;
}

export type AutocompleteSuggestion = string;

export type AutocompleteResponse = AutocompleteSuggestion[];

export interface TextQueryParams {
    query: string;
    highlight?: Array<Omit<TextItemResponseField, 'indom' | 'type'>>;
    offset?: number;
    limit?: number;
    field?: Array<Omit<TextItemResponseField, 'indom' | 'type'>>;
    return?: TextItemResponseField[];
    type?: SearchEntity;
}

export enum TextItemResponseField {
    Type = 'type',
    Name = 'name',
    Indom = 'indom',
    Oneline = 'oneline',
    Helptext = 'helptext',
}

export interface TextItemResponse {
    /* All the ones below may be omited when they are filtered out by ?return param, or whey they lack any value (helptexts for example) */
    name?: string; // name field
    type?: EntityType; // type field (we always have only single type value on any record
    indom?: string; // indom field
    oneline?: string; // oneline field
    helptext?: string; // helptext field
}

export interface TextResponse {
    total: number; // Redisearch returns total number of matching records even if results themselves are limited
    elapsed: number;
    limit: number;
    offset: number;
    results: TextItemResponse[];
}

export interface IndomQueryParams {
    query: string;
    limit?: number;
    offset?: number;
}

export class SearchNotAvailableError extends Error {
    constructor(message?: string) {
        super(
            message ?? `Metric Search not available. Please install the RediSearch Redis module and restart pmproxy.`
        );
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
