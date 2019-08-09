import _ from 'lodash';
import { Context } from "../lib/pmapi";
import Poller from '../lib/poller';
import DataStore from '../lib/datastore';
import BPFtraceScript from './script';

export default class ScriptRegistry {

    // currently active (requested) scripts
    private scripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

    // a script which failed immediately will fail every time
    // reasons: no variable found, invalid name, ...
    private failedScripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

    constructor(private context: Context, private poller: Poller, private datastore: DataStore, private keepPollingMs: number) {
    }

    async ensureActive(code: string, allowRestart = true): Promise<BPFtraceScript> {
        if (code in this.failedScripts) {
            return this.failedScripts[code];
        }

        let script = this.scripts[code];
        if (!script) {
            script = await this.register(code);
            if (script.hasFailed()) {
                this.failedScripts[code] = script;
                return script;
            }
            else {
                this.scripts[code] = script;
            }
        }
        script.lastRequested = new Date().getTime();
        const controlMetrics = script.getControlMetrics();
        const validMetrics = await this.poller.ensurePolling(controlMetrics, false);

        // missing script metrics on the PMDA and script is not starting, register again
        if (validMetrics.length < controlMetrics.length && script.status !== "starting") {
            const missingMetrics = _.difference(controlMetrics, validMetrics);
            console.debug(`script ${script.name} got deregistered on the PMDA (missing metrics: ${missingMetrics.join(', ')})`);
            delete this.scripts[code];
            return allowRestart ? this.ensureActive(code, false) : script;
        }

        script.update(this.datastore);

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
        console.debug("registering script", code.split('\n'));

        // create temporary context, required so that the PMDA can identify
        // the client who sent the pmStore message
        const context = this.context.newInstance();
        try {
            await context.store("bpftrace.control.register", code);
        }
        catch (error) {
            if (_.isObject(error.data)) {
                if (error.data.message.includes("failed to lookup metric")) {
                    throw { message: "Please install the bpftrace PMDA to use this datasource." };
                }
                else if (error.data.message.includes("Bad input")) {
                    // PMDA returned PM_ERR_BADSTORE
                    // next fetch will show error reason from bpftrace PMDA
                }
                else {
                    throw { message: error.data.message };
                }
            }
            else {
                throw error;
            }
        }
        const response = await context.fetch(["bpftrace.control.register"]);

        const script = JSON.parse(response.values[0].instances[0].value);
        if (_.isEmpty(script))
            throw { message: "PMDA returned an empty response when registering this script." };

        console.debug("script register response", script);
        return new BPFtraceScript(script.name, script.vars, script.status, script.exit_code, script.output, code);
    }

    cleanupExpiredScripts() {
        // clean up any not required scripts
        const scriptExpiry = new Date().getTime() - this.keepPollingMs;
        this.scripts = _.pickBy(this.scripts, (script: BPFtraceScript) => script.lastRequested > scriptExpiry);
    }

}
