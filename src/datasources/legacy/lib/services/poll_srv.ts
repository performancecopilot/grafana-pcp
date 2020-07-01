import _ from "lodash";
import DataStore from "../datastore";
import { PmapiSrv, MissingMetricsError } from "./pmapi_srv";
import { MetricValues } from "../models/pmapi";

type MetricHookFn = (metric: MetricValues) => boolean;

export default class PollSrv {
    private requestedMetrics: string[] = [];
    private metricHooks: Record<string, MetricHookFn> = {};

    constructor(private pmapiSrv: PmapiSrv, private datastore: DataStore) {
    }

    async poll() {
        // copy metrics array, could change between API calls
        const metrics = this.requestedMetrics;
        if (metrics.length === 0) {
            return;
        }

        const data = await this.pmapiSrv.getMetricValues(metrics);
        const returnedMetrics = data.values.map(metric => metric.name);
        for (let i = data.values.length - 1; i >= 0; i--) {
            const metric = data.values[i];
            if (metric.name in this.metricHooks) {
                const storeInDatastore = this.metricHooks[metric.name](metric);
                if (!storeInDatastore) {
                    data.values.splice(i, 1);
                }
            }
        }
        await this.datastore.ingest(data);

        const missingMetrics = _.difference(metrics, returnedMetrics);
        if (missingMetrics.length > 0) {
            console.debug(`fetch didn't include result for ${missingMetrics.join(', ')}, clearing it from requested metrics`);
            this.requestedMetrics = _.difference(this.requestedMetrics, missingMetrics);
        }
    }

    async ensurePolling(metrics: string[], hookFn?: MetricHookFn) {
        const metadatas = await this.pmapiSrv.getMetricMetadatas(metrics);
        const validMetrics = Object.keys(metadatas);
        const missingMetrics = _.difference(metrics, validMetrics);
        if (missingMetrics.length > 0) {
            throw new MissingMetricsError(missingMetrics);
        }
        this.requestedMetrics = _.union(this.requestedMetrics, validMetrics);
        if (hookFn) {
            validMetrics.forEach(metric => { this.metricHooks[metric] = hookFn; });
        }
    }

    removeMetricsFromPolling(metrics: string[]) {
        this.requestedMetrics = _.difference(this.requestedMetrics, metrics);
        this.metricHooks = _.omit(this.metricHooks, metrics);
    }

}
