/**
 * Periodically polls pmproxy(1) in the background
 *
 * Coalesces requests of multiple metrics into a single REST API call (metadata and fetch)
 * All metric related requests happen in the background, to use the same PCP Context and fetch multiple metrics at once
 */
import { difference, remove, uniq } from 'lodash';
import { getLogger } from 'loglevel';
import { DataQueryRequest } from '@grafana/data';
import { PmApiService } from '../../../../common/services/pmapi/PmApiService';
import { MetricNotFoundError } from '../../../../common/services/pmapi/types';
import { PmSeriesApiService } from '../../../../common/services/pmseries/PmSeriesApiService';
import { NetworkError } from '../../../../common/types/errors';
import { MinimalPmapiQuery, PmapiQuery, Target, TargetState } from '../types';
import { Endpoint, EndpointState, EndpointWithCtx, Metric, QueryResult } from './types';

const log = getLogger('poller');

interface PollerHooks {
    queryHasChanged: (prevQuery: PmapiQuery, newQuery: PmapiQuery) => boolean;
    registerEndpoint?: (endpoint: EndpointWithCtx) => Promise<void>;
    registerTarget: (endpoint: EndpointWithCtx, target: Target) => Promise<string[]>;
    deregisterTarget?: (target: Target) => void;
    redisBackfill?: (endpoint: EndpointWithCtx, targets: Target[]) => Promise<void>;
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

