/**
 * Periodically polls pmproxy(1) in the background
 *
 * Coalesces requests of multiple metrics into a single REST API call (metadata and fetch)
 * All metric related requests happen in the background, to use the same PCP Context and fetch multiple metrics at once
 */

import { QueryResult } from './models/pcp';
import { PmApi, MetricNotFoundError, PmapiContext } from './pmapi';
import { difference, has, remove, uniq } from 'lodash';
import * as config from '../vector/config';
import { getLogger } from './utils';
import { Dict } from '../../lib/models/utils';
import { PmapiMetric, PmapiInstanceId, PmapiInstanceValue } from '../../lib/models/pcp/pmapi';
import { CompletePmapiQuery, PmapiTarget, PmapiTargetState } from './models/pmapi';
import { MutableDataFrame, MutableField, FieldType, MISSING_VALUE } from '@grafana/data';
import { Semantics, InstanceName } from '../../lib/models/pcp/pcp';
import { getFieldMetadata } from './dataframe_utils';
import PmSeriesApiService from '../../lib/services/PmSeriesApiService';
const log = getLogger('poller');

export interface PmapiInstanceValuesSnapshot {
    timestampMs: number;
    values: PmapiInstanceValue[];
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
export interface Endpoint<T = Dict<string, any>> {
    state: EndpointState;
    url: string;
    hostspec: string;
    metrics: PmapiMetric[];
    metricValues: Dict<string, PmapiInstanceValuesSnapshot[]>;
    targets: PmapiTarget[];
    additionalMetricsToPoll: Array<{ name: string; callback: (values: PmapiInstanceValue[]) => void }>;
    errors: any[];
    custom?: T;

    /** context, will be created at next poll */
    context?: PmapiContext;
    /** backfilling with redis */
    hasRedis?: boolean;
}

interface PollerHooks {
    queryHasChanged: (prevQuery: CompletePmapiQuery, newQuery: CompletePmapiQuery) => boolean;
    registerEndpoint?: (endpoint: Endpoint) => Promise<void>;
    registerTarget: (target: PmapiTarget, endpoint: Endpoint) => Promise<string[]>;
    deregisterTarget?: (target: PmapiTarget) => void;
    redisBackfill?: (endpoint: Endpoint, pendingTargets: Array<PmapiTarget<Dict<string, any>>>) => Promise<void>;
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
        private pmSeriesApi: PmSeriesApiService,
        private refreshIntervalMs: number,
        private retentionTimeMs: number,
        private hooks: PollerHooks
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

    async refreshInstanceNames(endpoint: Endpoint, metric: PmapiMetric) {
        const instancesResponse = await this.pmApi.getMetricInstances(
            endpoint.url,
            endpoint.context!.context,
            metric.metadata.name
        );
        metric.instanceDomain.labels = instancesResponse.labels;
        for (const instance of instancesResponse.instances) {
            metric.instanceDomain.instances[instance.instance] = instance;
        }
    }

    detectMissingMetrics(endpoint: Required<Endpoint>, requestedMetrics: string[], receivedMetrics: string[]) {
        const missingMetrics = difference(requestedMetrics, receivedMetrics);
        for (const missingMetric of missingMetrics) {
            endpoint.targets
                .filter(target => target.metricNames.includes(missingMetric))
                .forEach(target => {
                    log.debug('missing metric', missingMetric, 'for target', target);
                    target.state = PmapiTargetState.PENDING;
                    target.errors.push(new MetricNotFoundError(missingMetric));
                });
        }
    }

    async loadPendingMetricsMetadata(endpoint: Required<Endpoint>, metricNames: string[]) {
        const metadataResponse = await this.pmApi.getMetricMetadata(
            endpoint.url,
            endpoint.context.context,
            metricNames
        );
        for (const metadata of metadataResponse.metrics) {
            let metric: PmapiMetric = {
                metadata,
                instanceDomain: {
                    instances: {},
                    labels: {},
                },
            };
            endpoint.metrics.push(metric);
            endpoint.metricValues[metric.metadata.name] = [];
        }

        this.detectMissingMetrics(
            endpoint,
            metricNames,
            metadataResponse.metrics.map(metric => metric.name)
        );
    }

