import _ from 'lodash';
import Context from "./context";
import Poller from './poller';

export interface BPFtraceScript {
    // from PMDA
    readonly name: string;
    readonly vars: string[];
    status: string;
    exit_code: number | null;
    output: string;

    // additional properties by ScriptRegistry
    code: string;
    lastRequested: number;
}

export default class ScriptRegistry {

    // currently active (requested) scripts
    private scripts: Record<string, BPFtraceScript> = {}; // {name: BPFtraceScript}

    // a script which failed once will fail every time
    // store them in a separate object, otherwise the syncState()
    // will clean them (as they don't exist on the PMDA)
    // and the datasource will keep re-adding them
    private failedScripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

    constructor(private context: Context, private poller: Poller, private keepPollingMs: number) {
    }

    async ensureActive(code: string) {
        if (code in this.failedScripts) {
            return this.failedScripts[code];
        }

        const script: BPFtraceScript = _.find(Object.values(this.scripts), (script: BPFtraceScript) => script.code === code);
        if (!script || (script.status === "stopped" && script.exit_code == 0)) {
            // if script doesn't exist or script got stopped gracefully (exit_code == 0)
            // register script
            return await this.register(code);
        }
        else {
            script.lastRequested = new Date().getTime();
            return script;
        }
    }

    async register(code: string) {
        console.debug("registering script", code);

        // create temporary context, required so that the PMDA can identify
        // the client who sent the pmStore message
        const context = new Context(this.context.url);
        try {
            await context.store("bpftrace.control.register", code);
        }
        catch (error) {
            if (error.data && error.data.includes("-12400")) {
                // PMDA returned PM_ERR_BADSTORE
                // next fetch will show error reason
            }
            else {
                // other error
                throw error;
            }
        }
        const response = await context.fetch(["bpftrace.control.register"]);

        const script: BPFtraceScript = JSON.parse(response.values[0].instances[0].value);
        script.code = code;
        script.lastRequested = new Date().getTime();

        console.debug("bpftrace.control.register response", script);
        if (script.status === "stopped") {
            // script failed due to no variables found, invalid name etc.
            this.failedScripts[code] = script;
        }
        else {
            this.scripts[script.name] = script;
            // script has registered new metric names, fetch them
            await this.context.fetchMetricMetadata("bpftrace");
        }

        return script;
    }

    cleanupExpiredScripts() {
        // clean up any not required scripts
        // otherwise they get synced forever
        const scriptExpiry = new Date().getTime() - this.keepPollingMs;
        this.scripts = _.pickBy(this.scripts, (script: BPFtraceScript) => script.lastRequested > scriptExpiry);
    }

    async syncState() {
        if (_.isEmpty(this.scripts)) {
            return;
        }

        // sync available metrics on the PMDA
        await this.context.fetchMetricMetadata("bpftrace");

        let metrics: string[] = [];
        for (const script of Object.values(this.scripts)) {
            const state_metrics = [
                `bpftrace.scripts.${script.name}.status`,
                `bpftrace.scripts.${script.name}.exit_code`,
                `bpftrace.scripts.${script.name}.output`
            ];

            let found_all_metrics = true;
            for (const state_metric of state_metrics) {
                if (this.context.findMetricMetadata(state_metric))
                    metrics.push(state_metric);
                else
                    found_all_metrics = false;
            }

            // don't remove scripts which are currently starting and don't have their metrics registered yet
            if (!found_all_metrics && script.status !== "starting") {
                console.info(`script ${script.name} is missing on the PMDA ${script.status}`);
                const script_metrics = script.vars.map(var_ => `bpftrace.scripts.${script.name}.data.${var_}`);
                delete this.scripts[script.name];
                this.poller.removeMetricsFromPolling(script_metrics);
            }
        }

        if (metrics.length === 0)
            return;

        const response = await this.context.fetch(metrics);
        for (const metric of response.values) {
            const metric_split = metric.name.split('.');
            const script_name = metric_split[2];
            const metric_field = metric_split[3];

            const script = this.scripts[script_name];
            if (!script) {
                // script got removed by cleanupExpiredScripts()
                // while waiting for values from the PMDA
                continue;
            }
            else if (["status", "exit_code", "output"].includes(metric_field)) {
                script[metric_field] = metric.instances[0].value;
            }
        }
    }
}
