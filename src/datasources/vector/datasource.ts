import { DataSourceInstanceSettings } from '@grafana/data';
import md5 from 'blueimp-md5';
import { VectorQuery, VectorOptions, VectorTargetData } from './types';
import { DataSourceBase } from 'datasources/lib/pmapi/datasource_base';
import { Poller } from 'datasources/lib/pmapi/poller/poller';
import { PmapiQuery, Target } from 'datasources/lib/pmapi/types';
import { Endpoint, InstanceValuesSnapshot, Metric } from 'datasources/lib/pmapi/poller/types';
import { SeriesId, SeriesLabelsItemResponse } from 'common/services/pmseries/types';
import { getLogger } from 'common/utils';
import { Config } from './config';
import { Dict } from 'common/types/utils';
import { InstanceId } from 'common/services/pmapi/types';
import { keyBy } from 'lodash';
const log = getLogger('datasource');

export class PCPVectorDataSource extends DataSourceBase<VectorQuery, VectorOptions> {
    poller: Poller;
    derivedMetrics: Map<string, string>;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings, Config.defaults, Config.apiTimeoutMs);
        log.debug('initializate Vector datasource');
        this.poller = new Poller(this.pmApiService, this.pmSeriesApiService, {
            retentionTimeMs: this.retentionTimeMs,
            refreshIntervalMs: this.getDashboardRefreshInterval() ?? Config.defaultRefreshIntervalMs,
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
        const metricNames = new Set(targets.flatMap(target => target.metricNames));

        // split into series (metrics) with and without instance domains
        const seriesWithoutIndom: string[] = [];
        const seriesWithIndom: string[] = [];
        // multiple series can point to the same metric
        const seriesToMetric: Dict<SeriesId, Metric> = {};
        for (const metric of endpoint.metrics) {
            if (metricNames.has(metric.metadata.name)) {
                if (metric.metadata.indom) {
                    seriesWithIndom.push(metric.metadata.series);
                } else {
                    seriesWithoutIndom.push(metric.metadata.series);
                }
                seriesToMetric[metric.metadata.series] = metric;
            }
        }

        // get metric values and instances
        const seekStart = this.retentionTimeMs / 1000;
        const [values, instancesResponse] = await Promise.all([
            this.pmSeriesApiService.values({
                series: [...seriesWithoutIndom, ...seriesWithIndom],
                interval: '1s',
                start: `-${seekStart}second`,
                finish: 'now',
            }),
            seriesWithIndom.length > 0
                ? this.pmSeriesApiService.instances({ series: seriesWithIndom })
                : Promise.resolve([]),
        ]);

        // get instance labels
        let instanceLabels: Dict<string, SeriesLabelsItemResponse> = {};
        if (seriesWithIndom.length > 0) {
            const labelsResponse = (await this.pmSeriesApiService.labels({
                series: instancesResponse.map(instance => instance.instance),
            })) as SeriesLabelsItemResponse[];
            instanceLabels = keyBy(labelsResponse, 'series');
        }

        // fill instanceDomain data structure of poller
        const seriesInstanceToInstanceId: Dict<string, InstanceId> = {};
        for (const instance of instancesResponse) {
            seriesInstanceToInstanceId[instance.instance] = instance.id;

            const metric = seriesToMetric[instance.series]!;
            metric.instanceDomain!.instances[instance.id] = {
                name: instance.name,
                instance: instance.id,
                labels: instanceLabels[instance.instance]?.labels || {},
            };
        }

        // make sure values are sorted series < timestamp
        values.sort((a, b) => {
            if (a.series !== b.series) {
                return a.series < b.series ? -1 : a.series > b.series ? 1 : 0;
            }
            return a.timestamp - b.timestamp;
        });

        // backfill metric values into poller datastructure
        for (let i = 0; i < values.length; ) {
            const curSeries = values[i].series;
            while (i < values.length && values[i].series === curSeries) {
                const curSnapshot: InstanceValuesSnapshot = {
                    timestampMs: values[i].timestamp,
                    values: [],
                };

                // if the timestamp significantly changed from the previous read one, consider it a new measurement
                for (
                    ;
                    i < values.length &&
                    values[i].series === curSeries &&
                    Math.abs(values[i].timestamp - curSnapshot.timestampMs) < 0.1;
                    i++
                ) {
                    const instanceId = values[i].instance ? seriesInstanceToInstanceId[values[i].instance!]! : null;
                    curSnapshot.values.push({ instance: instanceId, value: parseFloat(values[i].value) });
                }

                seriesToMetric[curSeries]!.values.push(curSnapshot);
            }
        }
    }
}
