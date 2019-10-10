import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
import EndpointRegistry, { Endpoint } from './endpoint_registry';
import PanelTransformations from './services/panel_transformation_srv';
import { PmapiSrv, Context } from "./services/pmapi_srv";
import { isBlank } from './utils';
import { Transformations } from './transformations';
import { QueryTarget, Query, PmapiQueryTarget } from './models/datasource';
import { TargetResult, MetricInstance } from './models/metrics';
import DashboardObserver from './dashboard_observer';
import "core-js/stable/array/flat";

export abstract class PmapiDatasourceBase<EP extends Endpoint> {

    name: string;
    withCredentials: boolean;
    headers: any;

    protected pollIntervalMs: number; // poll metric sources every X ms
    inactivityTimeoutMs: number; // we will keep polling a metric for up to X ms after it was last requested
    localHistoryAgeMs: number; // age out time

    endpointRegistry: EndpointRegistry<EP>;
    transformations: PanelTransformations;
    dashboardObserver: DashboardObserver<EP>;

    constructor(readonly instanceSettings: any, private backendSrv: any, private templateSrv: any) {
        this.name = instanceSettings.name;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = { 'Content-Type': 'application/json' };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }

        this.pollIntervalMs = kbn.interval_to_ms(instanceSettings.jsonData.pollInterval || '1s');
        this.inactivityTimeoutMs = kbn.interval_to_ms(instanceSettings.jsonData.inactivityTimeoutMs || '50s');
        this.localHistoryAgeMs = kbn.interval_to_ms(instanceSettings.jsonData.localHistoryAge || '10m');

        this.endpointRegistry = new EndpointRegistry();
        this.transformations = new PanelTransformations(this.templateSrv);
        this.dashboardObserver = new DashboardObserver(this.inactivityTimeoutMs);
        this.dashboardObserver.onTargetUpdate = this.onTargetUpdate.bind(this);
        this.dashboardObserver.onTargetInactive = this.onTargetInactive.bind(this);
    }

    configureEndpoint(_endpoint: EP) {
    }

    getOrCreateEndpoint(url: string, container: string | undefined) {
        let endpoint = this.endpointRegistry.find(url, container);
        if (!endpoint) {
            endpoint = this.endpointRegistry.create(this.doRequest.bind(this), url, container, this.localHistoryAgeMs);
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
        if (isBlank(this.instanceSettings.url))
            return { status: 'success', message: "To use this data source, please configure the URL in the query editor." };

        const pmapiSrv = new PmapiSrv(new Context(this.doRequest.bind(this), this.instanceSettings.url, this.instanceSettings.jsonData.container));
        try {
            await pmapiSrv.getMetricValues(["pmcd.hostname"]);
            return { status: 'success', message: "Data source is working" };
        }
        catch (error) {
            const errorText = error && error.statusText ? `Error: ${error.statusText}` : `Could not connect to ${this.instanceSettings.url}`;
            return {
                status: 'success',
                message: `${errorText}. To use this data source, ` +
                    "please configure the URL in the query editor."
            };
        }
    }

    /**
     * called by the templating engine (dashboard variables with type = query)
     */
    async metricFindQuery(query: string) {
        if (isBlank(this.instanceSettings.url))
            throw new Error("Please specify a connection URL in the datasource settings.");

        query = this.templateSrv.replace(query);
        const endpoint = this.getOrCreateEndpoint(this.instanceSettings.url, this.instanceSettings.jsonData.container);
        const response = await endpoint.pmapiSrv.getMetricValues([query]);
        return response.values[0].instances.map(instance => ({ text: instance.value, value: instance.value }));
    }

    getConnectionParams(target: QueryTarget, scopedVars: any): [string, string | undefined] {
        let url: string;
        let container: string | undefined;
        if (!isBlank(target.url))
            url = this.templateSrv.replace(target.url, scopedVars);
        else if (!isBlank(this.instanceSettings.url))
            url = this.instanceSettings.url;
        else
            throw new Error("Please specify a connection URL in the datasource settings or in the query editor.");

        if (!isBlank(target.container))
            container = this.templateSrv.replace(target.container, scopedVars);
        else if (!isBlank(this.instanceSettings.jsonData.container))
            container = this.instanceSettings.jsonData.container;

        return [url, container];
    }

    buildQueryTargets(query: Query): PmapiQueryTarget<EP>[] {
        return query.targets
            .filter(target => !target.hide && !isBlank(target.expr) && !target.isTyping)
            .map(target => {
                const [url, container] = this.getConnectionParams(target, query.scopedVars);
                return {
                    refId: target.refId,
                    expr: this.templateSrv.replace(target.expr.trim(), query.scopedVars),
                    format: target.format,
                    legendFormat: target.legendFormat,
                    uid: `${query.dashboardId}/${query.panelId}/${target.refId}`,
                    url: url,
                    container: container,
                    endpoint: this.getOrCreateEndpoint(url, container)
                };
            });
    }

    async applyTransformations(pmapiSrv: PmapiSrv, results: TargetResult) {
        for (const metric of results.metrics) {
            const metadata = await pmapiSrv.getMetricMetadata(metric.name);
            for (const instance of metric.instances) {
                instance.values = Transformations.applyTransformations(results.target.format, metadata, instance.values as any);
            }
        }
    }

    abstract async onTargetUpdate(prevValue: PmapiQueryTarget<EP>, newValue: PmapiQueryTarget<EP>): Promise<void>;
    abstract async onTargetInactive(target: PmapiQueryTarget<EP>): Promise<void>;
    abstract async handleTarget(query: Query, target: PmapiQueryTarget<EP>): Promise<TargetResult>;

    static defaultLegendFormatter(metric: string, instance: MetricInstance<number | string> | undefined, labels: Record<string, any>) {
        return instance && instance.id !== null ? instance.name : metric;
    }

    async queryTargetsByEndpoint(query: Query, targets: PmapiQueryTarget<EP>[]) {
        return await Promise.all(targets.map(target => this.handleTarget(query, target)));
    }

    async query(query: Query) {
        const targets = this.buildQueryTargets(query);
        if (targets.length === 0)
            return { data: [] };
        if (!_.every(targets, ['format', targets[0].format]))
            throw new Error("Format must be the same for all queries of a panel.");

        this.dashboardObserver.refresh(targets);
        const targetsPerEndpoint = _.groupBy(targets, target => target.endpoint!.id);
        const promises = Object.values(targetsPerEndpoint).map(targets => this.queryTargetsByEndpoint(query, targets));
        const targetResults = await Promise.all(promises);
        const panelData = this.transformations.transform(query, targetResults.flat(), PmapiDatasourceBase.defaultLegendFormatter);
        return { data: panelData };
    }
}
