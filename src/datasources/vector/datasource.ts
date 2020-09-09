import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MetricFindValue,
} from '@grafana/data';
import { DefaultRequestOptions, QueryResult } from '../lib/models/pcp';
import { defaults } from 'lodash';
import md5 from 'blueimp-md5';
import { interval_to_ms, getDashboardRefreshInterval, getLogger } from '../lib/utils';
import { Poller, Endpoint } from '../lib/poller';
import { PmApi } from '../lib/pmapi';
import { processTargets } from '../lib/data_processor';
import * as config from './config';
import { VectorQuery, VectorOptions, defaultVectorQuery, VectorTargetData } from './types';
import { buildQueries, testDatasource, metricFindQuery } from '../lib/pmapi_datasource_utils';
import { getRequestOptions } from '../../lib/utils/api';
import { PmapiTarget, CompletePmapiQuery } from '../lib/models/pmapi';
import PmSeriesApiService from '../../lib/services/PmSeriesApiService';
import { getBackendSrv } from '@grafana/runtime';
import {
    SeriesValuesItemResponse,
    SeriesInstancesItemResponse,
    SeriesMetricsItemResponse,
} from '../../lib/models/api/series';
const log = getLogger('datasource');

interface DataSourceState {
    defaultRequestOptions: DefaultRequestOptions;
    pmApi: PmApi;
    pmSeriesApi: PmSeriesApiService;
    poller: Poller;
    retentionTimeMs: number;
    derivedMetrics: Map<string, string>;
}

