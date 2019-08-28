import _ from "lodash";
import DataStore from "../datastore";
import { PmapiSrv, MissingMetricsError } from "./pmapi_srv";

export default class PollSrv {
    private requestedMetrics: Record<string, number> = {}; // {metric: lastRequested}

    constructor(private pmapiSrv: PmapiSrv, private datastore: DataStore, private keepPollingMs: number) {
    }

    async poll() {
        const metrics = Object.keys(this.requestedMetrics);
        if (metrics.length === 0) {
            return;
        }

        const data = await this.pmapiSrv.getMetricValues(metrics);
        await this.datastore.ingest(data);

        const returnedMetrics = data.values.map(metric => metric.name);
        const missingMetrics = _.difference(metrics, returnedMetrics);
        if (missingMetrics.length > 0) {
            console.debug(`fetch didn't include result for ${missingMetrics.join(', ')}, clearing it from requested metrics`);
            for (const missingMetric of missingMetrics) {
                delete this.requestedMetrics[missingMetric];
            }
        }
    }

    async ensurePolling(metrics: string[]) {
        const metadatas = await this.pmapiSrv.getMetricMetadatas(metrics);
        const missingMetrics = _.difference(metrics, Object.keys(metadatas));
        if (missingMetrics.length > 0) {
            throw new MissingMetricsError(missingMetrics);
        }

        const validMetrics = _.intersection(metrics, Object.keys(metadatas));
        const now = new Date().getTime();
        for (const metric of validMetrics) {
            this.requestedMetrics[metric] = now;
        }
    }

    removeMetricsFromPolling(metrics: string[]) {
        for (const metric of metrics) {
            if (metric in this.requestedMetrics)
                delete this.requestedMetrics[metric];
        }
    }

    cleanup() {
        const pollExpiry = new Date().getTime() - this.keepPollingMs;
        this.requestedMetrics = _.pickBy(this.requestedMetrics, (lastRequested: number) => lastRequested > pollExpiry);
    }
}
