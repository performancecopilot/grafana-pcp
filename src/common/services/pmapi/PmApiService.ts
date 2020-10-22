import { BackendSrv, BackendSrvRequest } from '@grafana/runtime';
import { NetworkError } from 'common/types/errors/network';
import { DefaultRequestOptions, getRequestOptions, timeout } from 'common/utils';
import { has, defaults } from 'lodash';
import {
    ChildrenRequest,
    ChildrenResponse,
    ContextRequest,
    ContextResponse,
    DeriveRequest,
    DeriveResponse,
    FetchRequest,
    FetchResponse,
    IndomRequest,
    IndomResponse,
    MetricNotFoundError,
    MetricRequest,
    MetricResponse,
    MetricSemanticError,
    MetricSyntaxError,
    NoIndomError,
    PermissionError,
    PmApiConfig,
    StoreRequest,
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
     */
    async createContext(params: ContextRequest): Promise<ContextResponse> {
        const request = {
            url: `${params.url}/pmapi/context`,
            params: {
                hostspec: params.hostspec,
                polltimeout: params.polltimeout ?? 30,
            },
        };
        const response = await this.datasourceRequest(request);

        if (!has(response.data, 'context')) {
            throw new NetworkError('Received malformed response.', request);
        }
        return response.data;
    }

    async metric(params: MetricRequest): Promise<MetricResponse> {
        // if multiple metrics are requested and one is missing, pmproxy returns the valid metrics
        // if a single metric is requested which is missing, pmproxy returns 400
        try {
            const request = {
                url: `${params.url}/pmapi/metric`,
                params: {
                    hostspec: params.hostspec,
                    context: params.context,
                    names: params.names.join(','),
                },
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

    async indom(params: IndomRequest): Promise<IndomResponse> {
        try {
            const request = {
                url: `${params.url}/pmapi/indom`,
                params: {
                    hostspec: params.hostspec,
                    context: params.context,
                    name: params.name,
                },
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

    async fetch(params: FetchRequest): Promise<FetchResponse> {
        const request = {
            url: `${params.url}/pmapi/fetch`,
            params: {
                hostspec: params.hostspec,
                context: params.context,
                names: params.names.join(','),
            },
        };
        const response = await this.datasourceRequest(request);

        if (!has(response.data, 'timestamp')) {
            throw new NetworkError('Received malformed response.', request);
        }
        return response.data;
    }

    async store(params: StoreRequest): Promise<StoreResponse> {
        try {
            const request = {
                url: `${params.url}/pmapi/store`,
                params: {
                    hostspec: params.hostspec,
                    context: params.context,
                    name: params.name,
                    value: params.value,
                },
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

    async derive(params: DeriveRequest): Promise<DeriveResponse> {
        try {
            const request = {
                url: `${params.url}/pmapi/derive`,
                params: {
                    hostspec: params.hostspec,
                    context: params.context,
                    name: params.name,
                    expr: params.expr,
                },
            };
            const response = await this.datasourceRequest(request);
            return response.data;
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('Duplicate derived metric name')) {
                return { success: true };
            } else if (has(error, 'data.message') && error.data.message.includes('Semantic Error')) {
                throw new MetricSemanticError(params.expr);
            } else if (has(error, 'data.message') && error.data.message.includes('Syntax Error')) {
                throw new MetricSyntaxError(params.expr);
            } else {
                throw error;
            }
        }
    }

    async children(params: ChildrenRequest): Promise<ChildrenResponse> {
        const request = {
            url: `${params.url}/pmapi/children`,
            params: {
                context: params.context,
                hostspec: params.hostspec,
                prefix: params.prefix,
            },
        };
        const response = await this.datasourceRequest(request);
        return response.data;
    }
}
