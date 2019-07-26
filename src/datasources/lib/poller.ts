import _ from "lodash";
import Context from "./context";
import DataStore from "./datastore";

export default class Poller {
    private requestedMetrics: Record<string, number> = {}; // {metric: lastRequested}

    constructor(private context: Context, private datastore: DataStore, private keepPollingMs: number) {
    }

    async poll() {
        const metrics = Object.keys(this.requestedMetrics);
        if (metrics.length == 0) {
            return;
        }

        const data = await this.context.fetch(metrics, true);
        await this.datastore.ingest(data);

        const returnedMetrics = data.values.map((metric: any) => metric.name);
        const missingMetrics = _.difference(metrics, returnedMetrics);
        if (missingMetrics.length > 0) {
            console.debug(`fetch didn't include result for ${missingMetrics.join(',')}, clearing it from requested metrics`);
            for (const missingMetric of missingMetrics) {
                delete this.requestedMetrics[missingMetric];
            }
        }
    }

    async ensurePolling(metrics: string[], failOnError: boolean = true) {
        const metadatas = await this.context.metricMetadatas(metrics);
        const validMetrics = _.intersection(metrics, Object.keys(metadatas));

        if (failOnError && validMetrics.length < metrics.length) {
            const invalidMetrics = _.difference(metrics, validMetrics);
            throw { message: `Cannot find metric(s) ${invalidMetrics.join(',')} on PMDA.` };
        }

        const now = new Date().getTime()
        for (const metric of validMetrics) {
            this.requestedMetrics[metric] = now
        }
        return validMetrics;
    }

    removeMetricsFromPolling(metrics: string[]) {
        for (const metric of metrics) {
            delete this.requestedMetrics[metric];
        }
    }

    cleanupExpiredMetrics() {
        // clean up any not required metrics
        const pollExpiry = new Date().getTime() - this.keepPollingMs;
        this.requestedMetrics = _.pickBy(this.requestedMetrics, (lastRequested: number) => lastRequested > pollExpiry);
    }
}
