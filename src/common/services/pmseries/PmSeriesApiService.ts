import { BackendSrv, BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import {
    SeriesDescQueryParams,
    SeriesDescResponse,
    SeriesQueryQueryParams,
    SeriesQueryResponse,
    SeriesMetricsQueryParams,
    SeriesMetricsResponse,
    SeriesLabelsQueryParams,
    SeriesLabelsResponse,
    SeriesInstancesQueryParams,
    SeriesInstancesResponse,
    SeriesValuesQueryParams,
    SeriesPingResponse,
    SeriesValuesResponse,
    PmSeriesApiConfig,
} from './types';
import { defaults } from 'lodash';
import { DefaultRequestOptions, getRequestOptions, timeout } from 'common/utils';
import { NetworkError } from 'common/types/errors/network';

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

    async ping(): Promise<SeriesPingResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/series/ping`,
        };
        const response = await this.request<SeriesPingResponse>(request);
        return response.data;
    }

    async descs(params: SeriesDescQueryParams): Promise<SeriesDescResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/series/descs`,
            params: {
                ...params,
                series: params.series.join(','),
            },
        };
        const response = await this.request<SeriesDescResponse>(request);
        return response.data;
    }

    async query(params: SeriesQueryQueryParams): Promise<SeriesQueryResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/series/query`,
            params,
        };
        const response = await this.request<SeriesQueryResponse>(request);
        return response.data;
    }

    async metrics(params: SeriesMetricsQueryParams): Promise<SeriesMetricsResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/series/metrics`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesMetricsResponse>(request);
        return response.data;
    }

    async instances(params: SeriesInstancesQueryParams): Promise<SeriesInstancesResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/series/instances`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesInstancesResponse>(request);
        return response.data;
    }

    async labels(params: SeriesLabelsQueryParams): Promise<SeriesLabelsResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/series/labels`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
                ...(params.names ? { names: params.names.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesLabelsResponse>(request);
        return response.data;
    }

    async values(params: SeriesValuesQueryParams): Promise<SeriesValuesResponse> {
        const request = {
            url: `${this.apiConfig.baseUrl}/series/values`,
            params: {
                ...params,
                ...(params.series ? { series: params.series.join(',') } : {}),
            },
        };
        const response = await this.request<SeriesValuesResponse>(request);
        return response.data;
    }
}
