import { MetricMetadata, Context, InstanceDomain, Instance, InstanceValuesSnapshot, Expr } from './pcp';
import { VectorQueryWithUrl, DatasourceRequestOptions, RequiredField } from './types';
// import PollTimerWorker from './timer.worker'
import { PmApi, MissingMetricsError } from './pmapi';
import { difference, has } from 'lodash';

/**
 * PCP Metric including metadata, instance names and values
 * can be a derived metric
 */
export interface Metric {
    activeTarget: ActiveTarget;
    metadata: MetricMetadata;
    instanceDomain: Omit<InstanceDomain, "instances"> & { instances: Map<number, Instance> };
    values: InstanceValuesSnapshot[];
}

/**
 * requested target expression from a Grafana panel
 */
interface ActiveTarget {
    expr: string;
    /** metric name (can be a derived metric) */
    metricName?: string;
    /** metric data, will be created at next poll */
    metric?: Metric;
    lastRequestedMs: number;
    deltas: number[];
    errors: any[];
};

/**
 * single endpoint, identified by url and countainer
 * each url/container has a different context
 * each url can have different metrics (and values)
 */
export interface Endpoint {
    url: string;
    container?: string;
    /** context, will be created at next poll */
    context?: Context;
    activeTargets: ActiveTarget[];
    /** backfilling with redis: true, false or undefined (unknown)  */
    hasRedis?: boolean;
    errors: any[];
}

interface WorkerState {
    endpoints: Endpoint[];
}

export interface PollerQueryResult {
    target: VectorQueryWithUrl;
    endpoint: Endpoint;
    metric?: Metric;
}

export class Poller {
    MEDIAN_OVER_LAST_X_REQUESTS = 3;

    state: WorkerState;
    pmApi: PmApi;
    //timer: PollTimerWorker;

    constructor(datasourceRequestOptions: DatasourceRequestOptions,
        private retentionTimeMs: number) {
        this.state = {
            endpoints: [],
        };

        this.pmApi = new PmApi(datasourceRequestOptions);

        //this.timer = new PollTimerWorker();
        //this.timer.onmessage = this.poll.bind(this);
        //this.timer.postMessage({ interval: 1000 });
        setInterval(this.poll.bind(this), 1000);
    }

    async refreshInstanceNames(endpoint: RequiredField<Endpoint, "context">, metric: Metric) {
        const instancesResponse = await this.pmApi.getMetricInstances(endpoint.url, endpoint.context.context, metric.metadata.name);
        metric.instanceDomain.labels = instancesResponse.labels;
        for(const instance of instancesResponse.instances) {
            metric.instanceDomain.instances.set(instance.instance, instance);
        }
    }

    isDerivedMetric(expr: Expr) {
        // TODO
        return false;
    }

    async backfillWithRedis(metrics: Metric[]) {
        // TODO: store metric values from redis (if available) in Metric#values
    }

    async getNewMetricsMetadata(endpoint: RequiredField<Endpoint, "context">): Promise<Metric[]> {
        const newActiveTargets = endpoint.activeTargets.filter(activeTarget => !activeTarget.metricName);
        for (const activeTarget of newActiveTargets) {
            if (this.isDerivedMetric(activeTarget.expr)) {
                // TOOD: register derived metric
            }
            else {
                activeTarget.metricName = activeTarget.expr;
            }
        }

        const newMetrics: Metric[] = [];
        const newMetricNames = newActiveTargets.map(activeTarget => activeTarget.metricName!);
        if (newMetricNames.length > 0) {
            const metadataResponse = await this.pmApi.getMetricMetadata(endpoint.url, endpoint.context.context, newMetricNames);
            for (const metadata of metadataResponse.metrics) {
                const activeTarget = newActiveTargets.find(activeTarget => activeTarget.metricName == metadata.name)!;

                let metric: Metric = {
                    activeTarget,
                    metadata,
                    instanceDomain: {
                        instances: new Map(),
                        labels: {},
                    },
                    values: [],
                };

                if (metadata.indom)
                    await this.refreshInstanceNames(endpoint, metric);

                activeTarget.metric = metric;
                newMetrics.push(metric);
            }

            const missingMetrics = difference(newMetricNames, metadataResponse.metrics.map(metric => metric.name));
            if (missingMetrics.length > 0) {
                for (const missingMetric of missingMetrics) {
                    endpoint.activeTargets
                        .find(activeTarget => activeTarget.metricName == missingMetric)!
                        .errors.push(new MissingMetricsError(missingMetrics));
                }
            }
        }

        if (endpoint.hasRedis !== false)
            await this.backfillWithRedis(newMetrics);
        return newMetrics;
    }

