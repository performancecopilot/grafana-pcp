import _ from 'lodash';

interface MetricMetadata {
    name: string,
    pmid: number,
    sem: string,
    labels: Record<string, any>
}

export default class Context {

    static datasourceRequest: (options: any) => any;
    private context: string;
    private contextPromise: Promise<void> | null = null;
    private metricMetadataCache: Record<string, MetricMetadata> = {};
    private missingMetrics: string[] = [];
    private indomCache: Record<string, Record<number, string>> = {}; // indomCache[metric][instance_id] = instance_name

    constructor(readonly url: string, readonly container: string | null = null) {
    }

    private async _createContext() {
        let contextUrl = `${this.url}/pmapi/context?hostspec=127.0.0.1&polltimeout=30`

        const contextResponse = await Context.datasourceRequest({ url: contextUrl })
        this.context = contextResponse.data.context


        if (this.container) {
            const containerResponse = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/_store`,
                params: { name: "pmcd.client.container", value: this.container }
            })
        }
    }

    // this method ensures that only one context request will be sent at a time
    // if there are 2 simultaneous calls to createContext(), the second call
    // will wait until the promise of the first call is resolved
    async createContext() {
        if (!this.contextPromise)
            this.contextPromise = this._createContext();
        await this.contextPromise;
        this.contextPromise = null;
    }

    async ensureContext(fn: () => any) {
        if (!this.context) {
            await this.createContext();
        }

        try {
            return await fn();
        } catch (err) {
            console.log("error", err, "creating new context...");
            await this.createContext();
            return await fn();
        }
    }

    async fetchMetricMetadata(prefix: string | null) {
        await this.ensureContext(async () => {
            let params: any = {};
            if (prefix)
                params.prefix = prefix;

            const metricsResponse = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/_metric`,
                params
            });

            this.metricMetadataCache = {};
            for (const metric of metricsResponse.data.metrics) {
                this.metricMetadataCache[metric.name] = metric;
            }
        });
    }

    findMetricMetadata(metric: string) {
        return this.metricMetadataCache[metric];
    }

    async refreshIndoms(metric: string) {
        const indoms = await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/_indom`,
                params: { name: metric }
            });
            return response.data.instances;
        });

        // convert [{instance: X, name: Y}] to {instance: name}
        this.indomCache[metric] = {};
        for (const indom of indoms) {
            this.indomCache[metric][indom.instance] = indom.name;
        }
        return this.indomCache[metric];
    }

    async fetch(metrics: string[], instanceNames: boolean = false) {
        console.debug("fetching metrics", metrics);

        const data = await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/_fetch`,
                params: { names: metrics.join(',') }
            });
            return response.data;
        });

        if (instanceNames) {
            // add instance names to instances
            for (const metric of data.values) {
                if (metric.instances.length == 0) {
                    continue;
                } else if (metric.instances[0].instance === -1) { // this metric has no instances (single value)
                    metric.instances[0].instanceName = null;
                    continue;
                }

                let indomsForMetric = this.indomCache[metric.name];
                if (!indomsForMetric)
                    indomsForMetric = await this.refreshIndoms(metric.name);

                let refreshed = false;
                for (const instance of metric.instances) {
                    instance.instanceName = indomsForMetric[instance.instance];
                    if (!instance.instanceName && !refreshed) {
                        // refresh instances at max once per metric
                        indomsForMetric = await this.refreshIndoms(metric.name);
                        instance.instanceName = indomsForMetric[instance.instance];
                        refreshed = true;
                    }
                }
            }
        }

        return data;
    }

    async store(metric: string, value: string) {
        return await this.ensureContext(() => {
            return Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/_store`,
                params: { name: metric, value: value }
            })
        });
    }
}
