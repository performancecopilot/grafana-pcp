export default class DataStore {
    private store: Record<string, Record<string, Record<string, [number,number][]>>> = {}; // store[url][metric][instance] = [val,ts]

    constructor() {
    }

    ingest(url: string, data: any) {
        if (!(url in this.store)) {
            this.store[url] = {};
        }

        const pollTimeEpochMs = data.timestamp.s * 1000 + data.timestamp.us / 1000;
        for(const metric of data.values) {
            let metricStore = this.store[url][metric.name];
            if (!metricStore) {
                metricStore = this.store[url][metric.name] = {};
            }

            for (const instance of metric.instances) {
                if (!(instance.instanceName in metricStore))
                    metricStore[instance.instanceName] = [];

                metricStore[instance.instanceName].push([instance.value, pollTimeEpochMs])
            }
        }
    }

    query(url: string, metrics: string[]) {
        if (!(url in this.store))
            return [];

        let targets = [] as any;
        for(const metric of metrics) {
            if (!(metric in this.store[url]))
                continue;

            for(const instance in this.store[url][metric]) {
                targets.push({
                    // for metrics without instance domains, show metric name
                    target: instance === "null" ? metric : instance,
                    datapoints: this.store[url][metric][instance]
                });
            }
        }
        return targets;
    }

    cleanExpiredMetrics() {
    }
}
