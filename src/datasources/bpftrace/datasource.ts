///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import kbn from 'grafana/app/core/utils/kbn';
import Context from '../lib/context';
import EndpointRegistry from '../lib/endpoint_registry';
import ScriptRegistry, { BPFtraceScript } from './script_registry';
import Transformations from '../lib/transformations';
import BPFtraceEndpoint from './bpftrace_endpoint';
import { TargetFormat, PanelData } from '../lib/types';
import { getConnectionParams } from '../lib/utils';

export class PCPBPFtraceDatasource {

    name: string;
    withCredentials: boolean;
    headers: any;

    pollIntervalMs: number; // poll metric sources every X ms
    keepPollingMs: number; // we will keep polling a metric for up to X ms after it was last requested
    localHistoryAgeMs: number; // age out time

    endpointRegistry: EndpointRegistry<BPFtraceEndpoint>;
    transformations: Transformations;

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
    }

    doPollAll() {
        let promises: Promise<void>[] = [];
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.datastore.cleanExpiredMetrics();
            endpoint.poller.cleanupExpiredMetrics();
            endpoint.scriptRegistry.cleanupExpiredScripts();
            promises.push(endpoint.poller.poll());
        }
        return Promise.all(promises);
    }

    getOrCreateEndpoint(target: any) {
        const [url,] = getConnectionParams(this.variableSrv, target, this.instanceSettings);
        let endpoint = this.endpointRegistry.find(url);
        if (!endpoint) {
            endpoint = this.endpointRegistry.create(url, undefined, this.keepPollingMs, this.localHistoryAgeMs);
            endpoint.scriptRegistry = new ScriptRegistry(endpoint.context, endpoint.poller, endpoint.datastore, this.keepPollingMs);
        }
        return endpoint;
    }

    async doRequest(options: any) {
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
                message: `Cannot connect to ${context.url}`,
                title: 'Error',
            };
        }
    }

    async metricFindQuery(query: any) {
        return [];
    }

    private async getMetricNameForMetricType(context: Context, script: BPFtraceScript, metrictype: string) {
        for (const var_ of script.vars) {
            const metric = `bpftrace.scripts.${script.name}.data.${var_}`;
            const metricMetadata = await context.metricMetadata(metric);
            if (metricMetadata && metricMetadata.labels && metricMetadata.labels.metrictype === metrictype)
                return metric;
        }
        return null;
    }

    private async getMetricNamesForTarget(context: Context, target: any, script: BPFtraceScript) {
        if (target.format === TargetFormat.TimeSeries) {
            return script.vars.map(var_ => `bpftrace.scripts.${script.name}.data.${var_}`);
        }
        else if (target.format === TargetFormat.Heatmap) {
            const metric = await this.getMetricNameForMetricType(context, script, "histogram");
            if (metric)
                return [metric];
            else
                throw { message: "Cannot find any histogram in this BPFtrace script." };
        }
        else if (target.format === TargetFormat.Table) {
            const metric = await this.getMetricNameForMetricType(context, script, "output");
            if (metric)
                return [metric];
            else
                throw { message: "Table format is only supported with printf() BPFtrace scripts." };
        }
        return [];
    }

    async query(query: any) {
        const panelData: PanelData[] = [];
        for (const target of query.targets) {
            if (target.hide || !target.code || target.isTyping)
                continue;

            // TODO: allow templating of bpftrace script code?
            // possible clashes of grafana templating syntax with bpftrace syntax
            const code = target.code.trim();
            if (code.length === 0)
                continue;

            let endpoint = this.getOrCreateEndpoint(target);
            let script: BPFtraceScript;
            try {
                // ensureActive registers the script (if required)
                // register is async
                script = await endpoint.scriptRegistry.ensureActive(code);

                if (script.status === "started" || script.status === "starting") {
                    const metrics = await this.getMetricNamesForTarget(endpoint.context, target, script);
                    endpoint.poller.ensurePolling(metrics);

                    let result = endpoint.datastore.queryMetrics(metrics, query.range.from.valueOf(), query.range.to.valueOf());
                    panelData.push(...this.transformations.transform(result, target));
                }
                else {
                    throw { message: `BPFtrace error:\n\n${script.output}` };
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
