import _ from 'lodash';
import { PmapiSrv, MissingMetricsError, PermissionError } from "../lib/services/pmapi_srv";
import PollSrv from '../lib/services/poll_srv';
import { Script, MetricType, Status } from './script';
import { TargetFormat } from '../lib/models/datasource';
import { MetricValues } from '../lib/models/pmapi';

export default class ScriptRegistry {

    private scripts: Record<string, Script> = {}; // scripts[script_id] = script
    private targetToScriptId: Record<string, string> = {}; // targetToScriptId[target_id] = script_id

    constructor(private pmapiSrv: PmapiSrv, private pollSrv: PollSrv) {
    }

    getMetric(script: Script, varName: string) {
        const scriptIdOrName = script.metadata.name || script.script_id;
        varName = varName.substring(1) || "root";
        return `bpftrace.scripts.${scriptIdOrName}.data.${varName}`;
    }

    getVariablesForTargetFormat(script: Script, format: TargetFormat) {
        if (format === TargetFormat.TimeSeries) {
            return Object.keys(script.variables);
        }
        else if (format === TargetFormat.Heatmap) {
            const foundVar = Object.entries(script.variables).find(([_varName, varDef]) => varDef.metrictype === MetricType.Histogram);
            if (!foundVar)
                throw new Error("Cannot find any histogram in this BPFtrace script.");
            return [foundVar[0]];
        }
        else if (format === TargetFormat.Table) {
            const foundVar = Object.entries(script.variables).find(([_varName, varDef]) => varDef.metrictype === MetricType.Output);
            if (!foundVar)
                throw new Error("Please printf() a table in CSV format in the BPFtrace script.");
            return [foundVar[0]];
        }
        else if (format === TargetFormat.FlameGraph) {
            const foundVar = Object.entries(script.variables).find(([_varName, varDef]) => varDef.metrictype === MetricType.Stacks);
            if (!foundVar)
                throw new Error("Cannot find any sampled stacks in this BPFtrace script. Try: profile:hz:99 { @[kstack] = count(); }");
            return [foundVar[0]];
        }
        throw new Error("Unsupported panel format.");
    }

    getMetrics(script: Script, format: TargetFormat) {
        return this.getVariablesForTargetFormat(script, format).map(varName => this.getMetric(script, varName));
    }

    async storeControlMetric(metric: string, value: string) {
        // create temporary context, required so that the PMDA can identify
        // the client who sent the pmStore message
        const localPmapiSrv = new PmapiSrv(this.pmapiSrv.context.newInstance());
        try {
            await localPmapiSrv.storeMetricValue(metric, value);
        }
        catch (error) {
            if (error instanceof PermissionError)
                throw new Error("You don't have permission to register bpftrace scripts. " +
                    "Please check the datasource authentication settings and the bpftrace PMDA configuration (bpftrace.conf).");
            else
                throw error;
        }

        const response = await localPmapiSrv.getMetricValues([metric]);
        return JSON.parse(response.values[0].instances[0].value as string);
    }

    async register(code: string): Promise<Script> {
        console.debug("registering script", code.split('\n'));
        const response = await this.storeControlMetric("bpftrace.control.register", code);
        console.debug("script register response", response);
        if (_.isEmpty(response))
            throw new Error("PMDA returned an empty response when registering this script.");
        return response;
    }

    async deregister(uid: string) {
        const scriptId = this.targetToScriptId[uid];
        if (!scriptId)
            return;

        delete this.targetToScriptId[uid];
        const script = this.scripts[scriptId];
        if (!script)
            return;

        delete this.scripts[scriptId];
        console.debug("deregistering script", script);
        this.pollSrv.removeMetricsFromPolling(Object.keys(script.variables).map(varName => this.getMetric(script, varName)));
        const response = await this.storeControlMetric("bpftrace.control.deregister", script.script_id);
        console.debug("script deregister response", response);
    }

    deregisterAllScripts() {
        const activeScriptIds = Object.values(this.targetToScriptId);
        this.pmapiSrv.storeBeacon("bpftrace.control.deregister", activeScriptIds.join(","));
    }

    syncScripts(metric: MetricValues) {
        if (metric.instances.length > 0) {
            const scriptsList = JSON.parse(metric.instances[0].value as string);
            this.scripts = _.keyBy(scriptsList, 'script_id');
        }
        return false;
    }

    async ensureActive(uid: string, code: string): Promise<Script> {
        try {
            await this.pollSrv.ensurePolling(["bpftrace.info.scripts_json"], this.syncScripts.bind(this));
        }
        catch (error) {
            if (error instanceof MissingMetricsError)
                throw new Error("Please install the bpftrace PMDA to use this datasource.");
            else
                throw error;
        }

        const scriptId = this.targetToScriptId[uid];
        // we can have a targetuid -> scriptId mapping, but due to a PMDA restart
        // the script doesn't exist anymore -> register again
        let script = scriptId ? this.scripts[scriptId] : null;
        if (!script) {
            script = await this.register(code);
            this.scripts[script.script_id] = script;
            this.targetToScriptId[uid] = script.script_id;
        }

        if (script.state.status === Status.Stopped) {
            const response = await this.storeControlMetric("bpftrace.control.start", script.script_id);
            console.debug(`restarted script ${script.script_id}, response:`, response);
            script.state.status = Status.Starting;
        }

        return script;
    }

}
