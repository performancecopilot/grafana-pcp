import { BackendSrvRequest, getBackendSrv } from '@grafana/runtime';
import { MetricMetadata, InstanceDomain, MetricName, Context, InstanceValue } from './pcp';
import { has, defaults } from 'lodash';
import { NetworkError } from './errors';
import { DefaultBackendSrvRequestOptions } from './types';

interface MetricsResponse {
    metrics: MetricMetadata[];
}

interface MetricInstanceValues {
    name: MetricName;
    instances: InstanceValue[];
}

interface FetchResponse {
    timestamp: number;
    values: MetricInstanceValues[];
}

export class MetricsNotFoundError extends Error {
    readonly metrics: string[];
    constructor(metrics: string[], message?: string) {
        const s = metrics.length !== 1 ? 's' : '';
        if (!message) {
            message = `Cannot find metric${s} ${metrics.join(', ')}. Please check if the PMDA is enabled.`;
        }
        super(message);
        this.metrics = metrics;
        Object.setPrototypeOf(this, MetricsNotFoundError.prototype);
    }
}

export class PermissionError extends Error {
    readonly metrics: string[];
    constructor(metrics: string[], message?: string) {
        const s = metrics.length !== 1 ? 's' : '';
        if (!message) {
            message = `Insufficient permissions to store metric${s} ${metrics.join(', ')}.`;
        }
        super(message);
        this.metrics = metrics;
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}

export class PmApi {
    constructor(private defaultBackendSrvRequestOptions: DefaultBackendSrvRequestOptions) {}

    async datasourceRequest(options: BackendSrvRequest) {
        options = defaults(options, this.defaultBackendSrvRequestOptions);
        try {
            return await getBackendSrv().datasourceRequest(options);
        } catch (error) {
            throw new NetworkError(error);
        }
    }

    /**
     * creates a new context
     * @param url
     * @param hostspec
     * @param polltimeout context timeout in seconds
     */
    async createContext(url: string, hostspec: string, polltimeout = 30): Promise<Context> {
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/context`,
            params: { hostspec, polltimeout },
        });

        if (!has(response.data, 'context')) {
            throw new NetworkError('Received malformed response');
        }
        return response.data;
    }

    async getMetricMetadata(url: string, ctxid: number, names: string[]): Promise<MetricsResponse> {
        // if multiple metrics are requested and one is missing, pmproxy returns the valid metrics
        // if a single metric is requested which is missing, pmproxy returns 400
        try {
            const response = await this.datasourceRequest({
                url: `${url}/pmapi/${ctxid}/metric`,
                params: { names: names.join(',') },
            });

            if (!has(response.data, 'metrics')) {
                throw new NetworkError('Received malformed response');
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

    async getMetricInstances(url: string, ctxid: number | null, name: string): Promise<InstanceDomain> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        const response = await this.datasourceRequest({
            url: `${url}/pmapi${ctxPath}/indom`,
            params: { name },
        });

        if (!has(response.data, 'instances')) {
            throw new NetworkError('Received malformed response');
        }
        return response.data;
    }

    async getMetricValues(url: string, ctxid: number | null, names: string[]): Promise<FetchResponse> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        const response = await this.datasourceRequest({
            url: `${url}/pmapi${ctxPath}/fetch`,
            params: { names: names.join(',') },
        });

        if (!has(response.data, 'timestamp')) {
            throw new NetworkError('Received malformed response');
        }
        return response.data;
    }
}
