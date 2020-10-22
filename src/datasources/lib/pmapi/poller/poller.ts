/**
 * Periodically polls pmproxy(1) in the background
 *
 * Coalesces requests of multiple metrics into a single REST API call (metadata and fetch)
 * All metric related requests happen in the background, to use the same PCP Context and fetch multiple metrics at once
 */

import { difference, has, remove, uniq } from 'lodash';
import { PmapiQuery, Target, TargetState, TemplatedPmapiQuery } from '../types';
import { Endpoint, EndpointState, EndpointWithCtx, Metric, QueryResult } from './types';
import { PmApiService } from 'common/services/pmapi/PmApiService';
import { PmSeriesApiService } from 'common/services/pmseries/PmSeriesApiService';
import { MetricNotFoundError } from 'common/services/pmapi/types';
import { DataQueryRequest } from '@grafana/data';
import { getLogger } from 'common/utils';
const log = getLogger('poller');

interface PollerHooks {
    queryHasChanged: (prevQuery: PmapiQuery, newQuery: PmapiQuery) => boolean;
    registerEndpoint?: (endpoint: Endpoint) => Promise<void>;
    registerTarget: (target: Target, endpoint: Endpoint) => Promise<string[]>;
    deregisterTarget?: (target: Target) => void;
    redisBackfill?: (endpoint: Endpoint, pendingTargets: Target[]) => Promise<void>;
}

interface PollerConfig {
    retentionTimeMs: number;
    refreshIntervalMs: number;
    gracePeriodMs: number;
    hooks: PollerHooks;
}

interface PollerState {
    endpoints: Endpoint[];
    refreshIntervalMs: number;
    pageIsVisible: boolean;
}

export class Poller {
    state: PollerState;
    timer: NodeJS.Timeout;

    constructor(
        private pmApiService: PmApiService,
        private pmSeriesApiService: PmSeriesApiService,
        private config: PollerConfig
    ) {
        this.state = {
            endpoints: [],
            refreshIntervalMs: config.refreshIntervalMs,
            pageIsVisible: true,
        };
        this.timer = setInterval(this.poll.bind(this), this.config.refreshIntervalMs);
    }

    setRefreshInterval(intervalMs: number) {
        if (intervalMs === this.state.refreshIntervalMs) {
            return;
        }

        log.info('setting poll refresh interval to', intervalMs);
        clearInterval(this.timer);
        this.state.refreshIntervalMs = intervalMs;
        this.timer = setInterval(this.poll.bind(this), this.state.refreshIntervalMs);
    }

    setPageVisibility(visible: boolean) {
        this.state.pageIsVisible = visible;
    }

    async refreshInstanceNames(endpoint: EndpointWithCtx, metric: Metric) {
        const instancesResponse = await this.pmApiService.indom({
            url: endpoint.url,
            context: endpoint.context.context,
            name: metric.metadata.name,
        });
        metric.instanceDomain!.labels = instancesResponse.labels;
        for (const instance of instancesResponse.instances) {
            metric.instanceDomain!.instances[instance.instance] = instance;
        }
    }

    detectMissingMetrics(endpoint: EndpointWithCtx, requestedMetrics: string[], receivedMetrics: string[]) {
        const missingMetrics = difference(requestedMetrics, receivedMetrics);
        for (const missingMetric of missingMetrics) {
            endpoint.targets
                .filter(target => target.metricNames.includes(missingMetric))
                .forEach(target => {
                    log.debug('missing metric', missingMetric, 'for target', target);
                    target.state = TargetState.PENDING;
                    target.errors.push(new MetricNotFoundError(missingMetric));
                });
        }
    }

    async loadMetricsMetadata(endpoint: EndpointWithCtx, metricNames: string[]) {
        const metadataResponse = await this.pmApiService.metric({
            url: endpoint.url,
            context: endpoint.context.context,
            names: metricNames,
        });
        for (const metadata of metadataResponse.metrics) {
            let metric: Metric = {
                metadata,
                values: [],
            };
            if (metadata.indom) {
                metric.instanceDomain = {
                    instances: {},
                    labels: {},
                };
            }
            endpoint.metrics.push(metric);
        }

        this.detectMissingMetrics(
            endpoint,
            metricNames,
            metadataResponse.metrics.map(metric => metric.name)
        );
    }

