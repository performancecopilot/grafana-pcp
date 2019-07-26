import _ from 'lodash';
import { synchronized } from './utils';
import { MetricMetadata } from './types';

export default class Context {

    static datasourceRequest: (options: any) => any;
    private context: string;
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

    async metricMetadatas(metrics: string[]): Promise<{ [key: string]: MetricMetadata }> {
        const requiredMetrics = _.difference(metrics, Object.keys(this.metricMetadataCache));
        if (requiredMetrics.length > 0) {
            requiredMetrics.push("pmcd.control.timeout"); // TODO: remove workaround - server should return empty list if no metrics were found
            const metadata = await this.ensureContext(async () => {
                const response = await Context.datasourceRequest({
                    //url: `${this.url}/pmapi/${this.context}/${this.d}metric`,
                    url: `http://localhost:44322/pmapi/metric`,
                    params: { names: requiredMetrics.join(',') }
                });
                return response.data.metrics;
            });

            for (const metric of metadata) {
                this.metricMetadataCache[metric.name] = metric;
            }
        }
        return _.pick(this.metricMetadataCache, metrics); // _.pick ignores non-existing keys
    }

    async metricMetadata(metric: string) {
        const metadata = await this.metricMetadatas([metric]);
        return metadata[metric];
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

    private async updateInstanceNames(metric: any) {
        if (metric.instances.length == 0) {
            return;
        } else if (metric.instances[0].instance === null || metric.instances[0].instance === -1) {
            // this metric has no instances (single value)
            metric.instances[0].instanceName = null;
            return;
        }

        if (!(metric.name in this.indomCache))
            this.indomCache[metric.name] = await this.refreshIndoms(metric.name);

        let refreshed = false;
        for (const instance of metric.instances) {
            instance.instanceName = this.indomCache[metric.name][instance.instance];
            if (!instance.instanceName && !refreshed) {
                // refresh instances at max once per metric
                this.indomCache[metric.name] = await this.refreshIndoms(metric.name);
                instance.instanceName = this.indomCache[metric.name][instance.instance];
                refreshed = true;
            }
        }
    }

    async fetch(metrics: string[], instanceNames: boolean = false) {
        metrics.push("pmcd.control.timeout"); // TODO: remove workaround - server should return empty list if no metrics were found

        const data = await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}fetch`,
                params: { names: metrics.join(',') }
            });
            return response.data;
        });

        const returnedMetrics = data.values.map((metric: any) => metric.name);
        const missingMetrics = _.difference(metrics, returnedMetrics);
        if (missingMetrics.length > 0) {
            console.debug(`fetch didn't include result for ${missingMetrics.join(',')}, clearing it from metric metadata and indom cache`);
            for (const missingMetric of missingMetrics) {
                delete this.metricMetadataCache[missingMetric];
                delete this.indomCache[missingMetric];
            }
        }

        if (instanceNames) {
            for (const metric of data.values) {
                await this.updateInstanceNames(metric);
            }
        }

        return data;
    }

    async store(metric: string, value: string) {
        return await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}store`,
                params: { name: metric, value: value }
            });
            return response.data;
        });
    }

    async children(prefix: string) {
        return await this.ensureContext(async () => {
            const response = await Context.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}children`,
                params: { prefix: prefix }
            });
            return response.data;
        });
    }
}
