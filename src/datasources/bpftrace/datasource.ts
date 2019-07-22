///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import Context from '../lib/context';
import EndpointRegistry from '../lib/endpoint_registry';
import ScriptRegistry, { BPFtraceScript } from './script_registry';
import Transformations from '../lib/transformations';
import BPFtraceEndpoint from './bpftrace_endpoint';
import { TargetFormat, PanelData } from '../lib/types';

export class PCPBPFtraceDatasource {

    name: string;
    url: string;
    q: any;
    backendSrv: any;
    templateSrv: any;
    variableSrv: any;
    withCredentials: boolean;
    headers: any;

    pollIntervalMs: number; // poll metric sources every X ms
    scriptSyncIntervalMs: number; // // script sync interval
    keepPollingMs: number; // we will keep polling a metric for up to X ms after it was last requested
    olderstDataMs: number; // age out time

    endpointRegistry: EndpointRegistry<BPFtraceEndpoint>;
    transformations: Transformations;

    /** @ngInject **/
    constructor(instanceSettings, $q, backendSrv, templateSrv, variableSrv) {
        this.name = instanceSettings.name;
        this.url = instanceSettings.url;
        this.q = $q;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.variableSrv = variableSrv;
        this.withCredentials = instanceSettings.withCredentials;
        this.headers = { 'Content-Type': 'application/json' };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }


        this.pollIntervalMs = instanceSettings.jsonData.pollIntervalMs || 1000;
        this.scriptSyncIntervalMs = instanceSettings.jsonData.scriptSyncIntervalMs || 2000;
        this.keepPollingMs = instanceSettings.jsonData.keepPollingMs || 20000;
        this.olderstDataMs = instanceSettings.jsonData.olderstDataMs || 5 * 60 * 1000;

        Context.datasourceRequest = this.doRequest.bind(this);
        this.endpointRegistry = new EndpointRegistry();
        this.transformations = new Transformations(this.templateSrv);

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);
        if (this.scriptSyncIntervalMs > 0)
            setInterval(this.syncScriptStates.bind(this), this.scriptSyncIntervalMs);
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

    syncScriptStates() {
        let promises: Promise<void>[] = [];
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.scriptRegistry.cleanupExpiredScripts();
            promises.push(endpoint.scriptRegistry.syncState());
        }
        return Promise.all(promises);
    }

    getMetricNameForMetricType(context: Context, script: BPFtraceScript, metrictype: string) {
        for (const var_ of script.vars) {
            const metric = `bpftrace.scripts.${script.name}.data.${var_}`;
            const metricMetadata = context.findMetricMetadata(metric);
            if (metricMetadata && metricMetadata.labels && metricMetadata.labels.metrictype === metrictype)
                return metric;
        }
        return null;
    }

    getMetricNamesForTarget(context: Context, target: any, script: BPFtraceScript) {
        if (target.format === TargetFormat.TimeSeries) {
            return script.vars.map(var_ => `bpftrace.scripts.${script.name}.data.${var_}`);
        }
        else if (target.format === TargetFormat.Heatmap) {
            const metric = this.getMetricNameForMetricType(context, script, "histogram");
            if (metric)
                return [metric];
            else
                throw { message: "Cannot find any histogram in this BPFtrace script." };
        }
        else if (target.format === TargetFormat.Table) {
            const metric = this.getMetricNameForMetricType(context, script, "output");
            if (metric)
                return [metric];
            else
                throw { message: "Table format is only supported with printf() BPFtrace scripts." };
        }
        return [];
    }

    async query(options: any) {
        const query = options;
        if (query.targets.length == 0) {
            return { data: [] };
        }

        const dashboardVariables = this.getVariables();
        const panelData: PanelData[] = [];
        for (const target of query.targets) {
            if (target.hide || !target.code)
                continue;

            // TODO: allow templating of bpftrace script code?
            // possible clashes of grafana templating syntax with bpftrace syntax
            const code = target.code.trim();
            if (code.length === 0)
                continue;

            // TODO: also allow overriding of url in query editor
            let url: string;
            if (dashboardVariables.url && dashboardVariables.url.value.length > 0)
                url = dashboardVariables.url.value;
            else
                url = this.url;

            let endpoint = this.endpointRegistry.find(url);
            if (!endpoint) {
                endpoint = this.endpointRegistry.create(url, null, this.keepPollingMs, this.olderstDataMs);
                endpoint.scriptRegistry = new ScriptRegistry(endpoint.context, endpoint.poller, this.keepPollingMs);
            }

            let script: BPFtraceScript;
            try {
                // ensureActive registers the script (if required)
                // register is async
                script = await endpoint.scriptRegistry.ensureActive(code);

                if (script.status === "started" || script.status === "starting") {
                    const metrics = this.getMetricNamesForTarget(endpoint.context, target, script);
                    endpoint.poller.ensurePolling(metrics);

                    let result = endpoint.datastore.queryMetrics(metrics, options.range.from.valueOf(), options.range.to.valueOf());
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

    async testDatasource() {
        let context = new Context(this.url);
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

    async metricFindQuery(query) {
        return [];
    }

    async doRequest(options: any) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;

        return await this.backendSrv.datasourceRequest(options);
    }

    getVariables(): any {
        const variables = {};
        if (!this.variableSrv.variables) {
            // variables are not defined on the datasource settings page
            return {};
        }

        for (let variable of this.variableSrv.variables) {
            let variableValue = variable.current.value;
            if (variableValue === '$__all' || _.isEqual(variableValue, ['$__all'])) {
                if (variable.allValue === null) {
                    variableValue = variable.options.slice(1).map(textValuePair => textValuePair.value);
                } else {
                    variableValue = variable.allValue;
                }
            }

            variables[variable.name] = {
                text: variable.current.text,
                value: variableValue,
            };
        }

        return variables;
    }
}
