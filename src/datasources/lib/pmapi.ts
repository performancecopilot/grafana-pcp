import { BackendSrvRequest, getBackendSrv } from '@grafana/runtime';
import { has, defaults } from 'lodash';
import { NetworkError } from '../../lib/models/errors/network';
import { DefaultRequestOptions } from './models/pcp';
import { MetricName, Labels } from '../../lib/models/pcp/pcp';
import { PmapiInstance, PmapiMetricMetadata, PmapiInstanceValue } from '../../lib/models/pcp/pmapi';

export interface PmapiContext {
    context: number;
    labels: Labels;
}

export interface InstanceDomain {
    instances: PmapiInstance[];
    labels: Labels;
}

interface MetricsResponse {
    metrics: PmapiMetricMetadata[];
}

interface MetricInstanceValues {
    pmapi: string;
    name: MetricName;
    instances: PmapiInstanceValue[];
}

interface FetchResponse {
    timestamp: number;
    values: MetricInstanceValues[];
}

interface StoreResponse {
    success: boolean;
}

interface DeriveResponse extends StoreResponse {}

export class MetricNotFoundError extends Error {
    constructor(readonly metric: string, message?: string) {
        super(message ?? `Cannot find metric ${metric}. Please check if the PMDA is enabled.`);
        this.metric = metric;
        Object.setPrototypeOf(this, MetricNotFoundError.prototype);
    }
}

export class DuplicateDerivedMetricNameError extends Error {
    constructor(readonly metric: string, message?: string) {
        super(message ?? `Duplicate derived metric name ${metric}`);
        this.metric = metric;
        Object.setPrototypeOf(this, DuplicateDerivedMetricNameError.prototype);
    }
}

export class PermissionError extends Error {
    constructor(readonly metric: string, message?: string) {
        super(message ?? `Insufficient permissions to store metric ${metric}. Please check the PMDA configuration.`);
        this.metric = metric;
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}

export class PmApi {
    constructor(private defaultRequestOptions: DefaultRequestOptions) {}

    async datasourceRequest(options: BackendSrvRequest) {
        options = defaults(options, this.defaultRequestOptions);
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
    async createContext(url: string, hostspec: string, polltimeout = 30): Promise<PmapiContext> {
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

    async storeMetricValue(url: string, ctxid: number | null, name: string, value: string): Promise<StoreResponse> {
        const ctxPath = ctxid == null ? '' : `/${ctxid}`;
        try {
            const response = await this.datasourceRequest({
                url: `${url}/pmapi${ctxPath}/store`,
                params: { name, value },
            });
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

    async createDerived(url: string, expr: string, name: string): Promise<DeriveResponse> {
        try {
            const response = await this.datasourceRequest({
                url: `${url}/pmapi/derive`,
                params: { name, expr },
            });
            return response.data;
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('Duplicate derived metric name')) {
                return { success: true };
            } else {
                throw error;
            }
        }
    }
}
