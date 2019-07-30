import _ from 'lodash';
import Context from './context';
import { Datapoint, MetricInstance, TargetResult, QueryTarget } from './types';
import { Endpoint } from './endpoint_registry';

type StoredDatapoint = [number | string | undefined, number, number?];

export default class DataStore {
    private store: Record<string, Record<string, StoredDatapoint[]>> = {}; // store[metric][instance] = [val,ts,origVal]

    constructor(private context: Context, private localHistoryAgeMs: number) {
    }

    private ingestCounterMetric(instanceStore: StoredDatapoint[], instance: any, pollTimeEpochMs: number) {
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

    private async ingestMetric(metricStore: Record<string, StoredDatapoint[]>, metric: any, pollTimeEpochMs: number) {
        const metadata = await this.context.metricMetadata(metric.name);
        if (!metadata) {
            console.info(`skipping ingestion of ${metric.name}: metadata not available`);
            return;
        }

        for (const instance of metric.instances) {
            // do not store history for the bpftrace control and output metrics
            if (!(instance.instanceName in metricStore) ||
                (metadata.labels && ["control", "output"].includes(metadata.labels.metrictype))) {
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

    async ingest(data: any) {
        if (_.isEmpty(data))
            return;

        const pollTimeEpochMs = data.timestamp.s ? data.timestamp.s * 1000 + data.timestamp.us / 1000 : data.timestamp * 1000;
        for (const metric of data.values) {
            if (!(metric.name in this.store)) {
                this.store[metric.name] = {};
            }

            await this.ingestMetric(this.store[metric.name], metric, pollTimeEpochMs);
        }
    }

    queryMetric(metric: string, from: number, to: number): MetricInstance[] {
        if (!(metric in this.store))
            return [];
        return Object.keys(this.store[metric]).map(instance => ({
            name: instance,
            values: this.store[metric][instance].filter(dataPoint => (
                from <= dataPoint[1] && dataPoint[1] <= to && dataPoint[0] != undefined
            )) as Datapoint[]
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
        const keepExpiry = new Date().getTime() - this.localHistoryAgeMs
        for (const metric in this.store) {
            for (const instance in this.store[metric]) {
                this.store[metric][instance] = this.store[metric][instance].filter(
                    (dataPoint: Datapoint) => dataPoint[1] > keepExpiry
                );
            }
        }
    }
}