    async pollEndpoint(endpoint: Endpoint) {
        if (!endpoint.context)
            endpoint.context = await this.pmApi.createContext(endpoint.url, endpoint.container);
        const endpointTyped = endpoint as RequiredField<Endpoint, "context">;

        await this.getNewMetricsMetadata(endpointTyped);
        let metricsToPoll = endpoint.activeTargets.map(activeTarget => activeTarget.metricName!);

        const valuesResponse = await this.pmApi.getMetricValues(endpoint.url, endpoint.context.context, metricsToPoll);
        for (const metricInstanceValues of valuesResponse.values) {
            const metric = endpoint.activeTargets.find(activeTarget => activeTarget.metricName == metricInstanceValues.name)!.metric!;

            if (metric.metadata.indom) {
                let needRefresh = false;
                for (const instance of metricInstanceValues.instances) {
                    if (!metric.instanceDomain.instances.has(instance.instance!)) {
                        needRefresh = true;
                        break;
                    }
                }
                if (needRefresh)
                    await this.refreshInstanceNames(endpointTyped, metric);
            }

            metric.values.push({
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
        this.cleanup();

        console.debug("poll", this.state);
        await Promise.all(this.state.endpoints.map(async (endpoint) => {
            try {
                await this.pollEndpointWithContext(endpoint);
            }
            catch (error) {
                endpoint.errors.push(error);
            }
        }));

        /*const deltas = this.state.endpoints.flatMap(ep => Object.values(ep.activeMetrics)).flatMap(am => am.deltas);
        if (deltas.length > 0) {
            const medianRequestTime = this.getMedian(deltas);
            this.timer.postMessage({ interval: medianRequestTime });
        }*/
    }

    cleanup() {
        const keepExpiry = new Date().getTime() - this.retentionTimeMs;
        for (const endpoint of this.state.endpoints) {
            for (const activeTarget of endpoint.activeTargets) {
                if (activeTarget.metric) {
                    activeTarget.metric.values = activeTarget.metric.values.filter(
                        snapshot => snapshot.timestampMs > keepExpiry
                    );
                }
            }
        }
    }

    throwBackgroundError(obj: { errors: any[] }) {
        if (obj.errors.length > 0) {
            const error = obj.errors.pop();
            obj.errors = [];
            console.log(error);
            throw error;
        }
    }

    /**
     * do *not* create a context here, or fetch any metric
     * otherwise the initial load of a dashboard creates lots of duplicate contexts
     */
    query(target: VectorQueryWithUrl): PollerQueryResult {
        let endpoint = this.state.endpoints.find(ep => ep.url == target.url && ep.container == target.container);
        if (!endpoint) {
            endpoint = {
                url: target.url,
                container: target.container,
                errors: [],
                activeTargets: [],
            };
            this.state.endpoints.push(endpoint);
        }
        this.throwBackgroundError(endpoint);

        const nowMs = new Date().getTime();
        let activeTarget = endpoint.activeTargets.find(activeTarget => activeTarget.expr == target.expr);
        if (activeTarget) {
            activeTarget.deltas.push(nowMs - activeTarget.lastRequestedMs);
            if (activeTarget.deltas.length == this.MEDIAN_OVER_LAST_X_REQUESTS + 1)
                activeTarget.deltas.shift();
            activeTarget.lastRequestedMs = nowMs;
        }
        else {
            activeTarget = { expr: target.expr, lastRequestedMs: nowMs, errors: [], deltas: [] };
            endpoint.activeTargets.push(activeTarget);
        }
        this.throwBackgroundError(activeTarget);

        return {
            target,
            endpoint,
            metric: activeTarget.metric,
        };
    }
}
