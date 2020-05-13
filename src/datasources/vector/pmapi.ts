import { BackendSrvRequest } from '@grafana/runtime';
import { MetricMetadata, MetricInstanceValue, InstanceDomain, MetricName, Context } from './pcp';

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
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/${ctxid}/metric`,
            params: { names: names.join(",") }
        });
        return response.data;
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
