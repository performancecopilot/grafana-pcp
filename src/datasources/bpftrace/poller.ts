import _ from "lodash";
import Context from "./context";
import DataStore from "./datastore";

export default class Poller {
    private requestedMetrics: Record<string, number> = {}; // {metric: lastRequested}

    constructor(private context: Context, private datastore: DataStore, private keep_polling_ms: number) {
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

    removeMetricsFromPolling(metrics: string[]) {
        for (const metric of metrics) {
            delete this.requestedMetrics[metric];
        }
    }

    cleanup() {
        // clean up any not required metrics
        const pollExpiry = new Date().getTime() - this.keep_polling_ms;
        this.requestedMetrics = _.pickBy(this.requestedMetrics, (lastRequested: number) => lastRequested > pollExpiry);

        // clean expired metrics
        this.datastore.cleanExpiredMetrics();
    }
}
