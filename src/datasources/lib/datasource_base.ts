///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
import EndpointRegistry, { Endpoint } from './endpoint_registry';
import { QueryTarget, Query, TargetResult, TargetFormat } from './types';
import PanelTransformations from './panel_transformations';
import { Context } from "./pmapi";
import { isBlank } from './utils';
import "core-js/stable/array/flat";

export abstract class PCPLiveDatasourceBase<EP extends Endpoint> {

    name: string;
    withCredentials: boolean;
    headers: any;

    protected pollIntervalMs: number; // poll metric sources every X ms
    keepPollingMs: number; // we will keep polling a metric for up to X ms after it was last requested
    localHistoryAgeMs: number; // age out time

    endpointRegistry: EndpointRegistry<EP>;
    transformations: PanelTransformations;

    constructor(readonly instanceSettings: any, private backendSrv: any, private templateSrv: any, private variableSrv: any) {
        this.name = instanceSettings.name;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = { 'Content-Type': 'application/json' };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }

        this.pollIntervalMs = kbn.interval_to_ms(instanceSettings.jsonData.pollInterval || '1s');
        this.keepPollingMs = kbn.interval_to_ms(instanceSettings.jsonData.keepPolling || '20s');
        this.localHistoryAgeMs = kbn.interval_to_ms(instanceSettings.jsonData.localHistoryAge || '5m');

        this.endpointRegistry = new EndpointRegistry();
        this.transformations = new PanelTransformations(this.templateSrv);
    }

    configureEndpoint(_endpoint: EP) {
    }

    getOrCreateEndpoint(url: string, container: string | undefined) {
        let endpoint = this.endpointRegistry.find(url, container);
        if (!endpoint) {
            endpoint = this.endpointRegistry.create(this.doRequest.bind(this), url, container, this.keepPollingMs, this.localHistoryAgeMs);
            this.configureEndpoint(endpoint);
        }
        return endpoint;
    }

    async doRequest(options: any) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return await this.backendSrv.datasourceRequest(options);
    }

    async testDatasource() {
        const context = new Context(this.instanceSettings.url, this.instanceSettings.jsonData.container);
        try {
            await context.createContext();
            return { status: 'success', title: "Success", message: "Data source is working" };
        }
        catch (error) {
            return {
                status: 'success',
                title: "Additional configuration required",
                message: `Could not connect to ${this.instanceSettings.url}. To use this data source, ` +
                    'please configure the url and optionally the container in the query editor.',
            };
        }
    }

    /**
     * called by the templating engine (dashboard variables with type = query)
     */
    async metricFindQuery(query: string) {
        let endpoint = this.getOrCreateEndpoint(this.instanceSettings.url, this.instanceSettings.jsonData.container);
        const metricsResponse = await endpoint.context.fetch([query]);
        return metricsResponse.values[0].instances
            .map((instance: any) => ({ text: instance.value, value: instance.value }));
    }

    buildQueryTargets(query: Query): QueryTarget[] {
        return query.targets
            .filter(target => !target.hide && (!isBlank(target.expr) || !isBlank(target.target)) && !target.isTyping)
            .map(target => {
                // TODO: remove me: workaround for old dashboards
                if (!target.expr)
                    target.expr = target.target!;
                if (!target.format && (target.type === "timeseries" || target.type === "timeserie"))
                    target.format = TargetFormat.TimeSeries;

                let url: string;
                let container: string | undefined;
                if (!isBlank(target.url))
                    url = this.templateSrv.replace(target.url, query.scopedVars);
                else if (!isBlank(this.instanceSettings.url))
                    url = this.instanceSettings.url;
                else
                    throw { message: "Please specify a connection URL in the datasource settings or in the query editor." };

                if (!isBlank(target.container))
                    container = this.templateSrv.replace(target.container, query.scopedVars);
                else if (!isBlank(this.instanceSettings.jsonData.container))
                    container = this.instanceSettings.jsonData.container;

                return {
                    refId: target.refId,
                    expr: this.templateSrv.replace(target.expr.trim(), query.scopedVars),
                    format: target.format,
                    legendFormat: target.legendFormat,
                    url: url,
                    container: container,
                    endpoint: this.getOrCreateEndpoint(url, container)
                };
            });
    }

    abstract async handleTarget(endpoint: EP, query: Query, target: QueryTarget<EP>): Promise<TargetResult>;

    async queryTargetsByEndpoint(query: Query, targets: QueryTarget<EP>[]) {
        // endpoint is the same for all targets, ensured by _.groupBy() in query()
        const endpoint = targets[0].endpoint;
        const targetResults = await Promise.all(targets.map(target => this.handleTarget(endpoint!, query, target)));
        return this.transformations.transform(query, targetResults);
    }

    async query(query: Query) {
        const targets = this.buildQueryTargets(query);
        if (targets.length === 0)
            return { data: [] };
        if (!_.every(targets, ['format', targets[0].format]))
            throw { message: "Format must be the same for all queries of a panel." };

        const targetsPerEndpoint = _.groupBy(targets, (target: any) => target.endpoint.id) as { [key: string]: QueryTarget<EP>[] };
        const promises = Object.values(targetsPerEndpoint).map(targets => this.queryTargetsByEndpoint(query, targets));
        const results = await Promise.all(promises);
        return { data: results.flat() };
    }
}
