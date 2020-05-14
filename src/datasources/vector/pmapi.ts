import { BackendSrvRequest } from '@grafana/runtime';
import { MetricMetadata, MetricInstanceValue, InstanceDomain, MetricName, Context } from './pcp';
import { has } from 'lodash';

interface MetricsResponse {
    metrics: MetricMetadata[];
}

interface MetricInstanceValues {
    name: MetricName;
    instances: MetricInstanceValue[];
}

interface FetchResponse {
    timestamp: number;
    values: MetricInstanceValues[];
}

export class MissingMetricsError extends Error {
    readonly metrics: string[];
    constructor(metrics: string[], message?: string) {
        const s = metrics.length !== 1 ? 's' : '';
        if (!message)
            message = `Cannot find metric${s} ${metrics.join(', ')}. Please check if the PMDA is enabled.`;
        super(message);
        this.metrics = metrics;
        Object.setPrototypeOf(this, MissingMetricsError.prototype);
    }
}

export class PermissionError extends Error {
    readonly metrics: string[];
    constructor(metrics: string[], message?: string) {
        const s = metrics.length !== 1 ? 's' : '';
        if (!message)
            message = `Insufficient permissions to store metric${s} ${metrics.join(', ')}.`;
        super(message);
        this.metrics = metrics;
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}

export default class PmApi {
    constructor(private datasourceRequest: (options: BackendSrvRequest) => Promise<any>) {
    }

    async createContext(url: string, container?: string): Promise<Context> {
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/context`,
            params: { polltimeout: 30 }
        });
        const contextData = response.data;

        if (container) {
            await this.datasourceRequest({
                url: `${url}/pmapi/${contextData.context}/store`,
                params: { name: "pmcd.client.container", value: container }
            });
        }
        return contextData;
    }

    async getMetricMetadata(url: string, ctxid: number, names: string[]): Promise<MetricsResponse> {
        // if multiple metrics are requested and one is missing, pmproxy returns the valid metrics
        // if a single metric is requested which is missing, pmproxy returns 400
        try {
            const response = await this.datasourceRequest({
                url: `${url}/pmapi/${ctxid}/metric`,
                params: { names: names.join(",") }
            });
            return response.data;
        }
        catch (error) {
            if (has(error, 'data.message') && error.data.message.includes("Unknown metric name"))
                return { metrics: [] };
            else
                throw error;
        }
    }

    async getMetricInstances(url: string, ctxid: number, name: string): Promise<InstanceDomain> {
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/${ctxid}/indom`,
            params: { name }
        });
        return response.data;
    }

    async getMetricValues(url: string, ctxid: number, names: string[]): Promise<FetchResponse> {
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/${ctxid}/fetch`,
            params: { names: names.join(",") }
        });
        return response.data;
    }
}
