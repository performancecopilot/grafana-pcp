import _ from 'lodash';
import { PmapiSrv, FetchResponse } from "./services/pmapi_srv";
import { MetricInstance, TargetResult } from './models/metrics';
import { MetricValues } from './models/pmapi';

export default class DataStore {
    private store: Record<string, Map<number | null, MetricInstance<number | string>>> = {}; // store[metric][instance_id] = metricInstance

    constructor(private pmapiSrv: PmapiSrv, private localHistoryAgeMs: number) {
    }

    private async ingestMetric(metricStore: Map<number | null, MetricInstance<number | string>>, metric: MetricValues, pollTimeEpochMs: number) {
        let indomsRefreshed = false;
        for (const instance of metric.instances) {
            const instanceId = instance.instance;

            const storedInstance = metricStore.get(instanceId)!;
            if (storedInstance) {
                // do not store history for the bpftrace control and output metrics
                if (storedInstance.labels.agent === "bpftrace" && ["control", "output"].includes(storedInstance.labels.metrictype as string))
                    storedInstance.values = [];
                storedInstance.values.push([instance.value, pollTimeEpochMs]);
            }
            else {
                let instanceName = "";
                if (instanceId !== null) {
                    let indom = await this.pmapiSrv.getIndom(metric.name, instanceId, true); // try from cache
                    if (!indom && !indomsRefreshed) {
                        indom = await this.pmapiSrv.getIndom(metric.name, instanceId, false); // do api request
                        indomsRefreshed = true;
                    }
                    if (indom)
                        instanceName = indom.name;
                }

                metricStore.set(instanceId, {
                    id: instanceId,
                    name: instanceName,
                    values: [[instance.value, pollTimeEpochMs]],
                    labels: await this.pmapiSrv.getLabels(metric.name, instanceId, indomsRefreshed)
                });
            }
        }
    }

    async ingest(data: FetchResponse) {
        const pollTimeEpochMs = data.timestamp * 1000;
        for (const metric of data.values) {
            if (!(metric.name in this.store)) {
                this.store[metric.name] = new Map();
            }
            await this.ingestMetric(this.store[metric.name], metric, pollTimeEpochMs);
        }
    }

    queryMetric(metric: string, from: number, to: number): MetricInstance<number | string>[] {
        if (!(metric in this.store))
            return [];
        return Array.from(this.store[metric], ([, instance]) => ({
            id: instance.id,
            name: instance.name,
            values: instance.values.filter(dataPoint => (
                from <= dataPoint[1] && dataPoint[1] <= to
            )),
            labels: instance.labels
        }));
    }

    queryMetrics(target: any, metrics: string[], from: number, to: number): TargetResult {
        return {
            target,
            metrics: metrics.map(metric => ({
                name: metric,
                instances: this.queryMetric(metric, from, to)
            }))
        };
    }

    cleanExpiredMetrics() {
        const keepExpiry = new Date().getTime() - this.localHistoryAgeMs;
        for (const metric in this.store) {
            for (const instance of this.store[metric].values()) {
                instance.values = instance.values.filter(
                    dataPoint => dataPoint[1] > keepExpiry
                );
            }
        }
    }
}
