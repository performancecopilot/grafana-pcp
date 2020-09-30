import { BackendSrv, BackendSrvRequest } from '@grafana/runtime';
import { NetworkError } from 'common/types/errors/network';
import { DefaultRequestOptions, getRequestOptions, timeout } from 'common/utils';
import { has, defaults } from 'lodash';
import {
    ChildrenResponse,
    Context,
    DeriveResponse,
    FetchResponse,
    IndomResponse,
    MetricNotFoundError,
    MetricResponse,
    MetricSemanticError,
    MetricSyntaxError,
    NoIndomError,
    PermissionError,
    PmApiConfig,
    StoreResponse,
} from './types';

export class PmApiService {
    defaultRequestOptions: DefaultRequestOptions;

    constructor(private backendSrv: BackendSrv, private apiConfig: PmApiConfig) {
        this.defaultRequestOptions = getRequestOptions(apiConfig.dsInstanceSettings);
    }

    async datasourceRequest(options: BackendSrvRequest) {
        options = defaults(options, this.defaultRequestOptions);
        try {
            return await timeout(this.backendSrv.datasourceRequest(options), this.apiConfig.timeoutMs);
        } catch (error) {
            throw new NetworkError(error, options);
        }
    }

    /**
     * creates a new context
     * @param url
     * @param hostspec
     * @param polltimeout context timeout in seconds
     */
    async createContext(url: string, hostspec: string, polltimeout = 30): Promise<Context> {
        const request = {
            url: `${url}/pmapi/context`,
            params: { hostspec, polltimeout },
        };
        const response = await this.datasourceRequest(request);

        if (!has(response.data, 'context')) {
            throw new NetworkError('Received malformed response.', request);
        }
        return response.data;
    }

    async metric(url: string, ctxid: number | null, names: string[]): Promise<MetricResponse> {
        // if multiple metrics are requested and one is missing, pmproxy returns the valid metrics
        // if a single metric is requested which is missing, pmproxy returns 400
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        try {
            const request = {
                url: `${url}/pmapi${ctxPath}/metric`,
                params: { names: names.join(',') },
            };
            const response = await this.datasourceRequest(request);

            if (!has(response.data, 'metrics')) {
                throw new NetworkError('Received malformed response.', request);
            }
            return response.data;
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('Unknown metric name')) {
                return { metrics: [] };
            } else {
                throw error;
            }
        }
    }

    async indom(url: string, ctxid: number | null, name: string): Promise<IndomResponse> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        try {
            const request = {
                url: `${url}/pmapi${ctxPath}/indom`,
                params: { name },
            };
            const response = await this.datasourceRequest(request);

            if (!has(response.data, 'instances')) {
                throw new NetworkError('Received malformed response.', request);
            }
            return response.data;
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('metric has null indom')) {
                throw new NoIndomError(name);
            } else {
                throw error;
            }
        }
    }

    async fetch(url: string, ctxid: number | null, names: string[]): Promise<FetchResponse> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        const request = {
            url: `${url}/pmapi${ctxPath}/fetch`,
            params: { names: names.join(',') },
        };
        const response = await this.datasourceRequest(request);

        if (!has(response.data, 'timestamp')) {
            throw new NetworkError('Received malformed response.', request);
        }
        return response.data;
    }

    async store(url: string, ctxid: number | null, name: string, value: string): Promise<StoreResponse> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        try {
            const request = {
                url: `${url}/pmapi${ctxPath}/store`,
                params: { name, value },
            };
            const response = await this.datasourceRequest(request);
            return response.data;
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('failed to lookup metric')) {
                throw new MetricNotFoundError(name);
            } else if (
                has(error, 'data.message') &&
                error.data.message.includes('No permission to perform requested operation')
            ) {
                throw new PermissionError(name);
            } else if (has(error, 'data.message') && error.data.message.includes('Bad input')) {
                return { success: false };
            } else {
                throw error;
            }
        }
    }

    async derive(url: string, ctxid: number | null, expr: string, name: string): Promise<DeriveResponse> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        try {
            const request = {
                url: `${url}/pmapi${ctxPath}/derive`,
                params: { name, expr },
            };
            const response = await this.datasourceRequest(request);
            return response.data;
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('Duplicate derived metric name')) {
                return { success: true };
            } else if (has(error, 'data.message') && error.data.message.includes('Semantic Error')) {
                throw new MetricSemanticError(expr);
            } else if (has(error, 'data.message') && error.data.message.includes('Syntax Error')) {
                throw new MetricSyntaxError(expr);
            } else {
                throw error;
            }
        }
    }

    async children(url: string, ctxid: number | null, prefix: string): Promise<ChildrenResponse> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        const request = {
            url: `${url}/pmapi${ctxPath}/children`,
            params: { prefix },
        };
        const response = await this.datasourceRequest(request);
        return response.data;
    }
}