        // wait one cycle before the first poll
        // this way we collect all requested metrics of all panels and can poll them combined
        this.timer = setTimeout(this.poll.bind(this), this.state.refreshIntervalMs);
    }

    setRefreshInterval(intervalMs: number) {
        if (intervalMs === this.state.refreshIntervalMs) {
            return;
        }

        log.info('setting poll refresh interval to', intervalMs);
        this.state.refreshIntervalMs = intervalMs;
        // when changing the refresh interval from e.g. 30m to 1s, do not wait until the current timeout
        // cancel the current timeout (30m) and start a new one (1s) instead
        clearTimeout(this.timer);
        this.timer = setTimeout(this.poll.bind(this), this.state.refreshIntervalMs);
    }

    setPageVisibility(visible: boolean) {
        this.state.pageIsVisible = visible;
    }

    async refreshInstanceNames(endpoint: EndpointWithCtx, metric: Metric) {
        const instancesResponse = await this.pmApiService.indom(endpoint.url, {
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
                    log.warn(`missing metric ${missingMetric} for target`, target);
                    target.state = TargetState.PENDING;
                    target.errors.push(new MetricNotFoundError(missingMetric));
                });
        }
    }

    async loadMetricsMetadata(endpoint: EndpointWithCtx, metricNames: string[]) {
        const metadataResponse = await this.pmApiService.metric(endpoint.url, {
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
                    .registerTarget(endpoint, target)
                    .then(metricNames => (target.metricNames = metricNames))
                    .catch(error => {
                        // if context expires during the registerTarget hook,
                        // do not attach the error to the target
                        // rethrow so it will be handled in pollEndpointAndHandleContextTimeout()
                        if (this.isContextHasExpiredError(error)) {
                            throw error;
                        }

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
        const readyTargets: Target[] = [];
        for (const target of pendingTargets) {
            if (target.metricNames.length > 0 && difference(target.metricNames, currentMetricNames).length === 0) {
                target.state = TargetState.METRICS_AVAILABLE;
                readyTargets.push(target);
            }
        }

        if (endpoint.hasRedis && readyTargets.length > 0) {
            try {
                await this.config.hooks.redisBackfill?.(endpoint, readyTargets);
            } catch (error) {
                // redis backfill is entirely optional, therefore ignore any errors
                log.error('Error in redisBackfill hook', error);
            }
        }
    }

    async endpointHasRedis(endpoint: Endpoint): Promise<boolean> {
        // the instance id of pmseries doesn't match instance id of pmapi
        // which leads to wrong association of instance names... disable backfilling until this is solved.
        return false;

        try {
            const pingRespone = await this.pmSeriesApiService.ping(endpoint.url);
            return pingRespone.success;
        } catch (error) {
            // redis backfill is entirely optional, therefore ignore any errors
            log.debug('Error checking if endpoint has redis', error);
            return false;
        }
    }

    async initContext(endpoint: Endpoint) {
        endpoint.context = await this.pmApiService.createContext(endpoint.url, {
            hostspec: endpoint.hostspec,
            polltimeout: Math.round((this.state.refreshIntervalMs + this.config.gracePeriodMs) / 1000),
        });
        endpoint.hasRedis = this.config.hooks.redisBackfill && (await this.endpointHasRedis(endpoint));
        endpoint.state = EndpointState.CONNECTED;
        await this.config.hooks.registerEndpoint?.(endpoint as EndpointWithCtx);
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

        log.trace('fetching metrics', metricsToPoll);
        const valuesResponse = await this.pmApiService.fetch(endpoint.url, {
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

        // metrics can appear and disappear at any time, update state accordingly
        this.detectMissingMetrics(
            endpoint as EndpointWithCtx,
            metricsToPoll,
            valuesResponse.values.map(metricInstanceValues => metricInstanceValues.name)
        );
    }

    isContextHasExpiredError(error: unknown) {
        return (
            error instanceof NetworkError &&
            (error.data?.message?.includes('unknown context identifier') ||
                error.data?.message?.includes('expired context identifier'))
        );
    }

    async pollEndpointAndHandleContextTimeout(endpoint: Endpoint) {
        try {
            await this.pollEndpoint(endpoint);
            // clean endpoint errors only if we have a successful poll
            endpoint.errors = [];
        } catch (error) {
            if (this.isContextHasExpiredError(error)) {
                log.debug('context expired. requesting a new context and resetting state of all targets to PENDING');
                endpoint.context = await this.pmApiService.createContext(endpoint.url, {
                    hostspec: endpoint.hostspec,
                    polltimeout: Math.round((this.state.refreshIntervalMs + this.config.gracePeriodMs) / 1000),
                });

                // reset targets after context expired (e.g. derived metrics)
                for (const target of endpoint.targets) {
                    target.state = TargetState.PENDING;
                }

                await this.pollEndpoint(endpoint);
            } else {
                throw error;
            }
        }
    }

    async poll() {
        this.cleanInactiveTargets();
        this.cleanHistoryData();

        log.trace(
            'polling endpoints: start',
            this.state.endpoints.filter(endpoint => endpoint.targets.length > 0)
        );
        await Promise.all(
            this.state.endpoints.map(endpoint =>
                this.pollEndpointAndHandleContextTimeout(endpoint).catch(error => {
                    endpoint.state = EndpointState.PENDING;
                    endpoint.errors = [error];
                })
            )
        );
        log.trace('polling endpoints: finish');

        // use setTimeout instead of setInterval to prevent overlapping timers
        this.timer = setTimeout(this.poll.bind(this), this.state.refreshIntervalMs);
    }

    deregisterTarget(endpoint: Endpoint, target: Target, reason: string) {
        log.debug(`deregistering target (${reason})`, target);
        this.config.hooks.deregisterTarget?.(target);
        remove(endpoint.targets, target);
    }

    cleanInactiveTargets() {
        if (!this.state.pageIsVisible) {
            // Grafana stops polling the data source if the page is in the background
            // therefore do not clean inactive targets in this case
            return;
        }

        const now = new Date().getTime();
        const keepPolling = now - (this.state.refreshIntervalMs + this.config.gracePeriodMs);
        for (const endpoint of this.state.endpoints) {
            const targetsToDeregister = endpoint.targets.filter(target => target.lastActiveMs <= keepPolling);
            targetsToDeregister.forEach(target =>
                this.deregisterTarget(endpoint, target, `last active ${(now - target.lastActiveMs) / 1000}s ago`)
            );
        }
    }

    cleanHistoryData() {
        if (this.config.retentionTimeMs === 0) {
            return;
        }

        let cleanedSnapshots = 0;
        const keepExpiry = new Date().getTime() - this.config.retentionTimeMs;
        for (const endpoint of this.state.endpoints) {
            for (const metric of endpoint.metrics) {
                const snapshotCount = metric.values.length;
                metric.values = metric.values.filter(snapshot => snapshot.timestampMs > keepExpiry);
                cleanedSnapshots += snapshotCount - metric.values.length;
            }
        }

        if (cleanedSnapshots > 0) {
            log.debug(`cleaned ${cleanedSnapshots} historical metric value(s)`);
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
     *
     * targets belong to one endpoint instead of a global list:
     *   * no need for grouping on every poll
     *   * endpoint has context and errors attached
     */
    query(request: DataQueryRequest<MinimalPmapiQuery>, query: PmapiQuery): QueryResult | null {
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
                this.deregisterTarget(endpoint, target, 'target changed');
            } else {
                // target does not exist in endpoint where it should be,
                // maybe the endpoint of target changed
                for (const otherEndoint of this.state.endpoints) {
                    if (otherEndoint === endpoint) {
                        continue;
                    }
                    const targetOfOtherEndpoint = otherEndoint.targets.find(target => target.targetId === targetId);
                    if (targetOfOtherEndpoint) {
                        this.deregisterTarget(otherEndoint, targetOfOtherEndpoint, 'target changed endpoint');
                        break;
                    }
                }
            }

            log.debug('adding new target', targetId, query);
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
