/**
 * Periodically polls pmproxy(1) in the background
 *
 * Coalesces requests of multiple metrics into a single REST API call (metadata and fetch)
 * All metric related requests happen in the background, to use the same PCP Context and fetch multiple metrics at once
 */

import { MetricMetadata, Context, Instance, InstanceValuesSnapshot, Labels } from './pcp';
import { CompletePmapiQuery, Dict } from './types';
import { PmApi, MetricNotFoundError } from './pmapi';
import { difference, has, remove, uniq } from 'lodash';
import * as config from '../vector/config';
import { getLogger } from './utils';
const log = getLogger('poller');

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
    /** newly entered target */
    PENDING,
    /** metrics exists and metadata available */
    METRICS_AVAILABLE,
    /** fatal error, won't try again */
    ERROR,
}

/**
 * Represents a target of a Grafana panel, which will be polled in the background
 * Collects possible errors (e.g. MetricNotFoundError) which occured while polling in the background
 */
export interface Target<T = Dict<string, any>> {
    state: TargetState;
    query: CompletePmapiQuery;
    /** valid PCP metric names (can be a derived metric, e.g. derived_xxx) */
    metricNames: string[];
    errors: any[];
    lastActiveMs: number;
    custom?: T;
}

enum EndpointState {
    /** new entered endpoint, no context available */
    PENDING,
    /** context available */
    CONNECTED,
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
    metrics: Metric[];
    targets: Target[];
    errors: any[];

    /** context, will be created at next poll */
    context?: Context;
    /** backfilling with redis */
    hasRedis?: boolean;
}

export interface QueryResult {
    endpoint: Required<Endpoint>;
    target: Target;
    metrics: Metric[];
}

interface PollerState {
    endpoints: Endpoint[];
}

export class Poller {
    state: PollerState;
    pageIsVisible: boolean;
    timer: NodeJS.Timeout;

    constructor(
        private pmApi: PmApi,
        private refreshIntervalMs: number,
        private retentionTimeMs: number,
        private hooks: {
            queryHasChanged: (prevQuery: CompletePmapiQuery, newQuery: CompletePmapiQuery) => boolean;
            registerTarget: (target: Target) => Promise<string[]>;
            deregisterTarget?: (target: Target) => void;
            redisBackfill?: (endpoint: Endpoint, targets: Target[]) => Promise<void>;
        }
    ) {
        this.pageIsVisible = true;
        this.state = {
            endpoints: [],
        };
        this.setRefreshInterval(this.refreshIntervalMs, true);
    }

    setRefreshInterval(intervalMs: number, force = false) {
        if (intervalMs === this.refreshIntervalMs && !force) {
            return;
        }

        log.info('setting poll refresh interval to', intervalMs);
        clearInterval(this.timer);
        this.refreshIntervalMs = intervalMs;
        this.timer = setInterval(this.poll.bind(this), this.refreshIntervalMs);
    }

