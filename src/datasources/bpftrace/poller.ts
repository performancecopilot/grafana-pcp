import _ from 'lodash';
import PCPContext from "./PCPContext";
import DataStore from './datastore';

// poll metric sources every X ms
const POLL_INTERVAL_MS = 1000
// we will keep polling a metric for up to X ms after it was last requested
const KEEP_POLLING_MS = 20000
// age out time
const OLDEST_DATA_MS = 5*60*1000

class ContextPoller {
    readonly scriptMetricNames: Record<string, string> = {}; // {bpftrace_script: pcp_metric_name}
    private requestedMetrics: Record<string, number> = {}; // {metric: lastRequested}

    constructor(readonly context: PCPContext) {
    }

    async registerScript(script: string) {
        await this.context.store("bpftrace.control.register", script);
        const response = await this.context.fetch(["bpftrace.control.register"]);
        const registerResponse = JSON.parse(response.values[0].instances[0].value);
        console.log("registered", script, "as", registerResponse.metrics[0]);
        return registerResponse.metrics[0];
    }

    async ensurePolling(script: string) {
        let scriptMetricName = this.scriptMetricNames[script];
        if (!scriptMetricName) {
            scriptMetricName = await this.registerScript(script);
            this.scriptMetricNames[script] = scriptMetricName;
        }
        this.requestedMetrics[scriptMetricName] = new Date().getTime()
        return scriptMetricName;
    }

    async poll() {
        return await this.context.fetch(Object.keys(this.requestedMetrics), true);
    }

    cleanStaleMetrics() {
        // clean up any not required metrics before we poll
        const pollExpiry = new Date().getTime() - KEEP_POLLING_MS
        this.requestedMetrics = _.pickBy(this.requestedMetrics, lastRequested => lastRequested > pollExpiry)
    }
}

export default class Poller {

    readonly contextPollers: Record<string, ContextPoller> = {};

    constructor(readonly datastore: DataStore) {
        setInterval(this.doPollAll.bind(this), POLL_INTERVAL_MS)
    }

    doPollAll() {
        for(const contextPoller of Object.values(this.contextPollers)) {
            contextPoller.cleanStaleMetrics();
            contextPoller.poll().then((data) => this.datastore.ingest(contextPoller.context.url, data));
        }

        this.datastore.cleanExpiredMetrics();
    }

    async ensurePolling(url: string, script: string) {
        let contextPoller = this.contextPollers[url];
        if (!contextPoller) {
            contextPoller = new ContextPoller(new PCPContext(url));
            this.contextPollers[url] = contextPoller;
        }
        return await contextPoller.ensurePolling(script);
    }
}