    async initializePendingTargets(endpoint: Required<Endpoint>) {
        let pendingTargets = endpoint.targets.filter(target => target.state === PmapiTargetState.PENDING);
        if (pendingTargets.length === 0) {
            return;
        }

        // reset errors for pending targets - will try again
        pendingTargets.forEach(target => (target.errors = []));

        log.debug('registering targets', pendingTargets);
        await Promise.all(
            pendingTargets.map(target =>
                this.hooks
                    .registerTarget(target, endpoint)
                    .then(metricNames => (target.metricNames = metricNames))
                    .catch(error => {
                        target.state = PmapiTargetState.ERROR;
                        target.errors.push(error);
                    })
            )
        );

        let currentMetricNames = endpoint.metrics.map(metric => metric.metadata.name);
        const pendingMetricNames = difference(
            uniq(pendingTargets.flatMap(target => target.metricNames)),
            currentMetricNames
        );
        if (pendingMetricNames.length > 0) {
            await this.loadPendingMetricsMetadata(endpoint, pendingMetricNames);
        }

        currentMetricNames = endpoint.metrics.map(metric => metric.metadata.name);
        for (const target of pendingTargets) {
            if (target.metricNames.length > 0 && difference(target.metricNames, currentMetricNames).length === 0) {
                target.state = PmapiTargetState.METRICS_AVAILABLE;
            }
        }

        if (endpoint.hasRedis) {
            await this.hooks.redisBackfill?.(endpoint, pendingTargets);
        }
    }

    async endpointHasRedis(): Promise<boolean> {
        const { success } = await this.pmSeriesApi.ping();
        return success;
    }

    async initContext(endpoint: Endpoint) {
        endpoint.context = await this.pmApi.createContext(
            endpoint.url,
            endpoint.hostspec,
            Math.round((this.refreshIntervalMs + config.gracePeriodMs) / 1000)
        );
        endpoint.hasRedis = this.hooks.redisBackfill && (await this.endpointHasRedis());
        endpoint.state = EndpointState.CONNECTED;
        await this.hooks.registerEndpoint?.(endpoint);
    }

