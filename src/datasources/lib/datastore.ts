import _ from 'lodash';
import { Context } from "./pmapi";
import { MetricInstance, TargetResult, Metric, TDatapoint, IngestionTransformationFn } from './types';
import { IngestionTransformations } from './transformations';

export default class DataStore {
    private store: Record<string, Record<string, TDatapoint[]>> = {}; // store[metric][instance] = [val,ts]

    constructor(private context: Context, private localHistoryAgeMs: number) {
    }

    private async ingestMetric(metricStore: Record<string, TDatapoint[]>, metric: any, pollTimeEpochMs: number) {
        const metadata = await this.context.metricMetadata(metric.name);
        if (!metadata) {
            console.info(`skipping ingestion of ${metric.name}: metadata not available`);
            return;
        }

        const transformations: IngestionTransformationFn[] = [];
        if (metadata.sem === "counter")
            transformations.push(IngestionTransformations.counter as any);
        if (metadata.sem === "counter" && metadata.units === "nanosec")
            transformations.push(IngestionTransformations.divideBy(1000 * 1000 * 1000));

        for (const instance of metric.instances) {
            // do not store history for the bpftrace control and output metrics
            if (!(instance.instanceName in metricStore) ||
                (metadata.labels && ["control", "output"].includes(metadata.labels.metrictype))) {
                metricStore[instance.instanceName] = [];
            }

            let datapoint: TDatapoint = [instance.value, pollTimeEpochMs];
            const storeSize = metricStore[instance.instanceName].length;
            const prevDatapoint = storeSize > 0 ? metricStore[instance.instanceName][storeSize - 1] : undefined;

            datapoint = IngestionTransformations.applyTransformations(transformations, datapoint, prevDatapoint);
            metricStore[instance.instanceName].push(datapoint);
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

    queryMetric(metric: string, from: number, to: number): MetricInstance<number | string>[] {
        if (!(metric in this.store))
            return [];
        return Object.keys(this.store[metric]).map(instance => ({
            name: instance,
            values: this.store[metric][instance].filter(dataPoint => (
                from <= dataPoint[1] && dataPoint[1] <= to && dataPoint[0] != undefined
            ))
        }));
    }

    queryMetrics(target: any, metrics: string[], from: number, to: number): TargetResult {
        return {
            target,
            metrics: metrics.map(metric => ({
                name: metric,
                instances: this.queryMetric(metric, from, to)
            })) as Metric<number>[] | Metric<string>[]
        };
    }

    cleanExpiredMetrics() {
        const keepExpiry = new Date().getTime() - this.localHistoryAgeMs
        for (const metric in this.store) {
            for (const instance in this.store[metric]) {
                this.store[metric][instance] = this.store[metric][instance].filter(
                    dataPoint => dataPoint[1] > keepExpiry
                );
            }
        }
    }
}
