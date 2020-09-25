import { BackendSrv, BackendSrvRequest } from '@grafana/runtime';
import {
    SeriesMaybeResponse,
    SeriesDescQueryParams,
    SeriesDescResponse,
    SeriesDescMaybeResponse,
    SeriesNoRecordResponse,
    SeriesQueryQueryParams,
    SeriesQueryResponse,
    SeriesQueryMaybeResponse,
    SeriesMetricsQueryParams,
    SeriesMetricsResponse,
    SeriesMetricsMaybeResponse,
    SeriesLabelsQueryParams,
    SeriesLabelsResponse,
    SeriesLabelsMaybeResponse,
    SeriesInstancesQueryParams,
    SeriesInstancesResponse,
    SeriesValuesQueryParams,
    SeriesPingResponse,
    SeriesInstancesMaybeResponse,
    SeriesValuesResponse,
    SeriesValuesMaybeResponse,
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

    async request(options: BackendSrvRequest) {
        options = defaults(options, this.defaultRequestOptions);
        try {
            if (this.apiConfig.isDatasourceRequest) {
                const response = await timeout(this.backendSrv.datasourceRequest(options), this.apiConfig.timeoutMs);
                return response.data;
            } else {
                return await timeout(this.backendSrv.request(options), this.apiConfig.timeoutMs);
            }
        } catch (error) {
            throw new NetworkError(error);
        }
    }

    static isNoRecordResponse(response: SeriesMaybeResponse) {
        if (
            typeof response === 'object' &&
            (response as { [key: string]: any }).success !== undefined &&
            Object.keys(response).length === 1
        ) {
            return true;
        }
        return false;
    }

    async ping(): Promise<SeriesPingResponse> {
        const options = {
            url: `${this.apiConfig.baseUrl}/series/ping`,
        };
        return await this.request(options);
    }

    async descs(params: SeriesDescQueryParams): Promise<SeriesDescResponse> {
        const getParams = new URLSearchParams();
        getParams.append('series', params.series.join(','));
        if (getParams.get('series')?.length === 0) {
            return [];
        }
        if (params.client !== undefined) {
            getParams.append('client', params.toString());
        }

        const options = {
            url: `${this.apiConfig.baseUrl}/series/descs?${getParams.toString()}`,
        };
        const response: SeriesDescMaybeResponse = await this.request(options);
        if (PmSeriesApiService.isNoRecordResponse(response)) {
            return [];
        }
        return response as Exclude<SeriesDescMaybeResponse, SeriesNoRecordResponse>;
    }

    async query(params: SeriesQueryQueryParams): Promise<SeriesQueryResponse> {
        const getParams = new URLSearchParams();
        getParams.append('expr', params.expr);
        if (params.client !== undefined) {
            getParams.append('client', params.toString());
        }
        const options = {
            url: `${this.apiConfig.baseUrl}/series/query?${getParams.toString()}`,
        };

        const response: SeriesQueryMaybeResponse = await this.request(options);
        if (PmSeriesApiService.isNoRecordResponse(response)) {
            return [];
        }
        return response as Exclude<SeriesQueryMaybeResponse, SeriesNoRecordResponse>;
    }

    async metrics(params: SeriesMetricsQueryParams): Promise<SeriesMetricsResponse> {
        const getParams = new URLSearchParams();
        if (params.series !== undefined) {
            getParams.append('series', params.series.join(','));
        }
        if (params.match !== undefined) {
            getParams.append('match', params.match);
        }
        if (params.client !== undefined) {
            getParams.append('client', params.client);
        }

        const options = {
            url: `${this.apiConfig.baseUrl}/series/metrics?${getParams.toString()}`,
        };
        const response: SeriesMetricsMaybeResponse = await this.request(options);
        if (PmSeriesApiService.isNoRecordResponse(response)) {
            return [];
        }
        return response as Exclude<SeriesMetricsMaybeResponse, SeriesNoRecordResponse>;
    }

    async instances(params: SeriesInstancesQueryParams): Promise<SeriesInstancesResponse> {
        const getParams = new URLSearchParams();
        if (params.series !== undefined) {
            getParams.append('series', params.series.join(','));
        }
        if (params.match !== undefined) {
            getParams.append('match', params.match);
        }

        const options = {
            url: `${this.apiConfig.baseUrl}/series/instances?${getParams.toString()}`,
        };
        const response: SeriesInstancesMaybeResponse = await this.request(options);
        if (PmSeriesApiService.isNoRecordResponse(response)) {
            return [];
        }
        return response as Exclude<SeriesInstancesMaybeResponse, SeriesNoRecordResponse>;
    }

    async labels(params: SeriesLabelsQueryParams): Promise<SeriesLabelsResponse> {
        const getParams = new URLSearchParams();
        if (params.series !== undefined) {
            getParams.append('series', params.series.join(','));
        }
        if (params.match !== undefined) {
            getParams.append('match', params.match);
        }
        if (params.names !== undefined) {
            getParams.append('names', params.names.join(','));
        }
        if (params.name !== undefined) {
            getParams.append('name', params.name);
        }
        if (params.client !== undefined) {
            getParams.append('client', params.client);
        }

        const options = {
            url: `${this.apiConfig.baseUrl}/series/labels?${getParams.toString()}`,
        };
        const response: SeriesLabelsMaybeResponse = await this.request(options);
        if (PmSeriesApiService.isNoRecordResponse(response)) {
            return {};
        }
        return response as Exclude<SeriesLabelsResponse, SeriesNoRecordResponse>;
    }

    async values(params: SeriesValuesQueryParams): Promise<SeriesValuesResponse> {
        const getParams = new URLSearchParams();
        if (params.series !== undefined) {
            getParams.append('series', params.series.join(','));
        }
        if (params.samples !== undefined) {
            getParams.append('samples', params.samples.toString());
        }
        if (params.interval !== undefined) {
            getParams.append('interval', params.interval);
        }
        if (params.start !== undefined) {
            getParams.append('start', params.start);
        }
        if (params.finish !== undefined) {
            getParams.append('finish', params.finish);
        }
        if (params.offset !== undefined) {
            getParams.append('offset', params.offset);
        }
        if (params.align !== undefined) {
            getParams.append('align', params.align);
        }
        if (params.zone !== undefined) {
            getParams.append('zone', params.zone);
        }

        const options = {
            url: `${this.apiConfig.baseUrl}/series/values?${getParams.toString()}`,
        };
        const response: SeriesValuesMaybeResponse = await this.request(options);
        if (PmSeriesApiService.isNoRecordResponse(response)) {
            return [];
        }
        return response as Exclude<SeriesValuesMaybeResponse, SeriesNoRecordResponse>;
    }
}
