///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import Context from './context';
import EndpointRegistry from './endpoint_registry';
import { BPFtraceScript } from './script_registry';

// poll metric sources every X ms
const POLL_INTERVAL_MS = 1000
// script sync interval
const SCRIPT_SYNC_INTERVAL_MS = 2000
// we will keep polling a metric for up to X ms after it was last requested
const KEEP_POLLING_MS = 20000
// age out time
const OLDEST_DATA_MS = 5 * 60 * 1000

export type Datapoint = [number, number, number?];
export interface Target {
    target: string;
    datapoints: Datapoint[]
}

export enum TargetFormat {
    TimeSeries = "time_series",
    Table = "table",
    Heatmap = "heatmap",
}

export class PCPBPFtraceDatasource {

    name: string;
    url: string;
    q: any;
    backendSrv: any;
    templateSrv: any;
    variableSrv: any;
    withCredentials: boolean;
    headers: any;

    endpointRegistry: EndpointRegistry;

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

        Context.datasourceRequest = this.doRequest.bind(this);
        this.endpointRegistry = new EndpointRegistry();
        setInterval(this.doPollAll.bind(this), POLL_INTERVAL_MS);
        setInterval(this.syncScriptStates.bind(this), SCRIPT_SYNC_INTERVAL_MS);
    }

    doPollAll() {
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.datastore.cleanExpiredMetrics();
            endpoint.poller.cleanupExpiredMetrics();
            endpoint.poller.poll(); // poll() is async, but we don't wait for a result
        }
    }

    syncScriptStates() {
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.scriptRegistry.cleanupExpiredScripts();
            endpoint.scriptRegistry.syncState();
        }
    }

    async query(options: any) {
        const query = options;
        if (query.targets.length == 0) {
            return { data: [] };
        }

        if (this.templateSrv.getAdhocFilters) {
            query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
        } else {
            query.adhocFilters = [];
        }

        const vars = this.getVariables();

        // TODO: url of target => url variable of dashboard => url setting of datasource
        const data: Target[] = [];
        for (const target of query.targets) {
            if (target.hide)
                continue;

            let endpoint = this.endpointRegistry.find(this.url);
            if (!endpoint) {
                endpoint = this.endpointRegistry.create(this.url, null, KEEP_POLLING_MS, OLDEST_DATA_MS);
            }

            let script: BPFtraceScript;
            try {
                // ensureActive registers the script (if required)
                // need to wait for the promise to resolve, because the error
                // has to be returned in the query() promise to show up in the panel
                script = await endpoint.scriptRegistry.ensureActive(target.script);
            }
            catch (error) {
                this.handleError(error, target);
                continue;
            }

            if (script.status === "started" || script.status === "starting") {
                let metrics = script.vars.map(var_ => `bpftrace.scripts.${script.name}.data.${var_}`);
                endpoint.poller.ensurePolling(metrics);
                data.push(...endpoint.datastore.query(metrics, target.format, options.range.from.valueOf(), options.range.to.valueOf()));
            }
            else {
                this.handleError({ message: `BPFtrace error:\n\n${script.output}` }, target);
            }
        }

        return { data: data };
    }

    handleError(error: any, target: any) {
        error.refId = target.refId;
        throw error;
    }

    async testDatasource() {
        let context = new Context(this.url, null);
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
