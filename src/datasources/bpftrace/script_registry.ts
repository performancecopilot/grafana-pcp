import _ from 'lodash';
import { PmapiSrv } from "../lib/services/pmapi_srv";
import PollSrv from '../lib/services/poll_srv';
import DataStore from '../lib/datastore';
import BPFtraceScript, { ScriptStatus } from './script';

export default class ScriptRegistry {

    // currently active (requested) scripts
    private scripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

    // a script which failed immediately will fail every time
    // reasons: no variable found, invalid name, ...
    private failedScripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

    constructor(private pmapiSrv: PmapiSrv, private pollSrv: PollSrv, private datastore: DataStore, private keepPollingMs: number) {
    }

    async register(code: string) {
        console.debug("registering script", code.split('\n'));

        // create temporary context, required so that the PMDA can identify
        // the client who sent the pmStore message
        const localPmapiSrv = new PmapiSrv(this.pmapiSrv.context.newInstance());
        try {
            await localPmapiSrv.storeMetricValue("bpftrace.control.register", code);
        }
        catch (error) {
            if (_.has(error, 'data.message')) {
                if (error.data.message.includes("failed to lookup metric")) {
                    throw new Error("Please install the bpftrace PMDA to use this datasource.");
                }
                else if (error.data.message.includes("Bad input")) {
                    // PMDA returned PM_ERR_BADSTORE
                    // next fetch will show error reason from bpftrace PMDA
                }
                else {
                    throw new Error(error.data.message);
                }
            }
            else {
                throw error;
            }
        }
        const response = await localPmapiSrv.getMetricValues(["bpftrace.control.register"]);

        const registerResponse = JSON.parse(response.values[0].instances[0].value as string);
        console.debug("script register response", registerResponse);
        if (_.isEmpty(registerResponse))
            throw new Error("PMDA returned an empty response when registering this script.");

        const script = new BPFtraceScript(registerResponse, code);
        if (script.hasFailed()) {
            this.failedScripts[code] = script;
        }
        else {
            this.scripts[code] = script;
            try {
                await this.pollSrv.ensurePolling(script.getControlMetrics());
            }
            catch (error) {
                // script just got registered, ignore missing metrics
                // re-throw on other errors
                if (!error.missingMetrics)
                    throw error;
            }
        }
        return script;
    }

    deregister(script: BPFtraceScript) {
        this.pollSrv.removeMetricsFromPolling(script.getControlMetrics());
        delete this.scripts[script.code];
    }

    async ensureActive(code: string): Promise<BPFtraceScript> {
        if (code in this.failedScripts) {
            return this.failedScripts[code];
        }

        const script = this.scripts[code];
        if (!script) {
            return await this.register(code);
        }

        script.lastRequested = new Date().getTime();
        try {
            await this.pollSrv.ensurePolling(script.getControlMetrics());
        }
        catch (error) {
            // missing script metrics on the PMDA, e.g. PMDA was restarted or script expired
            // pollSrv requested metric, pmproxy didn't include it in response, therefore PmApi removed
            // metric metadata from cache and ensurePolling requested it again, but pmproxy didn't return it => exception
            if (error.missingMetrics) {
                // script is not starting, register again
                if (script.status !== ScriptStatus.Starting) {
                    console.debug(`script ${script.name} got deregistered on the PMDA ` +
                        `(missing metrics: ${error.missingMetrics.join(', ')}), register it again...`);
                    this.deregister(script);
                    return await this.register(code);
                }
            }
            else {
                // other error, re-throw
                throw error;
            }
        }

        script.syncState(this.datastore);
        if (script.status === ScriptStatus.Stopped) {
            if (script.exit_code === 0) {
                console.debug(`script ${script.name} was stopped on the server, restarting...`);
                this.deregister(script);
                return await this.register(code);
            }
            else {
                // script failed, move to failed scripts
                console.debug(`script ${script.name} failed, moving to failedScripts`);
                this.deregister(script);
                this.failedScripts[code] = script;
            }
        }
        return script;
    }

    cleanupExpiredScripts() {
        const scriptExpiry = new Date().getTime() - this.keepPollingMs;
        this.scripts = _.pickBy(this.scripts, (script: BPFtraceScript) => script.lastRequested > scriptExpiry);
    }

}
