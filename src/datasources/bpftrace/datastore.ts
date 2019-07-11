import _ from 'lodash';
import { Target, TargetFormat, Datapoint } from './datasource';
import Context from './context';
import Transformations from './transformations';

// age out time
const OLDEST_DATA_MS = 5 * 60 * 1000

export default class DataStore {
    private store: Record<string, Record<string, Datapoint[]>> = {}; // store[metric][instance] = [val,ts,origVal]

    constructor(private context: Context) {
    }

    ingest(data: any) {
        if (_.isEmpty(data))
            return;

        const pollTimeEpochMs = data.timestamp.s * 1000 + data.timestamp.us / 1000;
        for (const metric of data.values) {
            let metricStore = this.store[metric.name];
            if (!metricStore) {
                metricStore = this.store[metric.name] = {};
            }

            const metadata = this.context.findMetricMetadata(metric.name);
            for (const instance of metric.instances) {
                const isExistingMetric = instance.instanceName in metricStore;
                if (!isExistingMetric)
                    metricStore[instance.instanceName] = [];

                if (metadata.sem === "counter" ) {
                    const instanceStore = metricStore[instance.instanceName];
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
                    metricStore[instance.instanceName].push([instance.value, pollTimeEpochMs]);
                }
            }
        }
    }

    query(metrics: string[], format: TargetFormat) {
        let targets: Target[] = [];
        for (const metric of metrics) {
            if (!(metric in this.store))
                continue;

            for (const instance in this.store[metric]) {
                let target = {
                    // for metrics without instance domains, show metric name
                    target: instance === "null" ? metric : instance,
                    datapoints: this.store[metric][instance].filter((dataPoint: Datapoint) => dataPoint[1] > 0)
                };

                if (format === "heatmap")
                    target = Transformations.toHeatmap(target);

                targets.push(target);
            }
        }
        return targets;
    }

    cleanExpiredMetrics() {
        const keepExpiry = new Date().getTime() - OLDEST_DATA_MS
        for (const metric in this.store) {
            for (const instance in this.store[metric]) {
                this.store[metric][instance] = this.store[metric][instance].filter(
                    (dataPoint: Datapoint) => dataPoint[1] > keepExpiry
                );
            }
        }
    }
}
