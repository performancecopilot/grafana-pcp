import { Datapoint, Target } from './datasource';

export default class DataStore {
    private store: Record<string, Record<string, Datapoint[]>> = {}; // store[metric][instance] = [val,ts]

    constructor() {
    }

    ingest(data: any) {
        const pollTimeEpochMs = data.timestamp.s * 1000 + data.timestamp.us / 1000;
        for(const metric of data.values) {
            let metricStore = this.store[metric.name];
            if (!metricStore) {
                metricStore = this.store[metric.name] = {};
            }

            for (const instance of metric.instances) {
                if (!(instance.instanceName in metricStore))
                    metricStore[instance.instanceName] = [];

                metricStore[instance.instanceName].push([instance.value, pollTimeEpochMs])
            }
        }
    }

    query(metrics: string[]) {
        let targets : Target[] = [];
        for(const metric of metrics) {
            if (!(metric in this.store))
                continue;

            for(const instance in this.store[metric]) {
                targets.push({
                    // for metrics without instance domains, show metric name
                    target: instance === "null" ? metric : instance,
                    datapoints: this.store[metric][instance]
                });
            }
        }
        return targets;
    }

    cleanExpiredMetrics() {
    }
}
