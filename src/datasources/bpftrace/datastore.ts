import _ from 'lodash';
import { Datapoint, TimeSeriesResult } from './datasource';
import Context from './context';

export default class DataStore {
    private store: Record<string, Record<string, Datapoint[]>> = {}; // store[metric][instance] = [val,ts,origVal]

    constructor(private context: Context, private oldestDataMs: number) {
    }

    ingestMetric(metricStore: any, metric: any, pollTimeEpochMs: number) {
        const metadata = this.context.findMetricMetadata(metric.name);
        for (const instance of metric.instances) {
            let instanceStore = metricStore[instance.instanceName];
            let isExistingMetric = true;
            if (!instanceStore) {
                isExistingMetric = false;
                instanceStore = metricStore[instance.instanceName] = [];
            }

            if (metadata.labels && metadata.labels.metrictype === "output") {
                // do not store history of the output of bpftrace scripts
                instanceStore = [];
            }

            if (metadata.sem === "counter") {
                if (isExistingMetric) {
                    let [, prevTimeMs, prevOrigVal] = instanceStore[instanceStore.length - 1];
                    const deltaSec = (pollTimeEpochMs - prevTimeMs) / 1000;
                    instanceStore.push([(instance.value - prevOrigVal!) / deltaSec, pollTimeEpochMs, instance.value]);
                }
                else {
                    instanceStore.push([instance.value, pollTimeEpochMs, instance.value]);
                }
            }
            else {
                instanceStore.push([instance.value, pollTimeEpochMs]);
            }
        }
    }

    ingest(data: any) {
        if (_.isEmpty(data))
            return;

        const pollTimeEpochMs = data.timestamp.s * 1000 + data.timestamp.us / 1000;
        for (const metric of data.values) {
            if (!this.store[metric.name]) {
                this.store[metric.name] = {};
            }

            this.ingestMetric(this.store[metric.name], metric, pollTimeEpochMs);
        }
    }

    queryTimeSeries(metrics: string[], from: number, to: number) {
        let targetResults: TimeSeriesResult[] = [];
        for (const metric of metrics) {
            if (!(metric in this.store))
                continue;

            for (const instance in this.store[metric]) {
                let target = {
                    // for metrics without instance domains, show metric name
                    target: instance === "null" ? metric : instance,
                    datapoints: this.store[metric][instance].filter((dataPoint: Datapoint) => (
                        from <= dataPoint[1] && dataPoint[1] <= to
                    ))
                };

                targetResults.push(target);
            }
        }
        return targetResults;
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