    async pollEndpoint(endpoint: Endpoint) {
        if (endpoint.state === EndpointState.PENDING) {
            await this.initContext(endpoint);
        }

        await this.initializePendingTargets(endpoint as Required<Endpoint>);

        const metricsToPoll = uniq(
            endpoint.targets
                .filter(target => target.state === PmapiTargetState.METRICS_AVAILABLE)
                .flatMap(target => target.metricNames)
        );
        if (metricsToPoll.length === 0) {
            return;
        }

        // only poll additional metrics if metrics from targets are also requested
        const additionalMetricNamesToPoll = uniq(endpoint.additionalMetricsToPoll.map(amp => amp.name));
        metricsToPoll.push(...additionalMetricNamesToPoll);

        const valuesResponse = await this.pmApi.getMetricValues(endpoint.url, endpoint.context!.context, metricsToPoll);
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
                    if (!(instance.instance! in metric.instanceDomain.instances)) {
                        needRefresh = true;
                        break;
                    }
                }
                if (needRefresh) {
                    await this.refreshInstanceNames(endpoint, metric);
                }
            }
            endpoint.metricValues[metricInstanceValues.name]!.push({
                timestampMs: valuesResponse.timestamp * 1000,
                values: metricInstanceValues.instances,
            });
        }

        this.detectMissingMetrics(
            endpoint as Required<Endpoint>,
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

        log.trace('polling endpoints', this.state.endpoints);
        await Promise.all(
            this.state.endpoints.map(endpoint =>
                this.pollEndpointAndHandleContextTimeout(endpoint).catch(error => {
                    endpoint.state = EndpointState.PENDING;
                    endpoint.errors.push(error);
                })
            )
        );
    }

    deregisterTarget(endpoint: Endpoint, target: PmapiTarget) {
        log.debug('deregistering target', target);
        this.hooks.deregisterTarget?.(target);
        remove(endpoint.targets, target);
    }

    cleanInactiveTargets() {
        if (!this.pageIsVisible) {
            // Grafana stops polling the datasource if the page is in the background
            // therefore do not clean inactive targets in this case
            return;
        }

        const keepPolling = new Date().getTime() - (this.refreshIntervalMs + config.gracePeriodMs);
        for (const endpoint of this.state.endpoints) {
            const targetsToDeregister = endpoint.targets.filter(target => target.lastActiveMs <= keepPolling);
            targetsToDeregister.forEach(target => this.deregisterTarget(endpoint, target));
        }
    }

    cleanHistoryData() {
        const keepExpiry = new Date().getTime() - this.retentionTimeMs;
        for (const endpoint of this.state.endpoints) {
            for (const metricName in endpoint.metricValues) {
                endpoint.metricValues[metricName] = endpoint.metricValues[metricName]!.filter(
                    snapshot => snapshot.timestampMs > keepExpiry
                );
            }
        }
    }

    throwBackgroundError(obj: { errors: any[] }) {
        if (obj.errors.length > 0) {
            obj.errors.forEach(error => log.error(error));
            throw Error(obj.errors.map(error => error.message).join('\n'));
        }
    }

    createDataFrame(
        endpoint: Endpoint,
        target: PmapiTarget,
        metric: PmapiMetric,
        requestRangeFromMs: number,
        requestRangeToMs: number,
        sampleIntervalSec: number
    ) {
        // fill the graph by requesting more data (+/- 1 interval)
        requestRangeFromMs -= sampleIntervalSec * 1000;
        requestRangeToMs += sampleIntervalSec * 1000;

        // the first value of a counter metric is lost due to rate conversation
        if (metric.metadata.sem === Semantics.Counter) {
            requestRangeFromMs -= sampleIntervalSec * 1000;
        }

        const dataFrame = new MutableDataFrame();
        const timeField = dataFrame.addField({ name: 'Time', type: FieldType.time });
        const instanceIdToField = new Map<PmapiInstanceId | null, MutableField>();
        for (const snapshot of endpoint.metricValues[metric.metadata.name] ?? []) {
            if (!(requestRangeFromMs <= snapshot.timestampMs && snapshot.timestampMs <= requestRangeToMs)) {
                continue;
            }

            // create all dataFrame fields in one go, because Grafana automatically matches
            // the vector length of newly created fields with already existing fields by adding empty data
            for (const instanceValue of snapshot.values) {
                if (instanceIdToField.has(instanceValue.instance)) {
                    continue;
                }

                let fieldName = target.custom?.isDerivedMetric ? target.query.expr : metric.metadata.name;
                let instanceName: InstanceName | undefined;
                if (instanceValue.instance !== null) {
                    instanceName = metric.instanceDomain.instances[instanceValue.instance]?.name;
                    if (instanceName) {
                        fieldName += `[${instanceName}]`;
                    }
                }

                instanceIdToField.set(
                    instanceValue.instance,
                    dataFrame.addField({
                        name: fieldName,
                        ...getFieldMetadata(metric, instanceValue.instance, instanceName, endpoint.context),
                    })
                );
            }

            timeField.values.add(snapshot.timestampMs);
            for (const instanceValue of snapshot.values) {
                let field = instanceIdToField.get(instanceValue.instance)!;
                field.values.add(instanceValue.value);
            }

            // some instance existed previously but disappeared -> fill field with MISSING_VALUE
            for (const field of instanceIdToField.values()) {
                if (field.values.length !== timeField.values.length) {
                    field.values.add(MISSING_VALUE);
                }
            }
        }
        return dataFrame;
    }

    /**
     * do *not* create a context here, or fetch any metric
     * otherwise the initial load of a dashboard creates lots of duplicate contexts
     */
    query(
        query: CompletePmapiQuery,
        requestRangeFromMs: number,
        requestRangeToMs: number,
        sampleIntervalSec: number
    ): QueryResult | null {
        let endpoint = this.state.endpoints.find(ep => ep.url === query.url && ep.hostspec === query.hostspec);
        if (!endpoint) {
            endpoint = {
                state: EndpointState.PENDING,
                url: query.url,
                hostspec: query.hostspec,
                metrics: [],
                metricValues: {},
                targets: [],
                additionalMetricsToPoll: [],
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
                this.deregisterTarget(endpoint, target);
            }

            target = {
                state: PmapiTargetState.PENDING,
                query,
                metricNames: [],
                lastActiveMs: nowMs,
                errors: [],
            };
            endpoint.targets.push(target);
        }
        this.throwBackgroundError(target);

        if (target.state === PmapiTargetState.METRICS_AVAILABLE) {
            const metricsOfTarget = endpoint.metrics.filter(metric =>
                target!.metricNames.includes(metric.metadata.name)
            );
            const targetResult = metricsOfTarget.map(metric => ({
                metric,
                dataFrame: this.createDataFrame(
                    endpoint!,
                    target!,
                    metric,
                    requestRangeFromMs,
                    requestRangeToMs,
                    sampleIntervalSec
                ),
            }));
            return { endpoint, target, targetResult };
        }
        return null;
    }
}
