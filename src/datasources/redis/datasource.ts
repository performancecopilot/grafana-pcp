import _ from 'lodash';
import { isBlank, getAdHocFilters } from '../lib/utils';
import { PmSeriesSrv } from './pmseries_srv';
import PanelTransformations from '../lib/services/panel_transformation_srv';
import { ValueTransformationSrv } from '../lib/services/value_transformation_srv';
import { Query, QueryTarget, TDatapoint } from '../lib/models/datasource';
import { TargetResult, Metric, MetricInstance, Labels } from '../lib/models/metrics';
import { MetricValue } from './models/pmseries';
import { NetworkError } from '../lib/models/errors';
import "core-js/stable/array/flat";
import { AdHocFilter, DashboardVariableFilterOperator } from '../lib/models/variables';

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
        metricNames: Record<string, string>,
        descriptions: any, labels: Record<string, Labels>, target: QueryTarget): Promise<TargetResult> {
        const metrics: Metric<number | string>[] = [];

        for (const series in instancesValuesGroupedBySeries) {
            const metricInstances: MetricInstance<number | string>[] = [];
            // for metrics with no indoms, instanceId should be null
            // however, javascript objects convert keys to strings,
            // so let's use "" here and change it back later
            const instanceValuesGroupedBySeriesAndInstance = _.groupBy(instancesValuesGroupedBySeries[series], i => i.instance || "");

            for (const _instanceId in instanceValuesGroupedBySeriesAndInstance) {
                const instanceId = _instanceId === "" ? null : _instanceId;

                const datapoints = instanceValuesGroupedBySeriesAndInstance[_instanceId].map(
                    instance => [parseFloat(instance.value), instance.timestamp] as TDatapoint
                );

                let instanceName = "";
                if (instanceId !== null) {
                    const instance = await this.pmSeriesSrv.getInstance(series, instanceId);
                    if (instance)
                        instanceName = instance.name;
                }

                metricInstances.push({
                    id: instanceId,
                    name: instanceName,
                    values: ValueTransformationSrv.applyTransformations(target.format, descriptions[series].semantics,
                        descriptions[series].units, datapoints),
                    labels: instanceId !== null ? labels[instanceId] : labels[series]
                });
            }

            metrics.push({
                name: metricNames[series],
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

    async getTagKeys() {
        const result = await this.pmSeriesSrv.getLabelNames();
        const keys = result.map(x => ({
            type: 'string',
            text: x
        }));
        return keys;
    }

    async getTagValues(option: any) {
        const result = await this.pmSeriesSrv.getLabelValues([option.key]);
        const values = result[option.key].map(x => ({ text: x }));
        return values;
    }

    addAdHocFiltersToExpr(expr: string, filters: AdHocFilter[]) {
        if (filters.length === 0) {
            return expr;
        }
        const openingBracketIndex = expr.indexOf('{');
        const hasMetadata = openingBracketIndex !== -1;
        const filterCount = filters.length;
        const adHocFilterStr = filters.reduce((previousValue, filter, index) => {
            const modifiedOperator = filter.operator === DashboardVariableFilterOperator.Equals ? '==' : filter.operator;
            const comma = index !== filterCount - 1 ? ',' : '';
            const isNumericValue = !isNaN(parseFloat(filter.value)) && isFinite(+filter.value);
            const formattedValue = isNumericValue ? filter.value : `"${filter.value}"`;
            return `${previousValue}${filter.key}${modifiedOperator}${formattedValue}${comma}`;
        }, '');
        let newExpr;
        if (hasMetadata) {
            const appendPoint = openingBracketIndex + 1;
            newExpr = `${expr.substring(0, appendPoint)}${adHocFilterStr},${expr.substring(appendPoint)}`;
        } else {
            newExpr = `${expr}{${adHocFilterStr}}`;
        }
        return newExpr;
    }

    async query(query: Query) {
        const targets = this.buildQueryTargets(query);
        if (targets.length === 0)
            return { data: [] };
        if (!_.every(targets, ['format', targets[0].format]))
            throw new Error("Format must be the same for all queries of a panel.");
        const datasourceName = this.name;
        const variables = this.templateSrv.variables;
        const adHocFilters = getAdHocFilters(datasourceName, variables);
        const exprs = targets.map(target => target.expr);
        const exprsWithAdHocFiltersApplied = exprs.map(expr => this.addAdHocFiltersToExpr(expr, adHocFilters));
        const series = await Promise.all(exprsWithAdHocFiltersApplied.map(expr => this.pmSeriesSrv.query(expr)));
        const seriesByExpr = _.zipObject(exprs, series);
        const seriesList = series.flat();
        for (const expr in seriesByExpr) {
            if (seriesByExpr[expr].length === 0) {
                throw new Error(`Could not find any series for ${expr}`);
            }
        }

        const interval = query.intervalMs / 1000; // seconds
        // request a bigger time frame to fill the chart (otherwise left and right border of chart is empty)
        // because of the rate conversation of counters first datapoint is "lost" -> expand timeframe at the beginning
        const additionalTimeRange = Math.max(interval, 60); // 60s is the default sample interval of pmlogger
        const start = Math.floor(query.range.from.valueOf() / 1000 - 2 * additionalTimeRange); // seconds
        const finish = Math.ceil(query.range.to.valueOf() / 1000 + additionalTimeRange); // seconds

        const instances = await this.pmSeriesSrv.getValues(seriesList, { start, finish, interval });
        const descriptions = await this.pmSeriesSrv.getDescriptions(seriesList);
        const metricNames = await this.pmSeriesSrv.getMetricNames(seriesList);
        const instanceValuesGroupedBySeries = _.groupBy(instances, "series");
        const labels = await this.pmSeriesSrv.getMetricAndInstanceLabels(seriesList);
        const targetResults = await Promise.all(targets.map(target => this.handleTarget(
            _.pick(instanceValuesGroupedBySeries, seriesByExpr[target.expr]), metricNames, descriptions, labels, target
        )));
        const panelData = this.transformations.transform(query, targetResults, PCPRedisDatasource.defaultLegendFormatter);
        return {
            data: panelData
        };
    }

}
