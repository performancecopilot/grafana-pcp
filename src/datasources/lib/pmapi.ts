import _ from 'lodash';
import { synchronized, isBlank } from './utils';
import { MetricMetadata, DatasourceRequestFn } from './types';

export class Context {

    private context: string;
    private metricMetadataCache: Record<string, MetricMetadata> = {}; // TODO: invalidate cache
    private indomCache: Record<string, Record<number, string>> = {}; // indomCache[metric][instance_id] = instance_name
    private childrenCache: Record<string, { leaf: string[], nonleaf: string[] }> = {};
    private d: string = '';

    constructor(private datasourceRequest: DatasourceRequestFn, readonly url: string, readonly container?: string) {
    }

    newInstance() {
        return new Context(this.datasourceRequest, this.url, this.container);
    }

    @synchronized
    async createContext() {
        let contextUrl = `${this.url}/pmapi/context?hostspec=127.0.0.1&polltimeout=30`;

        const contextResponse = await this.datasourceRequest({ url: contextUrl });
        this.context = contextResponse.data.context;

        // only pmproxy contains source attribute
        if (!contextResponse.data.source) {
            // pmwebd compat
            this.d = '_';
        }

        if (!isBlank(this.container)) {
            await this.datasourceRequest({
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
                const response = await this.datasourceRequest({
                    url: `${this.url}/pmapi/${this.context}/${this.d}metric`,
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
            const response = await this.datasourceRequest({
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
            metric.instances[0].instanceName = "";
            return;
        }

        if (!(metric.name in this.indomCache))
            this.indomCache[metric.name] = await this.refreshIndoms(metric.name);

        let refreshed = false;
        for (const instance of metric.instances) {
            instance.instanceName = this.indomCache[metric.name][instance.instance] || "";
            if (instance.instanceName === "" && !refreshed) {
                // refresh instances at max once per metric
                this.indomCache[metric.name] = await this.refreshIndoms(metric.name);
                instance.instanceName = this.indomCache[metric.name][instance.instance] || "";
                refreshed = true;
            }
        }
    }

    async fetch(metrics: string[], instanceNames: boolean = false) {
        metrics.push("pmcd.control.timeout"); // TODO: remove workaround - server should return empty list if no metrics were found

        const data = await this.ensureContext(async () => {
            const response = await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}fetch`,
                params: { names: metrics.join(',') }
            });
            return response.data;
        });

        const returnedMetrics = data.values.map((metric: any) => metric.name);
        const missingMetrics = _.difference(metrics, returnedMetrics);
        if (missingMetrics.length > 0) {
            console.debug(`fetch didn't include result for ${missingMetrics.join(', ')}, clearing it from metric metadata and indom cache`);
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
            const response = await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}store`,
                params: { name: metric, value: value }
            });
            return response.data;
        });
    }

    async children(prefix: string) {
        if (prefix in this.childrenCache)
            return this.childrenCache[prefix];

        const data = await this.ensureContext(async () => {
            const response = await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}children`,
                params: { prefix: prefix }
            });
            return response.data;
        });

        this.childrenCache[prefix] = { nonleaf: data.nonleaf, leaf: data.leaf };
        return this.childrenCache[prefix];
    }
}
