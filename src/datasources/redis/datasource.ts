import _ from 'lodash';
import { Query, QueryTarget, TDatapoint, Metric, MetricInstance } from '../lib/types';
import { isBlank } from '../lib/utils';
import { PmSeries } from './pmseries';
import PanelTransformations from '../lib/panel_transformations';
import { ValuesTransformations } from '../lib/transformations';

export class PCPRedisDatasource {

    name: string;
    withCredentials: boolean;
    headers: any;
    transformations: PanelTransformations;
    pmSeries: PmSeries;

    /* @ngInject */
    constructor(readonly instanceSettings: any, private backendSrv: any, private templateSrv: any, private variableSrv: any) {
        this.name = instanceSettings.name;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = { 'Content-Type': 'application/json' };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }

        this.transformations = new PanelTransformations(this.templateSrv);
        this.pmSeries = new PmSeries(this.doRequest.bind(this), this.instanceSettings.url);
    }

    async doRequest(options: any) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return await this.backendSrv.datasourceRequest(options);
    }

    async testDatasource() {
        if (isBlank(this.instanceSettings.url))
            return { status: 'error', message: "Please specify a URL in the datasource settings." };

        try {
            const response = await this.pmSeries.ping();
            if (response.status !== 200) {
                throw { statusText: "Invalid response code" };
            }
            return { status: 'success', message: "Data source is working" };
        }
        catch (error) {
            return {
                status: 'error',
                message: error && error.statusText ? `Error: ${error.statusText}` : `Could not connect to ${this.instanceSettings.url}`
            };
        }
    }

    async getLabelValues(metric: string, labelName: string) {
        const seriesList = await this.pmSeries.query(metric);
        if (seriesList.length === 0) {
            throw { message: `Could not find any series for ${metric}` };
        }

        const descriptions = await this.pmSeries.descs(seriesList);
        const [seriesWithIndoms, seriesWithoutIndoms] = _.partition(seriesList, series => descriptions[series].indom !== "none");
        let instanceIds: string[] = [];
        if (seriesWithIndoms.length > 0) {
            const instances = await this.pmSeries.instances(seriesWithIndoms);
            instanceIds = Object.values(instances).flatMap(Object.keys);
        }

        const labels = await this.pmSeries.labels([...seriesWithoutIndoms, ...instanceIds]);
        const values: string[] = [];
        for (const label of Object.values(labels)) {
            const value = label[labelName];
            if (value && !values.includes(value))
                values.push(value);
        }
        return values;
    }

    async metricFindQuery(query: string) {
        query = this.templateSrv.replace(query);

        const metricNamesRegex = /^metrics\(([a-zA-Z0-9._*]*)\)$/;
        const labelValuesRegex = /^label_values\(([a-zA-Z][a-zA-Z0-9._]*),\s*(\S+)\)$/;

        const metricNamesQuery = query.match(metricNamesRegex);
        if (metricNamesQuery) {
            const pattern = metricNamesQuery[1] === "" ? "*" : metricNamesQuery[1];
            const metrics = await this.pmSeries.metrics(pattern);
            return metrics.map(metric => ({ text: metric, value: metric }));
        }

        const labelValuesQuery = query.match(labelValuesRegex);
        if (labelValuesQuery) {
            const labelValues = await this.getLabelValues(labelValuesQuery[1], labelValuesQuery[2]);
            return labelValues.map(labelValue => ({ text: labelValue, value: labelValue }));
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

    handleTarget(instancesGroupedBySeries: Record<string, any>, descriptions: any, labels: any, target: QueryTarget) {
        const metrics: Metric<number | string>[] = [];

        for (const series in instancesGroupedBySeries) {
            const seriesInstances: MetricInstance<number | string>[] = [];
            const instancesGroupedBySeriesAndName = _.groupBy(instancesGroupedBySeries[series], "instanceName");
            for (const instanceName in instancesGroupedBySeriesAndName) {
                // collection is grouped by instanceName, i.e. all items are of the same instance id
                const instanceId = instancesGroupedBySeriesAndName[instanceName][0].instance;
                const datapoints = instancesGroupedBySeriesAndName[instanceName].map(
                    (instance: any) => [parseFloat(instance.value), parseInt(instance.timestamp, 10)] as TDatapoint
                );
                seriesInstances.push({
                    name: instanceName,
                    values: ValuesTransformations.applyTransformations(descriptions[series].semantics, descriptions[series].units, datapoints),
                    metadata: instanceId ? labels[instanceId] : labels[series]
                });
            }

            metrics.push({
                name: target.expr,
                instances: seriesInstances
            });
        }

        return {
            target: target,
            metrics: metrics
        };
    }

    async query(query: Query) {
        const targets = this.buildQueryTargets(query);
        if (targets.length === 0)
            return { data: [] };
        if (!_.every(targets, ['format', targets[0].format]))
            throw { message: "Format must be the same for all queries of a panel." };

        const exprs = targets.map(target => target.expr);
        const series = await Promise.all(exprs.map(expr => this.pmSeries.query(expr)));
        const seriesByExpr = _.zipObject(exprs, series);
        const seriesList = series.flat();

        for (const expr in seriesByExpr) {
            if (seriesByExpr[expr].length === 0) {
                throw { message: `Could not find any series for ${expr}` };
            }
        }

        const start = Math.round(query.range.from.valueOf() / 1000);
        const finish = Math.round(query.range.to.valueOf() / 1000);
        const samples = Math.round((query.range.to.valueOf() - query.range.from.valueOf()) / query.intervalMs);
        const interval = query.interval;
        const zone = query.timezone === "browser" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

        const instances = await this.pmSeries.values(seriesList, { start, finish, samples, interval, zone }, true);
        const seriesWithLabels = seriesList.flatMap(series => {
            const instanceIds = this.pmSeries.instancesOfSeries(series);
            return instanceIds.length > 0 ? instanceIds : [series];
        });
        const [descriptions, labels] = await Promise.all([this.pmSeries.descs(seriesList), this.pmSeries.labels(seriesWithLabels)]);
        const instancesGroupedBySeries = _.groupBy(instances, "series");
        const targetResults = targets.map(target => this.handleTarget(
            _.pick(instancesGroupedBySeries, seriesByExpr[target.expr]), descriptions, labels, target
        ));
        const panelData = this.transformations.transform(query, targetResults);
        return {
            data: panelData
        };
    }

}
