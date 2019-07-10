import _ from 'lodash';
import Context from "./context";
import DataStore from "./datastore";
import ScriptRegistry from "./script_registry";

// poll metric sources every X ms
const POLL_INTERVAL_MS = 1000 * 10
// we will keep polling a metric for up to X ms after it was last requested
const KEEP_POLLING_MS = 20000
// age out time
const OLDEST_DATA_MS = 5 * 60 * 1000

export class Endpoint {
    context: Context;
    scriptRegistry: ScriptRegistry;
    datastore: DataStore;
    private requestedMetrics: Record<string, number> = {}; // {metric: lastRequested}

    constructor(private url: string, private container: string | null = null) {
        this.context = new Context(url, container);
        this.scriptRegistry = new ScriptRegistry();
        this.datastore = new DataStore();
    }

    async poll() {
        const metrics = Object.keys(this.requestedMetrics);
        if (metrics.length == 0) {
            return;
        }

        const data = await this.context.fetch(metrics, true);
        this.datastore.ingest(data);
    }

    ensurePolling(metrics: string[]) {
        for (const metric of metrics) {
            this.requestedMetrics[metric] = new Date().getTime()
        }
    }

    cleanup() {
        // clean up any not required metrics
        const pollExpiry = new Date().getTime() - KEEP_POLLING_MS;
        this.requestedMetrics = _.pickBy(this.requestedMetrics, (lastRequested: number) => lastRequested > pollExpiry);

        // clean expired metrics
        this.datastore.cleanExpiredMetrics();
    }

}

export class EndpointRegistry {
    private endpoints: Record<string, Endpoint> = {};

    find_or_create(url: string, container: string | null = null) {
        const id = `${url}::${container}`;
        let endpoint = this.endpoints[id];
        if (!endpoint) {
            endpoint = new Endpoint(url, container);
            this.endpoints[id] = endpoint;
        }
        return endpoint;
    }

    list() {
        return Object.values(this.endpoints);
    }

}