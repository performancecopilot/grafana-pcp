import { Labels, MetricMetadata, InstanceValuesSnapshot, MetricName, Context, InstanceName } from './pcp';
import { VectorQueryWithUrl } from './types';
import PollTimerWorker from './timer.worker'
import PmApi, { MissingMetricsError } from './pmapi';
import { difference, has } from 'lodash';

export interface MetricStore {
    metadata: MetricMetadata;
    instanceLabels: Labels;
    instanceNames: Record<number, InstanceName>;
    values: InstanceValuesSnapshot[];
}

interface ActiveMetric {
    lastRequestedMs: number;
    errors: any[];
    deltas: number[];
};

export interface Endpoint {
    url: string;
    container?: string;
    context: Context;
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
        const instancesResponse = await this.pmApi.getMetricInstances(endpoint.url, endpoint.context.context, metricStore.metadata.name);
        metricStore.instanceLabels = instancesResponse.labels;
        metricStore.instanceNames = instancesResponse.instances.reduce((acc, cur) => {
            acc[cur.instance] = cur.name;
            return acc;
        }, metricStore.instanceNames);
    }

    async pollEndpoint(endpoint: Endpoint) {
        let metricsToPoll = Object.keys(endpoint.activeMetrics);
        const newMetrics = difference(metricsToPoll, Object.keys(endpoint.metricStore));
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

            const missingMetrics = difference(newMetrics, metadataResponse.metrics.map(metric => metric.name));
            if (missingMetrics.length > 0) {
                for (const missingMetric of missingMetrics) {
                    endpoint.activeMetrics[missingMetric].errors.push(new MissingMetricsError(missingMetrics));
                }
                metricsToPoll = difference(metricsToPoll, missingMetrics);
            }
        }

        const valuesResponse = await this.pmApi.getMetricValues(endpoint.url, endpoint.context.context, metricsToPoll);
        for (const metricInstanceValues of valuesResponse.values) {
            const metricStore = endpoint.metricStore[metricInstanceValues.name];

            if (metricStore.metadata.indom) {
                let needRefresh = false;
                for (const instance of metricInstanceValues.instances) {
                    if (!metricStore.instanceNames[instance.instance!]) {
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
            if (has(error, 'data.message') && error.data.message.includes("unknown context identifier")) {
                console.debug("context expired, requesting new")
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

    throwBackgroundError(obj: { errors: any[] }) {
        if (obj.errors.length > 0) {
            const error = obj.errors.pop();
            obj.errors = [];
            throw error;
        }
    }

    async query(target: VectorQueryWithUrl): Promise<[Endpoint, MetricStore | undefined]> {
        let endpoint = this.state.endpoints.find(ep => ep.url == target.url && ep.container == target.container);
        if (!endpoint) {
            endpoint = {
                url: target.url,
                container: target.container,
                context: await this.pmApi.createContext(target.url, target.container),
                errors: [],
                metricStore: {},
                activeMetrics: {},
            };
            this.state.endpoints.push(endpoint);
        }
        this.throwBackgroundError(endpoint);

        const nowMs = new Date().getTime();
        let activeMetric = endpoint.activeMetrics[target.expr];
        if (activeMetric) {
            activeMetric.deltas.push(nowMs - activeMetric.lastRequestedMs);
            if (activeMetric.deltas.length == this.MEDIAN_OVER_LAST_X_REQUESTS + 1)
                activeMetric.deltas.shift();
            activeMetric.lastRequestedMs = nowMs;
        }
        else {
            activeMetric = endpoint.activeMetrics[target.expr] = { lastRequestedMs: nowMs, errors: [], deltas: [] };
            await this.pollEndpointWithContext(endpoint);
        }
        this.throwBackgroundError(activeMetric);

        return [endpoint, endpoint.metricStore[target.expr]];
    }
}
