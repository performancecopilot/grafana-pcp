import { BackendSrv, BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import { defaults } from 'lodash';
import { NetworkError } from '../../../common/types/errors/network';
import { DefaultRequestOptions, getRequestOptions, timeout } from '../../../common/utils';
import {
    PmSeriesApiConfig,
    SeriesDescQueryParams,
    SeriesDescResponse,
    SeriesInstancesQueryParams,
    SeriesInstancesResponse,
    SeriesLabelsQueryParams,
    SeriesLabelsResponse,
    SeriesMetricsQueryParams,
    SeriesMetricsResponse,
    SeriesPingResponse,
    SeriesQueryQueryParams,
    SeriesQueryResponse,
    SeriesValuesQueryParams,
    SeriesValuesResponse,
} from './types';

export class PmSeriesApiService {
    defaultRequestOptions: DefaultRequestOptions;

    constructor(private backendSrv: BackendSrv, private apiConfig: PmSeriesApiConfig) {
        this.defaultRequestOptions = getRequestOptions(apiConfig.dsInstanceSettings);
    }

    async request<T>(options: BackendSrvRequest): Promise<FetchResponse<T>> {
        options = defaults(options, this.defaultRequestOptions);
        try {
            return await timeout(this.backendSrv.fetch<T>(options).toPromise(), this.apiConfig.timeoutMs);
        } catch (error) {
            throw new NetworkError(error, options);
        }
    }

    async ping(url?: string): Promise<SeriesPingResponse> {
        const request = {
            url: `${url ?? this.apiConfig.baseUrl}/series/ping`,
        };
        const response = await this.request<SeriesPingResponse>(request);
        return response.data;
    }

    async descs(params: SeriesDescQueryParams, url?: string): Promise<SeriesDescResponse> {
        const request = {
            url: `${url ?? this.apiConfig.baseUrl}/series/descs`,
            params: {
                ...params,
                series: params.series.join(','),
            },
        };
        const response = await this.request<SeriesDescResponse>(request);
        return response.data;
    }

    async query(params: SeriesQueryQueryParams, url?: string): Promise<SeriesQueryResponse> {
        const request = {
            url: `${url ?? this.apiConfig.baseUrl}/series/query`,
            params,
        };
        const response = await this.request<SeriesQueryResponse>(request);
        return response.data;
    }

    async metrics(params: SeriesMetricsQueryParams, url?: string): Promise<SeriesMetricsResponse> {
        const request = {
            url: `${url ?? this.apiConfig.baseUrl}/series/metrics`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesMetricsResponse>(request);
        return response.data;
    }

    async instances(params: SeriesInstancesQueryParams, url?: string): Promise<SeriesInstancesResponse> {
        const request = {
            url: `${url ?? this.apiConfig.baseUrl}/series/instances`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesInstancesResponse>(request);
        return response.data;
    }

    async labels(params: SeriesLabelsQueryParams, url?: string): Promise<SeriesLabelsResponse> {
        const request = {
            url: `${url ?? this.apiConfig.baseUrl}/series/labels`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
                ...(params.names ? { names: params.names.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesLabelsResponse>(request);
        return response.data;
    }

    async values(params: SeriesValuesQueryParams, url?: string): Promise<SeriesValuesResponse> {
        const request = {
            url: `${url ?? this.apiConfig.baseUrl}/series/values`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesValuesResponse>(request);
        return response.data;
    }
}
