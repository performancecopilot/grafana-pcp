/**
 * Periodically polls pmproxy(1) in the background
 *
 * Coalesces requests of multiple metrics into a single REST API call (metadata and fetch)
 * All metric related requests happen in the background, to use the same PCP Context and fetch multiple metrics at once
 */

import { MetricMetadata, Context, Instance, InstanceValuesSnapshot, Expr, Labels } from './pcp';
import { VectorQueryWithEndpointInfo } from './types';
// import PollTimerWorker from './timer.worker'
import { PmApi, MetricsNotFoundError } from './pmapi';
import { difference, has } from 'lodash';

/**
 * Represents a PCP Metric including metadata, instance names and values
 * can also be a derived metric
 */
export interface Metric {
    metadata: MetricMetadata;
    instanceDomain: {
        instances: Map<number, Instance>;
        labels: Labels;
    };
    values: InstanceValuesSnapshot[];
}

enum TargetState {
    /** newly entered target, no metric metadata available */
    PENDING,
    /** metric metadata available */
    INITIALIZED,
}

/**
 * Represents a target of a Grafana panel, which will be polled in the background
 * Collects possible errors (e.g. MetricNotFoundError) which occured while polling in the background
 */
interface Target {
    state: TargetState;

    /** expression, as entered by the user */
    expr: string;

    errors: any[];
    lastActiveMs: number;
}

export interface VectorTarget extends Target {
    /** a valid PCP metric name (can be a derived metric, e.g. derived_xxx) */
    metricName?: string;
    /** metric data, will be created at next poll */
    metric?: Metric;
    isDerivedMetric?: boolean;
}

/*
interface BPFtraceTarget extends Target {
    metrics: Metric[];
}*/

enum EndpointState {
    /** new entered endpoint, no context available */
    PENDING,
    /** context available */
    INITIALIZED,
}

/**
 * single endpoint, identified by url and hostspec
 * each url/hostspec has a different context
 * each url/hostspec can have different metrics (and values)
 */
export interface Endpoint {
    state: EndpointState;
    url: string;
    hostspec: string;
    targets: VectorTarget[];
    errors: any[];

    /** context, will be created at next poll */
    context?: Context;
    /** backfilling with redis */
    hasRedis?: boolean;
}

export interface QueryResult {
    query: VectorQueryWithEndpointInfo;
    endpoint: Required<Endpoint>;
    target: Required<VectorTarget>;
}

interface PollerState {
    endpoints: Endpoint[];
}

export class Poller {
    MEDIAN_OVER_LAST_X_REQUESTS = 3;

    state: PollerState;
    //timer: PollTimerWorker;

    constructor(private pmApi: PmApi, private retentionTimeMs: number) {
        this.state = {
            endpoints: [],
        };

        //this.timer = new PollTimerWorker();
        //this.timer.onmessage = this.poll.bind(this);
        //this.timer.postMessage({ interval: 1000 });
        setInterval(this.poll.bind(this), 1000);
    }

    async refreshInstanceNames(endpoint: Endpoint, metric: Metric) {
        const instancesResponse = await this.pmApi.getMetricInstances(
            endpoint.url,
            endpoint.context!.context,
            metric.metadata.name
        );
        metric.instanceDomain.labels = instancesResponse.labels;
        for (const instance of instancesResponse.instances) {
            metric.instanceDomain.instances.set(instance.instance, instance);
        }
    }

    isDerivedMetric(expr: Expr) {
        // TODO
        return false;
    }

    async backfillWithRedis(targets: VectorTarget[]) {
        // TODO: store metric values from redis (if available) in Metric#values
    }

