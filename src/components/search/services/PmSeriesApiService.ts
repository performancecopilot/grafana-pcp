import { BackendSrv } from '@grafana/runtime';
import { DataSourceInstanceSettings } from '@grafana/data';
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
} from '../models/endpoints/series';
import { timeout } from '../utils/utils';
import Config from '../config/config';

class PmSeriesApiService {
    baseUrl: string;
    backendSrv: BackendSrv;
    headers = {
        'Content-Type': 'application/json',
    };

    constructor(instanceSettings: DataSourceInstanceSettings, backendSrv: BackendSrv) {
        if (!instanceSettings.url) {
            throw new Error();
        }
        this.baseUrl = instanceSettings.url;
        this.headers = {
            ...this.headers,
            ...(instanceSettings.basicAuth ? { Authorization: instanceSettings.basicAuth } : {}),
        };
        this.backendSrv = backendSrv;
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
        const { baseUrl, headers, backendSrv } = this;
        const getParams = new URLSearchParams();
        getParams.append('series', params.series.join(','));
        if (getParams.get('series')?.length === 0) {
            return [];
        }
        if (params.client !== undefined) {
            getParams.append('client', params.toString());
        }
        const options = {
            url: `${baseUrl}/series/descs?${getParams.toString()}`,
            methods: 'GET',
            showSuccessAlert: false,
            headers,
        };
        try {
            const response: SeriesDescMaybeResponse = await timeout(
                backendSrv.request(options),
                Config.REQUEST_TIMEOUT
            );
            if (PmSeriesApiService.isNoRecordResponse(response)) {
                return [];
            }
            return response as Exclude<SeriesDescMaybeResponse, SeriesNoRecordResponse>;
        } catch {
            return [];
        }
    }

    async query(params: SeriesQueryQueryParams): Promise<SeriesQueryResponse> {
        const { baseUrl, headers, backendSrv } = this;
        const getParams = new URLSearchParams();
        getParams.append('expr', params.expr);
        if (params.client !== undefined) {
            getParams.append('client', params.toString());
        }
        const options = {
            url: `${baseUrl}/series/query?${getParams.toString()}`,
            methods: 'GET',
            showSuccessAlert: false,
            headers,
        };
        try {
            const response: SeriesQueryMaybeResponse = await timeout(
                backendSrv.request(options),
                Config.REQUEST_TIMEOUT
            );
            if (PmSeriesApiService.isNoRecordResponse(response)) {
                return [];
            }
            return response as Exclude<SeriesQueryMaybeResponse, SeriesNoRecordResponse>;
        } catch {
            return [];
        }
    }

    async metrics(params: SeriesMetricsQueryParams): Promise<SeriesMetricsResponse> {
        const { baseUrl, headers, backendSrv } = this;
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
            url: `${baseUrl}/series/metrics?${getParams.toString()}`,
            methods: 'GET',
            showSuccessAlert: false,
            headers,
        };
        try {
            const response: SeriesMetricsMaybeResponse = await timeout(
                backendSrv.request(options),
                Config.REQUEST_TIMEOUT
            );
            if (PmSeriesApiService.isNoRecordResponse(response)) {
                return [];
            }
            return response as Exclude<SeriesMetricsMaybeResponse, SeriesNoRecordResponse>;
        } catch {
            return [];
        }
    }

    async labels(params: SeriesLabelsQueryParams): Promise<SeriesLabelsResponse> {
        const { baseUrl, headers, backendSrv } = this;
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
            url: `${baseUrl}/series/labels?${getParams.toString()}`,
            methods: 'GET',
            showSuccessAlert: false,
            headers,
        };
        try {
            const response: SeriesLabelsMaybeResponse = await timeout(
                backendSrv.request(options),
                Config.REQUEST_TIMEOUT
            );
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
