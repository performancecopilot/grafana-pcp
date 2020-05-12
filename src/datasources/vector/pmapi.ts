import { BackendSrvRequest } from '@grafana/runtime';
import { Labels, MetricMetadata, MetricInstanceValue, InstanceDomain } from './pcp';

interface ContextResponse {
    context: number;
    labels: Labels;
}

interface MetricsResponse {
    metrics: MetricMetadata[];
}

interface IndomResponse extends InstanceDomain {
}

interface MetricInstanceValues {
    name: string; // metric name
    instances: MetricInstanceValue[];
}

interface FetchResponse {
    timestamp: number;
    values: MetricInstanceValues[];
}

export default class PmApi {
    constructor(private datasourceRequest: (options: BackendSrvRequest) => Promise<any>) {
    }

    async createContext(url: string, container?: string): Promise<ContextResponse> {
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

    async getMetricMetadata(url: string, ctx: number, name: string): Promise<MetricsResponse> {
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/${ctx}/metric`,
            params: { name }
        });
        return response.data;
    }

    async getMetricInstances(url: string, ctx: number, name: string): Promise<IndomResponse> {
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/${ctx}/indom`,
            params: { name }
        });
        return response.data;
    }

    async getMetricValues(url: string, ctx: number, name: string): Promise<FetchResponse> {
        const response = await this.datasourceRequest({
            url: `${url}/pmapi/${ctx}/fetch`,
            params: { name }
        });
        return response.data;
    }
}
