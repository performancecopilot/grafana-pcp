import _ from "lodash";
import kbn from "grafana/app/core/utils/kbn";
import { TargetFormat, PanelData } from "../lib/types";
import EndpointRegistry, { Endpoint } from "../lib/endpoint_registry";
import Transformations from "../lib/transformations";
import Context from "../lib/context";
import { synchronized, getConnectionParams } from "../lib/utils";

export class PcpLiveDatasource {

    name: string;
    withCredentials: boolean;
    headers: any;

    pollIntervalMs: number; // poll metric sources every X ms
    keepPollingMs: number; // we will keep polling a metric for up to X ms after it was last requested
    localHistoryAgeMs: number; // age out time

    endpointRegistry: EndpointRegistry<Endpoint>;
    transformations: Transformations;

    container_name_filter: any;

    /** @ngInject **/
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

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);

        const UUID_REGEX = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
        this.container_name_filter = name => true // name => name.match(UUID_REGEX)
    }

    doPollAll() {
        let promises: Promise<void>[] = [];
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.datastore.cleanExpiredMetrics();
            endpoint.poller.cleanupExpiredMetrics();
            promises.push(endpoint.poller.poll());
        }
        return Promise.all(promises);
    }

    @synchronized
    async getOrCreateEndpoint(target: any = {}) {
        const [url, container] = getConnectionParams(this.variableSrv, target, this.instanceSettings);
        let endpoint = this.endpointRegistry.find(url, container);
        if (!endpoint) {
            endpoint = this.endpointRegistry.create(url, container, this.keepPollingMs, this.localHistoryAgeMs);
            await endpoint.context.fetchMetricMetadata(); // TODO: where?
        }
        return endpoint;
    }

    async doRequest(options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return await this.backendSrv.datasourceRequest(options);
    }

    async testDatasource() {
        const [url, container] = getConnectionParams(this.variableSrv, {}, this.instanceSettings);
        const context = new Context(url, container);
        try {
            await context.createContext();
            return { status: 'success', message: "Data source is working", title: "Success" };
        }
        catch (error) {
            return {
                status: 'error',
                title: 'Additional configuration required',
                message: `Could not connect to ${url}. To use this data source, ` +
                    'please configure the url, and optionally the container dashboard variable(s).',
            }
        }
    }

    /**
     * called by the templating engine (dashboard variables with type = query)
     */
    async metricFindQuery(query) {
        let endpoint = await this.getOrCreateEndpoint();
        if (query === 'containers.name') {
            const metricsResponse = await endpoint.context.fetch(["containers.name"]);
            return metricsResponse.values[0].instances
                .map((instance: any) => instance.value)
                .filter(this.container_name_filter)
                .map((container: string) => ({ text: container, value: container }));
        }
        else {
            return [];
        }
    }

    async query(query: any) {
        const panelData: PanelData[] = [];
        for (const target of query.targets) {
            if (target.hide || (!target.expr && !target.target))
                continue;

            // TODO: remove me: workaround for old dashboards
            if (!target.expr)
                target.expr = target.target;
            if (!target.format && (target.type === "timeseries" || target.type === "timeserie"))
                target.format = "time_series";

            // TODO: allow templating
            const expr: string = target.expr.trim();
            if (expr.length === 0)
                continue;

            let endpoint = await this.getOrCreateEndpoint(target);
            try {
                //const parser = new Parser();
                //const expressions = parser.parse(expr);
                //const metricsToPoll = expressions.variables({ withMembers: true });

                let metricsToPoll: string[] = [];
                if (target.format === TargetFormat.Table) {
                    if (!_.every(query.targets, ['format', TargetFormat.Table]))
                        throw { message: "To use the table format, every query of this panel has to be in table format" };
                    // note: this ignores that the endpoint could be different for each query
                    metricsToPoll = query.targets.map((target: any) => target.expr);
                }
                else {
                    metricsToPoll = [expr];
                }

                endpoint.poller.ensurePolling(metricsToPoll);
                let queryResult = endpoint.datastore.queryMetrics(metricsToPoll, query.range.from.valueOf(), query.range.to.valueOf());
                panelData.push(...this.transformations.transform(queryResult, target));

                if (target.format === TargetFormat.Table) {
                    break;
                }
            }
            catch (error) {
                // catch all exceptions and add the refId of the panel
                error.refId = target.refId;
                throw error;
            }
        }

        return { data: panelData };
    }
}
