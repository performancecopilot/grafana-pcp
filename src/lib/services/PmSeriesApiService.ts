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
} from '../models/api/series';
import { timeout } from '../utils/timeout';
import Config from '../../components/search/config/config';
import { DefaultRequestOptions } from '../../datasources/lib/types';
import { defaults } from 'lodash';
import { NetworkError } from '../models/errors/network';

class PmSeriesApiService {
    constructor(
        private backendSrv: BackendSrv,
        private baseUrl: string,
        private defaultRequestOptions: DefaultRequestOptions,
        private isDatasourceRequest = true
    ) {}

    async request(options: BackendSrvRequest) {
        options = defaults(options, this.defaultRequestOptions);
        try {
            if (this.isDatasourceRequest) {
                return await this.backendSrv.datasourceRequest(options);
            } else {
                return await this.backendSrv.request(options);
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
            url: `${this.baseUrl}/series/descs?${getParams.toString()}`,
        };
        try {
            const response: SeriesDescMaybeResponse = await timeout(this.request(options), Config.REQUEST_TIMEOUT);
            if (PmSeriesApiService.isNoRecordResponse(response)) {
                return [];
            }
            return response as Exclude<SeriesDescMaybeResponse, SeriesNoRecordResponse>;
        } catch {
            return [];
        }
    }

    async query(params: SeriesQueryQueryParams): Promise<SeriesQueryResponse> {
        const getParams = new URLSearchParams();
        getParams.append('expr', params.expr);
        if (params.client !== undefined) {
            getParams.append('client', params.toString());
        }
        const options = {
            url: `${this.baseUrl}/series/query?${getParams.toString()}`,
        };
        try {
            const response: SeriesQueryMaybeResponse = await timeout(this.request(options), Config.REQUEST_TIMEOUT);
            if (PmSeriesApiService.isNoRecordResponse(response)) {
                return [];
            }
            return response as Exclude<SeriesQueryMaybeResponse, SeriesNoRecordResponse>;
        } catch {
            return [];
        }
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
            url: `${this.baseUrl}/series/metrics?${getParams.toString()}`,
        };
        try {
            const response: SeriesMetricsMaybeResponse = await timeout(this.request(options), Config.REQUEST_TIMEOUT);
            if (PmSeriesApiService.isNoRecordResponse(response)) {
                return [];
            }
            return response as Exclude<SeriesMetricsMaybeResponse, SeriesNoRecordResponse>;
        } catch {
            return [];
        }
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
            url: `${this.baseUrl}/series/labels?${getParams.toString()}`,
        };
        try {
            const response: SeriesLabelsMaybeResponse = await timeout(this.request(options), Config.REQUEST_TIMEOUT);
            if (PmSeriesApiService.isNoRecordResponse(response)) {
                return {};
            }
            return response as Exclude<SeriesLabelsResponse, SeriesNoRecordResponse>;
        } catch {
            return {};
        }
    }
}

export default PmSeriesApiService;
