import { Labels, MetricMetadata, InstanceValuesSnapshot, MetricName, Context } from './pcp';
import { VectorQueryWithUrl } from './types';
import PollTimerWorker from './timer.worker'
import PmApi from './pmapi';
import { difference } from 'lodash';

interface MetricStore {
    metadata: MetricMetadata;
    instanceLabels: Labels;
    instanceNames: Record<number, string>;
    values: InstanceValuesSnapshot[];
}

interface ActiveMetric {
    lastRequestedMs: number;
    deltas: number[];
};

interface Endpoint {
    url: string;
    container?: string;

    context?: Context;
    errors: any[];
    activeMetrics: Record<MetricName, ActiveMetric>;
    metricStore: Record<MetricName, MetricStore>;
}

interface WorkerState {
    endpoints: Endpoint[];
}

export default class Poller {
    MEDIAN_OVER_LAST_X_REQUESTS = 3;

    state: WorkerState;
    timer: PollTimerWorker;

    constructor(private pmApi: PmApi) {
        this.state = {
            endpoints: [],
        };

        this.timer = new PollTimerWorker();
        this.timer.onmessage = this.poll.bind(this);
        this.timer.postMessage({ interval: 1000 });
    }

    async refreshInstanceNames(endpoint: Endpoint, metricStore: MetricStore) {
        const instancesResponse = await this.pmApi.getMetricInstances(endpoint.url, endpoint.context!.context, metricStore.metadata.name);
        metricStore.instanceLabels = instancesResponse.labels;
        metricStore.instanceNames = instancesResponse.instances.reduce((acc, cur) => {
            acc[cur.instance] = cur.name;
            return acc;
        }, metricStore.instanceNames);
    }

    async pollEndpoint(endpoint: Endpoint) {
        if (!endpoint.context) {
            endpoint.context = await this.pmApi.createContext(endpoint.url, endpoint.container);
        }

        const newMetrics = difference(Object.keys(endpoint.activeMetrics), Object.keys(endpoint.metricStore));
        if (newMetrics.length > 0) {
            const metadataResponse = await this.pmApi.getMetricMetadata(endpoint.url, endpoint.context.context, newMetrics);

            for (const metadata of metadataResponse.metrics) {
                let metricStore: MetricStore = {
                    metadata,
                    instanceLabels: {},
                    instanceNames: {},
                    values: []
                };

                if (metadata.indom)
                    await this.refreshInstanceNames(endpoint, metricStore);

                endpoint.metricStore[metadata.name] = metricStore;
            }
        }

        const valuesResponse = await this.pmApi.getMetricValues(endpoint.url, endpoint.context.context, Object.keys(endpoint.activeMetrics));
        for (const metricInstanceValues of valuesResponse.values) {
            const metricStore = endpoint.metricStore[metricInstanceValues.name];

            if (metricStore.metadata.indom) {
                let needRefresh = false;
                for (const instance of metricInstanceValues.instances) {
                    if (!metricStore.instanceNames[instance.instance]) {
                        needRefresh = true;
                        break;
                    }
                }
                if (needRefresh)
                    await this.refreshInstanceNames(endpoint, metricStore);
            }

            metricStore.values.push({
                timestampMs: valuesResponse.timestamp * 1000,
                values: metricInstanceValues.instances
            });
        }
    }

    async pollEndpointWithContext(endpoint: Endpoint) {
        try {
            await this.pollEndpoint(endpoint);
        }
        catch (error) {
            // TODO: check if context expired
            if (false) {
                endpoint.context = await this.pmApi.createContext(endpoint.url, endpoint.container);
                await this.pollEndpoint(endpoint);
            }
            else {
                throw error;
            }
        }
    }

    getMedian(arr: number[]) {
        const sorted = arr.sort();
        const middle = Math.ceil(sorted.length / 2);
        return sorted.length % 2 == 0 ? (sorted[middle] + sorted[middle - 1]) / 2 : sorted[middle - 1];
    }

    async poll() {
        console.debug("poll", this.state);
        await Promise.all(this.state.endpoints.map(async (endpoint) => {
            try {
                await this.pollEndpointWithContext(endpoint);
            }
            catch (error) {
                endpoint.errors.push(error);
            }
        }));

        const deltas = this.state.endpoints.flatMap(ep => Object.values(ep.activeMetrics)).flatMap(am => am.deltas);
        if (deltas.length > 0) {
            const medianRequestTime = this.getMedian(deltas);
            this.timer.postMessage({ interval: medianRequestTime });
        }
    }

    async query(target: VectorQueryWithUrl): Promise<MetricStore | undefined> {
        let endpoint = this.state.endpoints.find(ep => ep.url == target.url && ep.container == target.container);
        if (!endpoint) {
            endpoint = {
                url: target.url,
                container: target.container,
                errors: [],
                metricStore: {},
                activeMetrics: {}
            };
            this.state.endpoints.push(endpoint);
        }

        if (endpoint.errors.length > 0) {
            const lastError = endpoint.errors.pop();
            endpoint.errors = [];
            throw lastError;
        }

        const nowMs = new Date().getTime();
        if (target.expr in endpoint.activeMetrics) {
            endpoint.activeMetrics[target.expr].deltas.push(nowMs - endpoint.activeMetrics[target.expr].lastRequestedMs);
            if (endpoint.activeMetrics[target.expr].deltas.length == this.MEDIAN_OVER_LAST_X_REQUESTS + 1)
                endpoint.activeMetrics[target.expr].deltas.shift();
            endpoint.activeMetrics[target.expr].lastRequestedMs = nowMs;
        }
        else {
            endpoint.activeMetrics[target.expr] = { lastRequestedMs: nowMs, deltas: [] };
            await this.pollEndpointWithContext(endpoint);
        }

        return endpoint.metricStore[target.expr];
    }
}