    setPageVisibility(visible: boolean) {
        this.pageIsVisible = visible;
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

    /**
     * set the target's state to TargetState.METRICS_AVAILABLE if all metrics are available
     */
    updateTargetStates(endpoint: Endpoint, targets: Target[]) {
        const allMetricNames = endpoint.metrics.map(metric => metric.metadata.name);
        for (const target of targets) {
            if (target.metricNames.length > 0 && difference(target.metricNames, allMetricNames).length === 0) {
                target.state = TargetState.METRICS_AVAILABLE;
            }
        }
    }

    async initializePendingTargets(endpoint: Required<Endpoint>) {
        let pendingTargets = endpoint.targets.filter(target => target.state === TargetState.PENDING);
        if (pendingTargets.length === 0) {
            return;
        }

        await Promise.all(
            pendingTargets.map(target =>
                this.hooks
                    .registerTarget(target)
                    .then(metricNames => (target.metricNames = metricNames))
                    .catch(error => target.errors.push(error))
            )
        );
        this.updateTargetStates(endpoint, pendingTargets);

        pendingTargets = endpoint.targets.filter(target => target.state === TargetState.PENDING);
        if (pendingTargets.length === 0) {
            return;
        }

        const pendingMetricNames = uniq(pendingTargets.flatMap(target => target.metricNames));
        const metadataResponse = await this.pmApi.getMetricMetadata(
            endpoint.url,
            endpoint.context.context,
            pendingMetricNames
        );
        for (const metadata of metadataResponse.metrics) {
            let metric: Metric = {
                metadata,
                instanceDomain: {
                    instances: new Map(),
                    labels: {},
                },
                values: [],
            };
            endpoint.metrics.push(metric);
        }
        this.updateTargetStates(endpoint, pendingTargets);

        const missingMetrics = difference(
            pendingMetricNames,
            metadataResponse.metrics.map(metric => metric.name)
        );
        if (missingMetrics.length > 0) {
            for (const missingMetric of missingMetrics) {
                pendingTargets
                    .filter(target => target.metricNames.includes(missingMetric))
                    .forEach(target => target.errors.push(new MetricNotFoundError(missingMetric)));
            }
        }

        if (endpoint.hasRedis) {
            await this.hooks.redisBackfill?.(endpoint, pendingTargets);
        }
    }

    async endpointHasRedis(endpoint: Endpoint): Promise<boolean> {
        // TODO: check if redis is available
        return false;
    }

    async pollEndpoint(endpoint: Endpoint) {
        if (endpoint.state === EndpointState.PENDING) {
            endpoint.context = await this.pmApi.createContext(
                endpoint.url,
                endpoint.hostspec,
                Math.round((this.refreshIntervalMs + config.gracePeriodMs) / 1000)
            );
            endpoint.hasRedis = this.hooks.redisBackfill && (await this.endpointHasRedis(endpoint));
            endpoint.state = EndpointState.CONNECTED;
        }

        await this.initializePendingTargets(endpoint as Required<Endpoint>);
        let metricsToPoll = uniq(
            endpoint.targets
                .filter(target => target.state === TargetState.METRICS_AVAILABLE)
                .flatMap(target => target.metricNames)
        );
        if (metricsToPoll.length === 0) {
            return;
        }

        const valuesResponse = await this.pmApi.getMetricValues(endpoint.url, endpoint.context!.context, metricsToPoll);
        for (const metricInstanceValues of valuesResponse.values) {
            const metric = endpoint.metrics.find(metric => metric.metadata.name === metricInstanceValues.name)!;

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

    async pollEndpointAndHandleContextTimeout(endpoint: Endpoint) {
        try {
            await this.pollEndpoint(endpoint);
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('unknown context identifier')) {
                console.log('context expired, requesting new');
                endpoint.context = await this.pmApi.createContext(
                    endpoint.url,
                    endpoint.hostspec,
                    Math.round((this.refreshIntervalMs + config.gracePeriodMs) / 1000)
                );
                await this.pollEndpoint(endpoint);
            } else {
                throw error;
            }
        }
    }

    async poll() {
        this.cleanInactiveTargets();
        this.cleanHistoryData();

        log.debug('polling endpoints', this.state.endpoints);
        await Promise.all(
            this.state.endpoints.map(endpoint =>
                this.pollEndpointAndHandleContextTimeout(endpoint).catch(error => endpoint.errors.push(error))
            )
        );
    }

    cleanInactiveTargets() {
        if (!this.pageIsVisible) {
            // Grafana stops polling the datasource if the page is in the background
            // therefore do not clean inactive targets in this case
            return;
        }

        const keepPolling = new Date().getTime() - (this.refreshIntervalMs + config.gracePeriodMs);
        for (const endpoint of this.state.endpoints) {
            endpoint.targets = endpoint.targets.filter(target => target.lastActiveMs > keepPolling);
        }
    }

    cleanHistoryData() {
        const keepExpiry = new Date().getTime() - this.retentionTimeMs;
        for (const endpoint of this.state.endpoints) {
            for (const metric of endpoint.metrics) {
                metric.values = metric.values.filter(snapshot => snapshot.timestampMs > keepExpiry);
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
    query(query: CompletePmapiQuery): QueryResult | null {
        let endpoint = this.state.endpoints.find(ep => ep.url === query.url && ep.hostspec === query.hostspec);
        if (!endpoint) {
            endpoint = {
                state: EndpointState.PENDING,
                url: query.url,
                hostspec: query.hostspec,
                metrics: [],
                targets: [],
                errors: [],
            };
            this.state.endpoints.push(endpoint);
        }
        this.throwBackgroundError(endpoint);

        const nowMs = new Date().getTime();
        let target = endpoint.targets.find(target => target.query.targetId === query.targetId);

        if (target && !this.hooks.queryHasChanged(target.query, query)) {
            // unchanged target
            target.lastActiveMs = nowMs;
        } else {
            if (target) {
                // target exists but has changed -> remove from list & create a new target
                this.hooks.deregisterTarget?.(target);
                remove(endpoint.targets, t => t === target);
            }

            target = {
                state: TargetState.PENDING,
                query,
                metricNames: [],
                lastActiveMs: nowMs,
                errors: [],
            };
            endpoint.targets.push(target);
        }
        this.throwBackgroundError(target);

        if (target.state === TargetState.METRICS_AVAILABLE) {
            const metrics = endpoint.metrics.filter(metric => target?.metricNames.includes(metric.metadata.name));
            return { endpoint: endpoint as Required<Endpoint>, target, metrics };
        }
        return null;
    }
}
