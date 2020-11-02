import { DataSourceInstanceSettings } from '@grafana/data';
import md5 from 'blueimp-md5';
import { VectorQuery, VectorOptions, VectorTargetData } from './types';
import { DatasourceBase } from 'datasources/lib/pmapi/datasource_base';
import { Poller } from 'datasources/lib/pmapi/poller/poller';
import { PmapiQuery, Target } from 'datasources/lib/pmapi/types';
import { Endpoint } from 'datasources/lib/pmapi/poller/types';
import {
    SeriesInstancesItemResponse,
    SeriesMetricsItemResponse,
    SeriesValuesItemResponse,
} from 'common/services/pmseries/types';
import { InstanceValue } from 'common/services/pmapi/types';
import { getLogger } from 'common/utils';
import { Config } from './config';
const log = getLogger('datasource');

export class DataSource extends DatasourceBase<VectorQuery, VectorOptions> {
    poller: Poller;
    derivedMetrics: Map<string, string>;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings, Config.defaults, Config.apiTimeoutMs);
        log.debug('initializate Vector datasource');
        this.poller = new Poller(this.pmApiService, this.pmSeriesApiService, {
            retentionTimeMs: this.retentionTimeMs,
            refreshIntervalMs: this.getDashboardRefreshInterval() ?? 1000,
            gracePeriodMs: Config.gracePeriodMs,
            hooks: {
                queryHasChanged: this.queryHasChanged,
                registerTarget: this.registerTarget.bind(this),
                redisBackfill: this.redisBackfill.bind(this),
            },
        });
        this.derivedMetrics = new Map<string, string>();

        document.addEventListener('visibilitychange', () => {
            this.poller.setPageVisibility(!document.hidden);
        });
    }

    queryHasChanged(prevQuery: PmapiQuery, newQuery: PmapiQuery) {
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

    async registerDerivedMetric(target: Target<VectorTargetData>, endpoint: Endpoint): Promise<string[]> {
        const name = this.derivedMetricName(target.query.expr);
        const context = endpoint.context?.context;
        const result = await this.pmApiService.derive(target.query.url!, {
            context,
            expr: target.query.expr,
            name,
        });
        if (result.success) {
            this.derivedMetrics.set(target.query.expr, name);
            return [name];
        }
        return [];
    }

    async registerTarget(target: Target<VectorTargetData>, endpoint: Endpoint): Promise<string[]> {
        target.custom = {
            isDerivedMetric: this.isDerivedMetric(target.query.expr),
        };
        if (target.custom.isDerivedMetric) {
            const key = this.derivedMetrics.get(target.query.expr);
            if (key) {
                return [key];
            }
            return await this.registerDerivedMetric(target, endpoint);
        } else {
            return [target.query.expr];
        }
    }

    async redisBackfill(endpoint: Endpoint, targets: Array<Target<VectorTargetData>>) {
        const series = endpoint.metrics
            .map(metric => ({
                series: metric.metadata.series,
                name: metric.metadata.name,
            }))
            .filter(metric => targets.some(target => target.metricNames.some(name => name === metric.name)))
            .map(({ series }) => series);
        if (series.length === 0) {
            return;
        }
        const seekStart = this.retentionTimeMs / 1000;
        const [metricsResponse, seriesResponse, instancesResponse] = await Promise.all([
            this.pmSeriesApiService.metrics({ series }) as Promise<SeriesMetricsItemResponse[]>,
            this.pmSeriesApiService.values({
                series,
                interval: '1s',
                start: `-${seekStart}second`,
                finish: 'now',
            }),
            this.pmSeriesApiService.instances({ series }),
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
            const metric = endpoint.metrics.find(metric => metric.metadata.name === key);
            if (metric === undefined) {
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
                }, [] as InstanceValue[]);
                metric.values.push({
                    timestampMs: timestamp,
                    values,
                });
            });
        });
    }
}
