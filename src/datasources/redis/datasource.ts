///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import { Query, QueryTarget, ValuesTransformationFn } from '../lib/types';
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

    /** @ngInject **/
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
        try {
            const response = await this.pmSeries.ping();
            if (response.status !== 200) {
                throw { message: "err" };
            }
            return { status: 'success', title: 'Success', message: 'Data source is working' };
        }
        catch (error) {
            const errorText = error && error.statusText ? error.statusText : `Could not connect to ${this.instanceSettings.url}`;
            return {
                status: 'error',
                title: 'Error',
                message: 'PCP Data source is not working: ' + errorText
            };
        }
    }

    async metricFindQuery(query: string) {
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

    async query(query: Query) {
        const targets = this.buildQueryTargets(query);
        if (targets.length === 0)
            return { data: [] };
        if (!_.every(targets, ['format', targets[0].format]))
            throw { message: "Format must be the same for all queries of a panel." };

        let tzparam = "UTC";
        if (query.timezone == "browser")
            tzparam = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const exprs = targets.map(target => target.expr);
        let series = await Promise.all(exprs.map(this.pmSeries.query.bind(this.pmSeries)));
        let seriesByExpr = _.zipObject(exprs, series);

        for (const expr in seriesByExpr) {
            if (seriesByExpr[expr].length === 0) {
                throw { message: `Could not find series for ${expr}` };
            }
        }

        const start = Math.round(query.range.from.valueOf() / 1000);
        const finish = Math.round(query.range.to.valueOf() / 1000);
        const samples = Math.round((query.range.to.valueOf() - query.range.from.valueOf()) / query.intervalMs);
        const interval = query.interval;
        const mdp = query.maxDataPoints; // TODO: not supported in pmproxy?

        const instances = await this.pmSeries.values(series.flat(), { start, finish, samples, interval, tzparam }, true);
        const descriptions = await this.pmSeries.descs(series.flat());
        const targetResults = targets.map(target => {
            let series = seriesByExpr[target.expr];
            // filter all instances to include only series of this expr
            const instancesForTarget = instances.filter((instance: any) => series.includes(instance.series));
            const instancesGroupedByName = _.groupBy(instancesForTarget, "instanceName");

            let transformations: ValuesTransformationFn[] = [];
            if (descriptions[series[0]].semantics === "counter")
                transformations.push(ValuesTransformations.counter);

            return {
                target: target,
                metrics: [{
                    name: target.expr,
                    instances: _.map(instancesGroupedByName, (instances: any[], instanceName: string) => ({
                        name: instanceName,
                        values: ValuesTransformations.applyTransformations(
                            transformations,
                            instances.map((instance: any) => [parseFloat(instance.value), parseInt(instance.timestamp)])
                        )
                    }))
                }]
            };
        });

        const panelData = this.transformations.transform(query, targetResults);
        return {
            data: panelData
        };
    }

}
