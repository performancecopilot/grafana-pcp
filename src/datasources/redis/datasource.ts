import _ from 'lodash';
import { isBlank } from '../lib/utils';
import { PmSeriesSrv } from './pmseries_srv';
import PanelTransformations from '../lib/services/panel_transformation_srv';
import { ValueTransformationSrv } from '../lib/services/value_transformation_srv';
import { Query, QueryTarget, TDatapoint } from '../lib/models/datasource';
import { TargetResult, Metric, MetricInstance } from '../lib/models/metrics';
import { MetricValue } from './models/pmseries';
import { NetworkError } from '../lib/models/errors';

export class PCPRedisDatasource {

    name: string;
    withCredentials: boolean;
    headers: any;
    transformations: PanelTransformations;
    pmSeriesSrv: PmSeriesSrv;

    /* @ngInject */
    constructor(readonly instanceSettings: any, private backendSrv: any, private templateSrv: any) {
        this.name = instanceSettings.name;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = { 'Content-Type': 'application/json' };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }

        this.transformations = new PanelTransformations(this.templateSrv);
        this.pmSeriesSrv = new PmSeriesSrv(this.doRequest.bind(this), this.instanceSettings.url);
    }

    async doRequest(options: any) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        try {
            return await this.backendSrv.datasourceRequest(options);
        }
        catch (error) {
            throw new NetworkError(error);
        }
    }

    async testDatasource() {
        if (isBlank(this.instanceSettings.url))
            return { status: 'error', message: "Please specify a URL in the datasource settings." };

        try {
            const response = await this.pmSeriesSrv.ping();
            if (response.status !== 200) {
                throw { message: "Invalid response code returned from datasource" };
            }
            return { status: 'success', message: "Data source is working" };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }

    async metricFindQuery(query: string) {
        query = this.templateSrv.replace(query);

        const metricNamesRegex = /^metrics\(([a-zA-Z0-9._*]*)\)$/;
        const labelValuesRegex = /^label_values\(([a-zA-Z][a-zA-Z0-9._]*),\s*(\S+)\)$/;

        const metricNamesQuery = query.match(metricNamesRegex);
        if (metricNamesQuery) {
            const pattern = metricNamesQuery[1] === "" ? "*" : metricNamesQuery[1];
            const metrics = await this.pmSeriesSrv.getMetrics(pattern);
            return metrics.map(metric => ({ text: metric, value: metric }));
        }

        const labelValuesQuery = query.match(labelValuesRegex);
        if (labelValuesQuery) {
            const [, metric, label] = labelValuesQuery;
            const qualifiers = await this.pmSeriesSrv.getQualifiers(metric);
            return (qualifiers[label] || []).map(labelValue => ({ text: labelValue, value: labelValue }));
        }

        return [];
    }

    buildQueryTargets(query: Query): QueryTarget[] {
        return query.targets
            .filter(target => !target.hide && !isBlank(target.expr) && !target.isTyping)
            .map(target => {
                return {
                    refId: target.refId,
                    expr: this.templateSrv.replace(target.expr.trim(), query.scopedVars),
                    format: target.format,
                    legendFormat: target.legendFormat
                };
            });
    }

    async handleTarget(instancesValuesGroupedBySeries: Record<string, MetricValue[]>,
        descriptions: any, labels: any, target: QueryTarget): Promise<TargetResult> {
        const metrics: Metric<number | string>[] = [];

        for (const series in instancesValuesGroupedBySeries) {
            const metricInstances: MetricInstance<number | string>[] = [];
            const instanceValuesGroupedBySeriesAndInstance = _.groupBy(instancesValuesGroupedBySeries[series], i => i.instance || "");

            for (const instanceId in instanceValuesGroupedBySeriesAndInstance) {
                const datapoints = instanceValuesGroupedBySeriesAndInstance[instanceId].map(
                    instance => [parseFloat(instance.value), instance.timestamp] as TDatapoint
                );

                let instanceName = "";
                if (instanceId !== "") {
                    const instance = await this.pmSeriesSrv.getInstance(series, instanceId);
                    if (instance)
                        instanceName = instance.name;
                }

                metricInstances.push({
                    id: instanceId,
                    name: instanceName,
                    values: ValueTransformationSrv.applyTransformations(target.format, descriptions[series].semantics,
                        descriptions[series].units, datapoints),
                    labels: instanceId !== "" ? labels[instanceId] : labels[series]
                });
            }

            metrics.push({
                name: target.expr, // TODO: metric, not expression
                instances: metricInstances
            });
        }

        return {
            target: target,
            metrics: metrics
        };
    }

    static defaultLegendFormatter(metric: string, instance: MetricInstance<number | string> | undefined, labels: Record<string, any>) {
        let label = instance && instance.id !== null ? instance.name : metric;
        if (!_.isEmpty(labels)) {
            const pairs: string[] = [];
            for (const label of ["hostname", "source"]) {
                if (label in labels) {
                    pairs.push(`${label}: "${labels[label]}"`);
                }
            }
            if (pairs.length > 0)
                label += ` {${pairs.join(", ")}}`;
        }
        return label;
    }

    async query(query: Query) {
        const targets = this.buildQueryTargets(query);
        if (targets.length === 0)
            return { data: [] };
        if (!_.every(targets, ['format', targets[0].format]))
            throw new Error("Format must be the same for all queries of a panel.");

        const exprs = targets.map(target => target.expr);
        const series = await Promise.all(exprs.map(expr => this.pmSeriesSrv.query(expr)));
        const seriesByExpr = _.zipObject(exprs, series);
        const seriesList = series.flat();

        for (const expr in seriesByExpr) {
            if (seriesByExpr[expr].length === 0) {
                throw new Error(`Could not find any series for ${expr}`);
            }
        }

        const sampleIntervalSec = 10; // guessed sample interval
        // request a bigger time frame to fill the chart (otherwise left and right border of chart is empty)
        // because of the rate conversation of counters first datapoint is "lost" -> expand timeframe at the beginning
        const start = Math.round(query.range.from.valueOf() / 1000) - 2 * sampleIntervalSec;
        const finish = Math.round(query.range.to.valueOf() / 1000) + sampleIntervalSec;
        const samples = Math.round((query.range.to.valueOf() - query.range.from.valueOf()) / query.intervalMs);
        // const interval = query.interval;

        const instances = await this.pmSeriesSrv.getValues(seriesList, { start, finish, samples });
        const descriptions = await this.pmSeriesSrv.getDescriptions(seriesList);
        const instanceValuesGroupedBySeries = _.groupBy(instances, "series");
        const labels = this.pmSeriesSrv.getMetricAndInstanceLabels(seriesList);
        const targetResults = await Promise.all(targets.map(target => this.handleTarget(
            _.pick(instanceValuesGroupedBySeries, seriesByExpr[target.expr]), descriptions, labels, target
        )));
        const panelData = this.transformations.transform(query, targetResults, PCPRedisDatasource.defaultLegendFormatter);
        return {
            data: panelData
        };
    }

}