    async initializePendingTargets(endpoint: EndpointWithCtx) {
        let pendingTargets = endpoint.targets.filter(target => target.state === TargetState.PENDING);
        if (pendingTargets.length === 0) {
            return;
        }

        // reset errors for pending targets - will try again
        pendingTargets.forEach(target => (target.errors = []));

        log.debug('registering targets', pendingTargets);
        await Promise.all(
            pendingTargets.map(target =>
                this.config.hooks
                    .registerTarget(target, endpoint)
                    .then(metricNames => (target.metricNames = metricNames))
                    .catch(error => {
                        target.state = TargetState.ERROR;
                        target.errors.push(error);
                    })
            )
        );

        let currentMetricNames = endpoint.metrics.map(metric => metric.metadata.name);
        const missingMetricNames = difference(
            uniq(pendingTargets.flatMap(target => target.metricNames)),
            currentMetricNames
        );
        if (missingMetricNames.length > 0) {
            await this.loadMetricsMetadata(endpoint, missingMetricNames);
        }

        currentMetricNames = endpoint.metrics.map(metric => metric.metadata.name);
        for (const target of pendingTargets) {
            if (target.metricNames.length > 0 && difference(target.metricNames, currentMetricNames).length === 0) {
                target.state = TargetState.METRICS_AVAILABLE;
            }
        }

        if (endpoint.hasRedis) {
            await this.config.hooks.redisBackfill?.(endpoint, pendingTargets);
        }
    }

    async endpointHasRedis(): Promise<boolean> {
        const { success } = await this.pmSeriesApiService.ping();
        return success;
    }

    async initContext(endpoint: Endpoint) {
        endpoint.context = await this.pmApiService.createContext({
            url: endpoint.url,
            hostspec: endpoint.hostspec,
            polltimeout: Math.round((this.state.refreshIntervalMs + this.config.gracePeriodMs) / 1000),
        });
        endpoint.hasRedis = this.config.hooks.redisBackfill && (await this.endpointHasRedis());
        endpoint.state = EndpointState.CONNECTED;
        await this.config.hooks.registerEndpoint?.(endpoint);
    }

    async pollEndpoint(endpoint: Endpoint) {
        if (endpoint.targets.length === 0) {
            return;
        }
        if (endpoint.state === EndpointState.PENDING) {
            await this.initContext(endpoint);
        }

        await this.initializePendingTargets(endpoint as EndpointWithCtx);

        const metricsToPoll = uniq(
            endpoint.targets
                .filter(target => target.state === TargetState.METRICS_AVAILABLE)
                .flatMap(target => target.metricNames)
        );
        if (metricsToPoll.length === 0) {
            return;
        }

        // only poll additional metrics if metrics from targets are also requested
        const additionalMetricNamesToPoll = uniq(endpoint.additionalMetricsToPoll.map(amp => amp.name));
        metricsToPoll.push(...additionalMetricNamesToPoll);

        const valuesResponse = await this.pmApiService.fetch({
            url: endpoint.url,
            context: endpoint.context!.context,
            names: metricsToPoll,
        });
        for (const metricInstanceValues of valuesResponse.values) {
            if (additionalMetricNamesToPoll.includes(metricInstanceValues.name)) {
                endpoint.additionalMetricsToPoll
                    .filter(({ name }) => name === metricInstanceValues.name)
                    .forEach(({ callback }) => callback(metricInstanceValues.instances));
                // do not store additional requested metrics
                continue;
            }

            const metric = endpoint.metrics.find(metric => metric.metadata.name === metricInstanceValues.name)!;
            if (metric.metadata.indom) {
                let needRefresh = false;
                for (const instance of metricInstanceValues.instances) {
                    if (!(instance.instance! in metric.instanceDomain!.instances)) {
                        needRefresh = true;
                        break;
                    }
                }
                if (needRefresh) {
                    await this.refreshInstanceNames(endpoint as EndpointWithCtx, metric);
                }
            }
            metric.values.push({
                timestampMs: valuesResponse.timestamp * 1000,
                values: metricInstanceValues.instances,
            });
        }

        this.detectMissingMetrics(
            endpoint as EndpointWithCtx,
            metricsToPoll,
            valuesResponse.values.map(metricInstanceValues => metricInstanceValues.name)
        );
    }

