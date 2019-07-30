///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
import EndpointRegistry, { Endpoint } from './endpoint_registry';
import { QueryTarget, Query, TargetResult, TargetFormat } from './types';
import Transformations from './transformations';
import Context from './context';
import { getDashboardVariables, isBlank } from './utils';
import "core-js/stable/array/flat";

export abstract class PcpLiveDatasourceBase<EP extends Endpoint> {

    name: string;
    withCredentials: boolean;
    headers: any;

    protected pollIntervalMs: number; // poll metric sources every X ms
    keepPollingMs: number; // we will keep polling a metric for up to X ms after it was last requested
    localHistoryAgeMs: number; // age out time

    endpointRegistry: EndpointRegistry<EP>;
    transformations: Transformations;

    constructor(private instanceSettings: any, private backendSrv: any, private templateSrv: any, private variableSrv: any) {
        this.name = instanceSettings.name;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = { 'Content-Type': 'application/json' };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }

        this.pollIntervalMs = kbn.interval_to_ms(instanceSettings.jsonData.pollInterval || '1s');
        this.keepPollingMs = kbn.interval_to_ms(instanceSettings.jsonData.keepPolling || '20s');
        this.localHistoryAgeMs = kbn.interval_to_ms(instanceSettings.jsonData.localHistoryAge || '5m');

        Context.datasourceRequest = this.doRequest.bind(this);
        this.endpointRegistry = new EndpointRegistry();
        this.transformations = new Transformations(this.templateSrv);
    }

    getConnectionParams(variableSrv: any, target: any, instanceSettings: any): [string, string?] {
        const dashboardVariables = getDashboardVariables(variableSrv);
        let url: string = "";
        let container: string | undefined;

        if (!isBlank(target.url))
            url = target.url;
        else if (dashboardVariables.url && !isBlank(dashboardVariables.url.value))
            url = dashboardVariables.url.value;
        else if (!isBlank(instanceSettings.url))
            url = instanceSettings.url;
        else
            throw { message: "Cannot find any connection url." };

        if (!isBlank(target.container))
            container = target.container;
        else if (dashboardVariables.container && !isBlank(dashboardVariables.container.value))
            container = dashboardVariables.container.value;
        else if (!isBlank(instanceSettings.container))
            container = instanceSettings.container;

        return [url, container];
    }

    configureEndpoint(_endpoint: EP) {
    }

    getOrCreateEndpoint(target: any = {}) {
        const [url, container] = this.getConnectionParams(this.variableSrv, target, this.instanceSettings);
        let endpoint = this.endpointRegistry.find(url, container);
        if (!endpoint) {
            endpoint = this.endpointRegistry.create(url, container, this.keepPollingMs, this.localHistoryAgeMs);
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
        const [url, container] = this.getConnectionParams(this.variableSrv, {}, this.instanceSettings);
        const context = new Context(url, container);
        try {
            await context.createContext();
            return { status: 'success', title: "Success", message: "Data source is working" };
        }
        catch (error) {
            return {
                status: 'error',
                title: "Additional configuration required",
                message: `Could not connect to ${url}. To use this data source, ` +
                    'please configure the url, and optionally the container dashboard variable(s).',
            };
        }
    }

    /**
     * called by the templating engine (dashboard variables with type = query)
     */
    async metricFindQuery(query: string) {
        let endpoint = this.getOrCreateEndpoint();
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

                return {
                    refId: target.refId,
                    expr: this.templateSrv.replace(target.expr.trim(), query.scopedVars),
                    format: target.format,
                    legendFormat: target.legendFormat,
                    endpoint: this.getOrCreateEndpoint(target)
                };
            });
    }

    abstract async handleTarget(endpoint: EP, query: Query, target: QueryTarget<EP>): Promise<TargetResult>;

    async queryTargetsByEndpoint(query: Query, targets: QueryTarget<EP>[]) {
        // endpoint is the same for all targets, ensured by _.groupBy() in query()
        const endpoint = targets[0].endpoint;
        const targetResults = await Promise.all(targets.map(target => this.handleTarget(endpoint!, query, target)));
        return this.transformations.transform(targetResults);
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