export class DataSource extends DataSourceApi<VectorQuery, VectorOptions> {
    state: DataSourceState;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings);

        this.instanceSettings.jsonData = defaults(this.instanceSettings.jsonData, {
            hostspec: config.defaults.hostspec,
            retentionTime: config.defaults.retentionTime,
        });

        const defaultRequestOptions = getRequestOptions(this.instanceSettings);
        const retentionTimeMs = interval_to_ms(this.instanceSettings.jsonData.retentionTime!);
        const refreshIntervalMs = getDashboardRefreshInterval() ?? 1000;

        const pmApi = new PmApi(defaultRequestOptions);
        const pmSeriesApi = new PmSeriesApiService(getBackendSrv(), this.instanceSettings.url!, defaultRequestOptions);

        const poller = new Poller(pmApi, pmSeriesApi, refreshIntervalMs, retentionTimeMs, {
            queryHasChanged: this.queryHasChanged,
            registerTarget: this.registerTarget.bind(this),
            redisBackfill: this.redisBackfill.bind(this),
        });

        this.state = {
            defaultRequestOptions,
            pmApi,
            pmSeriesApi,
            poller,
            retentionTimeMs,
            derivedMetrics: new Map<string, string>(),
        };

        document.addEventListener('visibilitychange', () => {
            this.state.poller.setPageVisibility(!document.hidden);
        });
    }

    queryHasChanged(prevQuery: CompletePmapiQuery, newQuery: CompletePmapiQuery) {
        return newQuery.expr !== prevQuery.expr;
    }

    isDerivedMetric(expr: string) {
        /* From: PCPIntro(1)
         * A node label must begin with an alphabetic character, followed by
         * zero or more characters drawn from the alphabetics, the digits and
         * character ``_'' (underscore).  For alphabetic characters in a node
         * label, upper and lower case are distinguished.
         *
         * By convention, the name of a performance metric is constructed by
         * concatenation of the node labels on a path through the PMNS from the
         * root node to a leaf node, with a ``.'' as a separator.
         *
         * -> Anything that is not a name is considered derived metric expression
         */
        return !/^[a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z][a-zA-Z0-9_]+)*$/.test(expr);
    }

    derivedMetricName(expr: string): string {
        return `derived_${md5(expr)}`;
    }

    async registerDerivedMetric(target: PmapiTarget<VectorTargetData>, endpoint: Endpoint): Promise<string[]> {
        const name = this.derivedMetricName(target.query.expr);
        const ctx = endpoint.context?.context ?? null;
        const result = await this.state.pmApi.createDerived(target.query.url!, ctx, target.query.expr, name);
        if (result.success) {
            this.state.derivedMetrics.set(target.query.expr, name);
            return [name];
        }
        return [];
    }

    async registerTarget(target: PmapiTarget<VectorTargetData>, endpoint: Endpoint): Promise<string[]> {
        target.custom = {
            isDerivedMetric: this.isDerivedMetric(target.query.expr),
        };
        if (target.custom.isDerivedMetric) {
            const key = this.state.derivedMetrics.get(target.query.expr);
            if (key) {
                return [key];
            }
            return await this.registerDerivedMetric(target, endpoint);
        } else {
            return [target.query.expr];
        }
    }

    async redisBackfill(endpoint: Endpoint, targets: Array<PmapiTarget<VectorTargetData>>) {
        const series = endpoint.metrics
            .map(metric => ({
                series: metric.metadata.series,
                name: metric.metadata.name,
            }))
            .filter(metric => targets.some(target => target.metricNames.some(name => name === metric.name)))
            .map(({ series }) => series);
        const seekStart = this.state.retentionTimeMs / 1000;
        const [metricsResponse, seriesResponse, instancesResponse] = await Promise.all([
            this.state.pmSeriesApi.metrics({ series }) as Promise<SeriesMetricsItemResponse[]>,
            this.state.pmSeriesApi.values({
                series,
                interval: '1s',
                start: `-${seekStart}second`,
                finish: 'now',
            }),
            this.state.pmSeriesApi.instances({ series }),
        ]);
        const backfills = new Map<string, [Map<number, SeriesValuesItemResponse[]>, SeriesInstancesItemResponse[]]>();
        metricsResponse.forEach(({ series, name }) => {
            if (backfills.has(name)) {
                return;
            }
            const seriesForName = seriesResponse.filter(item => item.series === series);
            const instancesForName = instancesResponse.filter(item => item.series === series);
            const timedSeries = new Map<number, SeriesValuesItemResponse[]>();
            seriesForName.forEach(seriesItem => {
                if (timedSeries.has(seriesItem.timestamp)) {
                    timedSeries.get(seriesItem.timestamp)!.push(seriesItem);
                    return;
                }
                timedSeries.set(seriesItem.timestamp, [seriesItem]);
            });
            backfills.set(name, [timedSeries, instancesForName]);
        });
        backfills.forEach((values, key) => {
            const metricValues = endpoint.metricValues[key];
            if (metricValues === undefined) {
                return;
            }
            const [timedSeries, instances] = values;
            timedSeries.forEach((timedSeries, timestamp) => {
                const values = timedSeries.reduce((acc, item) => {
                    const instance = instances.find(instance => instance.instance === item.instance)?.id ?? null;
                    try {
                        const value = parseFloat(item.value);
                        return [...acc, { instance, value }];
                    } catch {}
                    return acc;
                }, []);
                metricValues.push({
                    timestampMs: timestamp,
                    values,
                });
            });
        });
    }

    async metricFindQuery(query: string, options?: any): Promise<MetricFindValue[]> {
        return await metricFindQuery(query);
    }

    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const refreshInterval = getDashboardRefreshInterval();
        if (refreshInterval) {
            this.state.poller.setRefreshInterval(refreshInterval);
        }

        const queries = buildQueries(
            request,
            defaultVectorQuery,
            this.instanceSettings.url,
            this.instanceSettings.jsonData.hostspec
        );
        const result = queries
            .map(query =>
                this.state.poller.query(query, request.range?.from.valueOf()!, request.range?.to.valueOf()!, 1)
            )
            .filter(result => result !== null) as QueryResult[];
        const data = processTargets(request, result);
        log.debug('query', request, queries, data);
        return { data };
    }

    async testDatasource() {
        return await testDatasource(
            this.state.pmApi,
            this.instanceSettings.url!,
            this.instanceSettings.jsonData.hostspec!
        );
    }
}
