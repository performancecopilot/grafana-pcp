import _ from 'lodash';
import { PmapiSrv, MissingMetricsError } from "../lib/services/pmapi_srv";
import PollSrv from '../lib/services/poll_srv';
import DataStore from '../lib/datastore';
import BPFtraceScript, { ScriptStatus } from './script';

export default class ScriptRegistry {

    private scripts: Record<string, BPFtraceScript> = {}; // {code: BPFtraceScript}

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
            if (error instanceof MissingMetricsError)
                throw new Error("Please install the bpftrace PMDA to use this datasource.");
            else
                throw error;
        }
        return await localPmapiSrv.getMetricValues([metric]);
    }

    async register(code: string) {
        console.debug("registering script", code.split('\n'));
        const response = await this.storeControlMetric("bpftrace.control.register", code);
        const registerResponse = JSON.parse(response.values[0].instances[0].value as string);
        console.debug("script register response", registerResponse);
        if (_.isEmpty(registerResponse))
            throw new Error("PMDA returned an empty response when registering this script.");

        return new BPFtraceScript(registerResponse, code);
    }

    async deregister(script: BPFtraceScript) {
        console.debug("deregistering script", script);
        this.pollSrv.removeMetricsFromPolling(script.getControlMetrics());
        delete this.scripts[script.code];

        const response = await this.storeControlMetric("bpftrace.control.deregister", script.name);
        const deregisterResponse = JSON.parse(response.values[0].instances[0].value as string);
        console.debug("script deregister response", deregisterResponse);
    }

    getScript(code: string) {
        return this.scripts[code];
    }

    async ensureActive(code: string): Promise<BPFtraceScript> {
        let script = this.scripts[code];
        const isExistingScript = !!script;
        if (!isExistingScript) {
            script = await this.register(code);
            this.scripts[code] = script;
        }

        if (script.hasFailed())
            return script;

        try {
            await this.pollSrv.ensurePolling(script.getControlMetrics());
        }
        catch (error) {
            // missing script metrics on the PMDA, e.g. PMDA was restarted or script expired
            // pollSrv requested metric, pmproxy didn't include it in response, therefore PmApi removed
            // metric metadata from cache and ensurePolling requested it again, but pmproxy didn't return it => exception
            if (error instanceof MissingMetricsError) {
                if (script.status === ScriptStatus.Starting) {
                    // ignore error
                }
                else {
                    // some control metric is missing, register script again
                    console.debug(`script ${script.name} got deregistered on the PMDA ` +
                        `(missing metrics: ${error.metrics.join(', ')}), register it again...`);
                    await this.deregister(script);
                    return await this.register(code);
                }
            }
            else {
                // other error, re-throw
                throw error;
            }
        }

        // if the script got registered in this function call,
        // don't sync state as we didn't poll the state yet
        if (isExistingScript) {
            script.syncState(this.datastore);
        }

        if (script.status === ScriptStatus.Stopped) {
            if (script.exit_code === 0) {
                console.debug(`script ${script.name} was stopped on the server, restarting...`);
                return await this.register(code);
            }
            else {
                console.debug(`script ${script.name} failed`);
                await this.deregister(script);
            }
        }
        return script;
    }

}
