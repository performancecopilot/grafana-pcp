import _ from 'lodash';
import Context from './context';
import { Datapoint, TimeSeriesData } from './types';

type StoredDatapoint = [number | string | undefined, number, number?];

export default class DataStore {
    private store: Record<string, Record<string, StoredDatapoint[]>> = {}; // store[metric][instance] = [val,ts,origVal]

    constructor(private context: Context, private oldestDataMs: number) {
    }

    ingestCounterMetric(instanceStore: StoredDatapoint[], instance: any, pollTimeEpochMs: number) {
        // first value: store it as undefined, to be filtered by queryTimeSeries()
        // subsequent values: perform rate conversation
        if (instanceStore.length > 0) {
            let [, prevTimeMs, prevOrigVal] = instanceStore[instanceStore.length - 1];
            const deltaSec = (pollTimeEpochMs - prevTimeMs) / 1000;
            instanceStore.push([(instance.value - prevOrigVal!) / deltaSec, pollTimeEpochMs, instance.value]);
        }
        else {
            instanceStore.push([undefined, pollTimeEpochMs, instance.value]);
        }
    }

    ingestMetric(metricStore: Record<string, StoredDatapoint[]>, metric: any, pollTimeEpochMs: number) {
        const metadata = this.context.findMetricMetadata(metric.name);
        if (!metadata) {
            console.info(`skipping ingestion of ${metric.name}: metadata not available`);
            return;
        }

        for (const instance of metric.instances) {
            // for the bpftrace output variable, always recreate the metric store (do not store history)
            if (!(instance.instanceName in metricStore) || (metadata.labels && metadata.labels.metrictype === "output")) {
                metricStore[instance.instanceName] = [];
            }

            if (metadata.sem === "counter") {
                this.ingestCounterMetric(metricStore[instance.instanceName], instance, pollTimeEpochMs);
            }
            else {
                metricStore[instance.instanceName].push([instance.value, pollTimeEpochMs]);
            }
        }
    }

    ingest(data: any) {
        if (_.isEmpty(data))
            return;

        const pollTimeEpochMs = data.timestamp.s ? data.timestamp.s * 1000 + data.timestamp.us / 1000 : data.timestamp * 1000;
        for (const metric of data.values) {
            if (!this.store[metric.name]) {
                this.store[metric.name] = {};
            }

            this.ingestMetric(this.store[metric.name], metric, pollTimeEpochMs);
        }
    }

    queryMetric(metric: string, from: number, to: number) {
        const results: TimeSeriesData[] = [];
        for (const instance in this.store[metric]) {
            let target = {
                // for metrics without instance domains, show metric name
                target: instance === "null" ? metric : instance,
                datapoints: this.store[metric][instance].filter((dataPoint: StoredDatapoint) => (
                    from <= dataPoint[1] && dataPoint[1] <= to && dataPoint[0] != undefined
                )) as Datapoint[]
            };
            results.push(target);
        }
        return results;
    }

    queryMetrics(metrics: string[], from: number, to: number) {
        return metrics.map((metric: string) => ({ metric: metric, data: this.queryMetric(metric, from, to) }));
    }

    cleanExpiredMetrics() {
        const keepExpiry = new Date().getTime() - this.oldestDataMs
        for (const metric in this.store) {
            for (const instance in this.store[metric]) {
                this.store[metric][instance] = this.store[metric][instance].filter(
                    (dataPoint: Datapoint) => dataPoint[1] > keepExpiry
                );
            }
        }
    }
}
