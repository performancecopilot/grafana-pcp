import { BackendSrv, BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import { defaults, has } from 'lodash';
import { DefaultRequestOptions, getRequestOptions, timeout, TimeoutError } from '../../../common/utils';
import { GenericError, NetworkError } from '../../types/errors';
import {
    MetricNotFoundError,
    MetricSemanticError,
    MetricSyntaxError,
    NoIndomError,
    PermissionError,
    PmapiChildrenRequest,
    PmapiChildrenResponse,
    PmApiConfig,
    PmapiContextRequest,
    PmapiContextResponse,
    PmapiDeriveRequest,
    PmapiDeriveResponse,
    PmapiFetchRequest,
    PmapiFetchResponse,
    PmapiIndomRequest,
    PmapiIndomResponse,
    PmapiMetricRequest,
    PmapiMetricResponse,
    PmapiStoreRequest,
    PmapiStoreResponse,
} from './types';

export class PmApiService {
    defaultRequestOptions: DefaultRequestOptions;

    constructor(private backendSrv: BackendSrv, private apiConfig: PmApiConfig) {
        this.defaultRequestOptions = getRequestOptions(apiConfig.dsInstanceSettings);
    }

    async request<T>(options: BackendSrvRequest): Promise<FetchResponse<T>> {
        options = defaults({}, options, this.defaultRequestOptions);
        try {
            return await timeout(this.backendSrv.fetch<T>(options).toPromise(), this.apiConfig.timeoutMs);
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new TimeoutError(`Timeout while connecting to '${options.url}'`, error);
            }
            throw new NetworkError(error);
        }
    }

    /**
     * creates a new context
     */
    async createContext(url: string, params: PmapiContextRequest): Promise<PmapiContextResponse> {
        const request = {
            url: `${url}/pmapi/context`,
            params: {
                ...params,
                polltimeout: params.polltimeout ?? 30,
            },
        };

        const response = await this.request<PmapiContextResponse>(request);
        if (!has(response.data, 'context')) {
            throw new GenericError('Received malformed response.');
        }
        return response.data;
    }

    async metric(url: string, params: PmapiMetricRequest): Promise<PmapiMetricResponse> {
        const request = {
            url: `${url}/pmapi/metric`,
            params: {
                ...params,
                names: params.names.join(','),
            },
        };

        // if multiple metrics are requested and one is missing, pmproxy returns the valid metrics
        // if a single metric is requested which is missing, pmproxy returns 400
        try {
            const response = await this.request<PmapiMetricResponse>(request);
            if (!has(response.data, 'metrics')) {
                throw new GenericError('Received malformed response.');
            }
            return response.data;
        } catch (error) {
            if (error instanceof NetworkError && error.data?.message?.includes('Unknown metric name')) {
                return { metrics: [] };
            }
            throw error;
        }
    }

    async indom(url: string, params: PmapiIndomRequest): Promise<PmapiIndomResponse> {
        const request = {
            url: `${url}/pmapi/indom`,
            params,
        };

        try {
            const response = await this.request<PmapiIndomResponse>(request);
            if (!has(response.data, 'instances')) {
                throw new GenericError('Received malformed response.');
            }
            return response.data;
        } catch (error) {
            if (error instanceof NetworkError && error.data?.message?.includes('metric has null indom')) {
                throw new NoIndomError(params.name, error);
            }
            throw error;
        }
    }

    async fetch(url: string, params: PmapiFetchRequest): Promise<PmapiFetchResponse> {
        const request = {
            url: `${url}/pmapi/fetch`,
            params: {
                ...params,
                names: params.names.join(','),
            },
        };
        const response = await this.request<PmapiFetchResponse>(request);
        if (!has(response.data, 'timestamp')) {
            throw new GenericError('Received malformed response.');
        }
        return response.data;
    }

    async store(url: string, params: PmapiStoreRequest): Promise<PmapiStoreResponse> {
        const request = {
            url: `${url}/pmapi/store`,
            params,
        };

        try {
            const response = await this.request<PmapiStoreResponse>(request);
            return response.data;
        } catch (error) {
            if (error instanceof NetworkError) {
                if (error.data?.message?.includes('failed to lookup metric')) {
                    throw new MetricNotFoundError(params.name, error);
                } else if (error.data?.message?.includes('No permission to perform requested operation')) {
                    throw new PermissionError(params.name, error);
                } else if (error.data?.message?.includes('Bad input')) {
                    return { success: false };
                }
            }
            throw error;
        }
    }

    async derive(url: string, params: PmapiDeriveRequest): Promise<PmapiDeriveResponse> {
        const request = {
            url: `${url}/pmapi/derive`,
            params,
        };

        try {
            const response = await this.request<PmapiDeriveResponse>(request);
            return response.data;
        } catch (error) {
            if (error instanceof NetworkError) {
                if (error.data?.message?.includes('Duplicate derived metric name')) {
                    return { success: true };
                } else if (error.data?.message?.includes('Semantic Error')) {
                    throw new MetricSemanticError(params.expr, error);
                } else if (error.data?.message?.includes('Syntax Error')) {
                    throw new MetricSyntaxError(params.expr, error);
                }
            }
            throw error;
        }
    }

    async children(url: string, params: PmapiChildrenRequest): Promise<PmapiChildrenResponse> {
        const request = {
            url: `${url}/pmapi/children`,
            params,
        };
        const response = await this.request<PmapiChildrenResponse>(request);
        return response.data;
    }
}
