import _ from 'lodash';
import { PmapiSrv, MissingMetricsError, PermissionError } from "../lib/services/pmapi_srv";
import PollSrv from '../lib/services/poll_srv';
import DataStore from '../lib/datastore';
import { Script, MetricType, Status } from './script';
import { MetricInstance } from '../lib/models/metrics';
import { TargetFormat } from '../lib/models/datasource';

export default class ScriptRegistry {

    private scripts: Record<string, Script> = {}; // scripts[script_id] = script
    private targetToScriptId: Record<string, string> = {}; // targetToScriptId[target_id] = script_id

    constructor(private pmapiSrv: PmapiSrv, private pollSrv: PollSrv, private datastore: DataStore) {
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
        const script = this.scripts[scriptId];
        if (!script)
            return;

        console.debug("deregistering script", script);
        this.pollSrv.removeMetricsFromPolling(this.getAllDataMetrics(script));

        const response = await this.storeControlMetric("bpftrace.control.deregister", script.script_id);
        console.debug("script deregister response", response);
    }

    syncScripts() {
        const queryResult = this.datastore.queryMetric("bpftrace.info.scripts_json", 0, Infinity);
        if (queryResult.length === 0 || queryResult[0].values.length === 0)
            return;

        const values = (queryResult[0] as MetricInstance<string>).values;
        // when using pmproxy, datastore doesn't retain old values of metrics
        // with agent=bpftrace, metrictype=control
        // however, with pmwebd, it does retain old values
        const scriptsList = JSON.parse(values[values.length - 1][0]);
        this.scripts = _.keyBy(scriptsList, 'script_id');
    }

    private getDataMetric(script: Script, varName: string) {
        const scriptIdOrName = script.metadata.name || script.script_id;
        varName = varName.substring(1) || "root";
        return `bpftrace.scripts.${scriptIdOrName}.data.${varName}`;
    }

    getAllDataMetrics(script: Script) {
        return Object.keys(script.variables).map(varName => this.getDataMetric(script, varName));
    }

    private findMetricForMetricType(script: Script, metrictype: MetricType) {
        if (Object.keys(script.variables).length === 1)
            return this.getDataMetric(script, Object.keys(script.variables)[0]);
        for (const [varName, varDef] of Object.entries(script.variables)) {
            if (varDef.metrictype === metrictype)
                return this.getDataMetric(script, varName);
        }
        return null;
    }

    getDataMetrics(script: Script, format: TargetFormat) {
        if (format === TargetFormat.TimeSeries) {
            return this.getAllDataMetrics(script);
        }
        else if (format === TargetFormat.Heatmap) {
            const metric = this.findMetricForMetricType(script, MetricType.Histogram);
            if (!metric)
                throw new Error("Cannot find any histogram in this BPFtrace script.");
            return [metric];
        }
        else if (format === TargetFormat.Table) {
            const metric = this.findMetricForMetricType(script, MetricType.Output);
            if (!metric)
                throw new Error("Please printf() a table in CSV format in the BPFtrace script.");
            return [metric];
        }
        else if (format === TargetFormat.FlameGraph) {
            const metric = this.findMetricForMetricType(script, MetricType.Stacks);
            if (!metric)
                throw new Error("Cannot find any sampled stacks in this BPFtrace script. Try: profile:hz:99 { @[kstack] = count(); }");
            return [metric];
        }
        throw new Error("Unsupported panel format.");
    }

    async ensureActive(uid: string, code: string): Promise<Script> {
        try {
            await this.pollSrv.ensurePolling(["bpftrace.info.scripts_json"]);
        }
        catch (error) {
            if (error instanceof MissingMetricsError)
                throw new Error("Please install the bpftrace PMDA to use this datasource.");
            else
                throw error;
        }

        this.syncScripts(); // todo: only call once per json fetch

        const scriptId = this.targetToScriptId[uid];
        let script: Script;
        if (!scriptId) {
            script = await this.register(code);
            this.scripts[script.script_id] = script;
            this.targetToScriptId[uid] = script.script_id;
        }
        else {
            script = this.scripts[scriptId];
            if (!script) {
                script = await this.register(code);
                this.scripts[script.script_id] = script;
                this.targetToScriptId[uid] = script.script_id;
            }
        }

        if (script.state.status === Status.Stopped) {
            const response = await this.storeControlMetric("bpftrace.control.start", script.script_id);
            console.debug(`restarted script ${script.script_id}, response:`, response);
            script.state.status = Status.Starting;
        }

        return script;
    }

}
