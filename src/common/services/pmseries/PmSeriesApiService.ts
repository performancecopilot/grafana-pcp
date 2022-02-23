import { defaults } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { BackendSrv, BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import { NetworkError } from '../../types/errors';
import { DefaultRequestOptions, getRequestOptions, timeout, TimeoutError } from '../../utils';
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
        options = defaults({}, options, this.defaultRequestOptions);
        try {
            return await timeout(firstValueFrom(this.backendSrv.fetch<T>(options)), this.apiConfig.timeoutMs);
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new TimeoutError(`Timeout while connecting to '${options.url}'`, error);
            }
            throw new NetworkError(error);
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