    async pollEndpointAndHandleContextTimeout(endpoint: Endpoint) {
        endpoint.errors = [];

        try {
            await this.pollEndpoint(endpoint);
        } catch (error) {
            if (has(error, 'data.message') && error.data.message.includes('unknown context identifier')) {
                log.debug('context expired. requesting a new context');
                endpoint.context = await this.pmApiService.createContext({
                    url: endpoint.url,
                    hostspec: endpoint.hostspec,
                    polltimeout: Math.round((this.state.refreshIntervalMs + this.config.gracePeriodMs) / 1000),
                });
                await this.pollEndpoint(endpoint);
            } else {
                throw error;
            }
        }
    }

    async poll() {
        this.cleanInactiveTargets();
        this.cleanHistoryData();

        log.debug(
            'polling endpoints: start',
            this.state.endpoints.filter(endpoint => endpoint.targets.length > 0)
        );
        await Promise.all(
            this.state.endpoints.map(endpoint =>
                this.pollEndpointAndHandleContextTimeout(endpoint).catch(error => {
                    endpoint.state = EndpointState.PENDING;
                    endpoint.errors.push(error);
                })
            )
        );
        log.debug('polling endpoints: finish');
    }

    deregisterTarget(endpoint: Endpoint, target: Target) {
        log.debug('deregistering target', target);
        this.config.hooks.deregisterTarget?.(target);
        remove(endpoint.targets, target);
    }

    cleanInactiveTargets() {
        if (!this.state.pageIsVisible) {
            // Grafana stops polling the datasource if the page is in the background
            // therefore do not clean inactive targets in this case
            return;
        }

        const keepPolling = new Date().getTime() - (this.state.refreshIntervalMs + this.config.gracePeriodMs);
        for (const endpoint of this.state.endpoints) {
            const targetsToDeregister = endpoint.targets.filter(target => target.lastActiveMs <= keepPolling);
            targetsToDeregister.forEach(target => this.deregisterTarget(endpoint, target));
        }
    }

    cleanHistoryData() {
        const keepExpiry = new Date().getTime() - this.config.retentionTimeMs;
        for (const endpoint of this.state.endpoints) {
            for (const metric of endpoint.metrics) {
                metric.values = metric.values.filter(snapshot => snapshot.timestampMs > keepExpiry);
            }
        }
    }

    throwBackgroundError(obj: { errors: any[] }) {
        if (obj.errors.length > 0) {
            obj.errors.forEach(error => log.error('background error', error, error?.data));
            throw Error(obj.errors.map(error => error.message).join('\n'));
        }
    }

    /**
     * do *not* create a context here, or fetch any metric
     * otherwise the initial load of a dashboard creates lots of duplicate contexts
     */
    query(request: DataQueryRequest<PmapiQuery>, query: TemplatedPmapiQuery): QueryResult | null {
        let endpoint = this.state.endpoints.find(ep => ep.url === query.url && ep.hostspec === query.hostspec);
        if (!endpoint) {
            endpoint = {
                state: EndpointState.PENDING,
                url: query.url,
                hostspec: query.hostspec,
                metrics: [],
                targets: [],
                additionalMetricsToPoll: [],
                errors: [],
            };
            this.state.endpoints.push(endpoint);
        }
        this.throwBackgroundError(endpoint);

        const nowMs = new Date().getTime();
        const targetId = `${request.dashboardId}/${request.panelId}/${query.refId}`;
        let target = endpoint.targets.find(target => target.targetId === targetId);

        if (target && !this.config.hooks.queryHasChanged(target.query, query)) {
            // unchanged target
            log.debug('unchanged target', target);
            target.lastActiveMs = nowMs;
        } else {
            if (target) {
                // target exists but has changed -> remove from list & create a new target
                log.debug('changed target', target);
                this.deregisterTarget(endpoint, target);
            } else {
                log.debug('new target', targetId, query);
            }

            target = {
                state: TargetState.PENDING,
                targetId,
                query,
                metricNames: [],
                lastActiveMs: nowMs,
                errors: [],
            };
            endpoint.targets.push(target);
        }
        this.throwBackgroundError(target);

        if (target.state === TargetState.METRICS_AVAILABLE) {
            const metrics = endpoint.metrics.filter(metric => target!.metricNames.includes(metric.metadata.name));
            return { endpoint: endpoint as EndpointWithCtx, query, metrics };
        }
        return null;
    }
}
