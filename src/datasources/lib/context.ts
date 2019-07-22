import _ from 'lodash';
import { synchronized } from './utils';

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
    private indomCache: Record<string, Record<number, string>> = {}; // indomCache[metric][instance_id] = instance_name
    private d: string = '';

    constructor(readonly url: string, readonly container?: string) {
        // if port != 44322, use pmwebd API with underscore
        // TODO: remove once transition to pmproxy is done
        if (!url.includes(":44322")) {
            this.d = '_';
        }
    }

    @synchronized
    async createContext() {
        let contextUrl = `${this.url}/pmapi/context?hostspec=127.0.0.1&polltimeout=30`;

        const contextResponse = await Context.datasourceRequest({ url: contextUrl });
        this.context = contextResponse.data.context;

        if (this.container) {
            await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}store`,
                params: { name: "pmcd.client.container", value: this.container }
            });
        }
    }

    private async ensureContext(fn: () => any) {
        if (!this.context) {
            await this.createContext();
        }

        try {
            return await fn();
        } catch (error) {
            if ((_.isString(error.data) && error.data.includes("12376")) ||
                (_.isObject(error.data) && error.data.message.includes("unknown context identifier"))) {
                console.debug("context expired, creating new context...");
                await this.createContext();
                return await fn();
            }
            else {
                throw error;
            }
        }
    }

    async fetchMetricMetadata(prefix?: string) {
        let params: any = {};
        if (prefix)
            params.prefix = prefix;

        const metrics = await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}metric`,
                params
            });
            return response.data.metrics;
        });

        this.metricMetadataCache = {};
        for (const metric of metrics) {
            this.metricMetadataCache[metric.name] = metric;
        }
    }

    findMetricMetadata(metric: string) {
        return this.metricMetadataCache[metric];
    }

    getAllMetricNames() {
        return Object.keys(this.metricMetadataCache);
    }

    private async refreshIndoms(metric: string) {
        const indoms = await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}indom`,
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
        const data = await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}fetch`,
                params: { names: metrics.join(',') }
            });
            return response.data;
        });

        if (instanceNames) {
            // add instance names to instances
            for (const metric of data.values) {
                if (metric.instances.length == 0) {
                    continue;
                } else if (metric.instances[0].instance === null || metric.instances[0].instance === -1) { // this metric has no instances (single value)
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
                url: `${this.url}/pmapi/${this.context}/${this.d}store`,
                params: { name: metric, value: value }
            })
        });
    }
}
