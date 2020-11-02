import { searchEntities, detailEntities, indomEntities } from './responses';
import { PmApiMetricMetricResponse, PmApiIndomEndpointResponse } from '../models/endpoints/pmapi';
import { SearchEntity, TextResponse, AutocompleteResponse } from 'common/services/pmsearch/types';

export const querySearchEndpoint = (
    pattern: string,
    entityFlags: SearchEntity,
    limit: number,
    offset: number
): Promise<TextResponse> => {
    return new Promise<TextResponse>((resolve, reject) => {
        setTimeout(() => {
            resolve({
                elapsed: 0,
                results: searchEntities.slice(0, limit),
                limit,
                offset,
                total: 25,
            });
        }, 1000);
    });
};

// For now, lets assume this always finds the entity and the entity is always metric name
export const metricFetchEndpoint = (metricId: string): Promise<PmApiMetricMetricResponse> => {
    return new Promise<PmApiMetricMetricResponse>((resolve, reject) => {
        setTimeout(() => {
            resolve(detailEntities.find(x => x.metrics.some(m => m.name === metricId))?.metrics[0]);
        }, 1000);
    });
};

// For testing autocomplete
export const autocompleteFetchEndpoint = (query: string): Promise<AutocompleteResponse> => {
    return new Promise<AutocompleteResponse>((resolve, reject) => {
        setTimeout(() => {
            resolve(['metric.name1', 'metrika2', 'metrický metr', 'bazooka', 'extraordinary', 'zlatý důl']);
        }, 100);
    });
};

// Separate endpoint, will be fetched lazily
export const indomFetchEndpoint = (indom: string): Promise<PmApiIndomEndpointResponse> => {
    return new Promise<PmApiIndomEndpointResponse>((resolve, reject) => {
        setTimeout(() => {
            resolve(indomEntities.find(x => x.indom === indom));
        }, 1000);
    });
};