    async initializePendingTargets(endpoint: Endpoint) {
        const pendingTargets = endpoint.targets.filter(target => target.state === TargetState.PENDING);
        if (pendingTargets.length === 0) {
            return;
        }

        for (const target of pendingTargets) {
            if (this.isDerivedMetric(target.expr)) {
                // TOOD: register derived metric
                target.isDerivedMetric = true;
            } else {
                target.metricName = target.expr;
                target.isDerivedMetric = false;
            }
        }

        const pendingMetricNames = pendingTargets.map(target => target.metricName!);
        const metadataResponse = await this.pmApi.getMetricMetadata(
            endpoint.url,
            endpoint.context!.context,
            pendingMetricNames
        );
        for (const metadata of metadataResponse.metrics) {
            const target = pendingTargets.find(target => target.metricName === metadata.name)!;

            let metric: Metric = {
                metadata,
                instanceDomain: {
                    instances: new Map(),
                    labels: {},
                },
                values: [],
            };

            target.metric = metric;
            target.state = TargetState.INITIALIZED;
        }

        const missingMetrics = difference(
            pendingMetricNames,
            metadataResponse.metrics.map(metric => metric.name)
        );
        if (missingMetrics.length > 0) {
            for (const missingMetric of missingMetrics) {
                pendingTargets
                    .find(target => target.metricName === missingMetric)!
                    .errors.push(new MetricsNotFoundError(missingMetrics));
            }
        }

        if (endpoint.hasRedis) {
            await this.backfillWithRedis(pendingTargets);
        }
    }

    async pollEndpoint(endpoint: Endpoint) {
        if (endpoint.state === EndpointState.PENDING) {
            endpoint.context = await this.pmApi.createContext(endpoint.url, endpoint.hostspec);
            endpoint.hasRedis = false; // TODO: check if redis is available
            endpoint.state = EndpointState.INITIALIZED;
        }

        await this.initializePendingTargets(endpoint);
        let metricsToPoll = endpoint.targets.map(target => target.metricName!);

        const valuesResponse = await this.pmApi.getMetricValues(endpoint.url, endpoint.context!.context, metricsToPoll);
        for (const metricInstanceValues of valuesResponse.values) {
            const metric = endpoint.targets.find(target => target.metricName === metricInstanceValues.name)!.metric!;

            if (metric.metadata.indom) {
                let needRefresh = false;
                for (const instance of metricInstanceValues.instances) {
                    if (!metric.instanceDomain.instances.has(instance.instance!)) {
                        needRefresh = true;
                        break;
                    }
                }
                if (needRefresh) {
                    await this.refreshInstanceNames(endpoint, metric);
                }
            }

            metric.values.push({
                timestampMs: valuesResponse.timestamp * 1000,
                values: metricInstanceValues.instances,
            });
        }
    }

    async pollEndpointRecreateContext(endpoint: Endpoint) {
        try {
            await this.pollEndpoint(endpoint);
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('unknown context identifier')) {
                console.log('context expired, requesting new');
                endpoint.context = await this.pmApi.createContext(endpoint.url, endpoint.hostspec);
                await this.pollEndpoint(endpoint);
            } else {
                throw error;
            }
        }
    }

    async poll() {
        this.cleanup();

        //console.log('poll', this.state);
        await Promise.all(
            this.state.endpoints.map(endpoint =>
                this.pollEndpointRecreateContext(endpoint).catch(error => endpoint.errors.push(error))
            )
        );

        /*const deltas = this.state.endpoints.flatMap(ep => Object.values(ep.activeMetrics)).flatMap(am => am.deltas);
        if (deltas.length > 0) {
            const medianRequestTime = this.getMedian(deltas);
            this.timer.postMessage({ interval: medianRequestTime });
        }*/
    }

    cleanup() {
        const keepExpiry = new Date().getTime() - this.retentionTimeMs;
        for (const endpoint of this.state.endpoints) {
            for (const target of endpoint.targets) {
                if (target.metric) {
                    target.metric.values = target.metric.values.filter(snapshot => snapshot.timestampMs > keepExpiry);
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
    query(query: VectorQueryWithEndpointInfo): QueryResult | null {
        let endpoint = this.state.endpoints.find(ep => ep.url === query.url && ep.hostspec === query.hostspec);
        if (!endpoint) {
            endpoint = {
                state: EndpointState.PENDING,
                url: query.url,
                hostspec: query.hostspec,
                errors: [],
                targets: [],
            };
            this.state.endpoints.push(endpoint);
        }
        this.throwBackgroundError(endpoint);

        const nowMs = new Date().getTime();
        let target = endpoint.targets.find(target => target.expr === query.expr);
        if (target) {
            target.lastActiveMs = nowMs;
        } else {
            target = { state: TargetState.PENDING, expr: query.expr, lastActiveMs: nowMs, errors: [] };
            endpoint.targets.push(target);
        }
        this.throwBackgroundError(target);

        if (target.state === TargetState.INITIALIZED) {
            return { query, endpoint, target } as QueryResult;
        }
        return null;
    }
}
