import _ from 'lodash';
import Context from "../lib/context";
import Poller from '../lib/poller';
import DataStore from '../lib/datastore';

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
    private scripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

    // a script which failed immediately will fail every time
    // reasons: no variable found, invalid name, ...
    private failedScripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

    constructor(private context: Context, private poller: Poller, private datastore: DataStore, private keepPollingMs: number) {
    }

    hasScriptFailed(script: BPFtraceScript) {
        return script.status === "stopped" && script.exit_code !== 0;
    }

    async ensureActive(code: string, allowRestart: boolean = true) {
        if (code in this.failedScripts) {
            return this.failedScripts[code];
        }

        let script = this.scripts[code];
        if (!script) {
            script = await this.register(code);
            if (this.hasScriptFailed(script)) {
                this.failedScripts[code] = script;
                return script;
            }
            else {
                this.scripts[code] = script;
            }
        }
        script.lastRequested = new Date().getTime();
        const controlMetrics = [
            `bpftrace.scripts.${script.name}.status`,
            `bpftrace.scripts.${script.name}.exit_code`,
            `bpftrace.scripts.${script.name}.output`
        ];
        const validMetrics = await this.poller.ensurePolling(controlMetrics, false);

        // missing script metrics on the PMDA and script is not starting, register again
        if (validMetrics.length < controlMetrics.length && script.status !== "starting") {
            const missingMetrics = _.difference(controlMetrics, validMetrics);
            console.debug(`script ${script.name} got deregistered on the PMDA (missing metrics: ${missingMetrics.join(',')})`);
            delete this.scripts[code];
            return allowRestart ? this.ensureActive(code, false) : script;
        }

        const queryResult = this.datastore.queryMetrics(controlMetrics, 0, Infinity);
        for (const metric of queryResult) {
            if (metric.instances.length > 0 && metric.instances[0].datapoints.length > 0) {
                const metric_field = metric.name.substring(metric.name.lastIndexOf('.') + 1);
                script[metric_field] = metric.instances[0].datapoints[0][0];
            }
        }

        if (script.status === "stopped") {
            if (script.exit_code === 0) {
                console.debug(`script ${script.name} was stopped on the server, restarting...`);
                delete this.scripts[code];
                return allowRestart ? this.ensureActive(code, false) : script;
            }
            else {
                // script failed, move to failed scripts
                console.debug(`script ${script.name} failed, moving to failedScripts`);
                this.poller.removeMetricsFromPolling(controlMetrics);
                delete this.scripts[code];
                this.failedScripts[code] = script;
            }
        }
        return script;
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
                error.message = error.data ? error.data : "unknown error";
                throw error;
            }
        }
        const response = await context.fetch(["bpftrace.control.register"]);

        const script: BPFtraceScript = JSON.parse(response.values[0].instances[0].value);
        if (_.isEmpty(script))
            throw { message: "PMDA returned an empty response when registering this script." };
        script.code = code;

        console.debug("script register response", script);
        return script;
    }

    cleanupExpiredScripts() {
        // clean up any not required scripts
        const scriptExpiry = new Date().getTime() - this.keepPollingMs;
        this.scripts = _.pickBy(this.scripts, (script: BPFtraceScript) => script.lastRequested > scriptExpiry);
    }

}
