import _ from "lodash";
import DataStore from "../datastore";
import { PmapiSrv, MissingMetricsError } from "./pmapi_srv";

export default class PollSrv {
    private requestedMetrics: string[] = [];

    constructor(private pmapiSrv: PmapiSrv, private datastore: DataStore) {
    }

    async poll() {
        // copy metrics array, could change between API calls
        const metrics = this.requestedMetrics;
        if (metrics.length === 0) {
            return;
        }

        const data = await this.pmapiSrv.getMetricValues(metrics);
        await this.datastore.ingest(data);

        const returnedMetrics = data.values.map(metric => metric.name);
        const missingMetrics = _.difference(metrics, returnedMetrics);
        if (missingMetrics.length > 0) {
            console.debug(`fetch didn't include result for ${missingMetrics.join(', ')}, clearing it from requested metrics`);
            this.requestedMetrics = _.difference(this.requestedMetrics, missingMetrics);
        }
    }

    async ensurePolling(metrics: string[]) {
        const metadatas = await this.pmapiSrv.getMetricMetadatas(metrics);
        const validMetrics = Object.keys(metadatas);
        const missingMetrics = _.difference(metrics, validMetrics);
        if (missingMetrics.length > 0) {
            throw new MissingMetricsError(missingMetrics);
        }
        this.requestedMetrics = _.union(this.requestedMetrics, validMetrics);
    }

    removeMetricsFromPolling(metrics: string[]) {
        this.requestedMetrics = _.difference(this.requestedMetrics, metrics);
    }

}
