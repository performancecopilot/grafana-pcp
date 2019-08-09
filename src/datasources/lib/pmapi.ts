import _ from 'lodash';
import { synchronized, isBlank } from './utils';
import { MetricMetadata, DatasourceRequestFn } from './types';

export class Context {

    private context: string;
    private metricMetadataCache: Record<string, MetricMetadata> = {};
    private instanceCache: Record<string, Record<number, string>> = {}; // instanceCache[metric][instance_id] = instance_name
    private instanceLabelCache: Record<string, Record<string, any>> = {}; // instanceLabelCache[metric][instance_name] = {label1: value1}
    private childrenCache: Record<string, { leaf: string[], nonleaf: string[] }> = {};
    private d = '';

    constructor(private datasourceRequest: DatasourceRequestFn, readonly url: string, readonly container?: string) {
    }

    newInstance() {
        return new Context(this.datasourceRequest, this.url, this.container);
    }

    @synchronized
    async createContext() {
        const contextResponse = await this.datasourceRequest({
            url: `${this.url}/pmapi/context`,
            params: { hostspec: "127.0.0.1", polltimeout: 30 }
        });
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

    private async indom(metric: string) {
        const instances = await this.ensureContext(async () => {
            const response = await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}indom`,
                params: { name: metric }
            });
            return response.data.instances;
        });

        this.instanceCache[metric] = {};
        this.instanceLabelCache[metric] = {};
        for (const instance of instances) {
            this.instanceCache[metric][instance.instance] = instance.name;
            this.instanceLabelCache[metric][instance.name] = instance.labels || {};
        }
        return this.instanceCache[metric];
    }

    private getInstanceName(metric: string, instance: string): string | undefined {
        if (!(metric in this.instanceCache))
            return undefined;
        return this.instanceCache[metric][instance];
    }

    private async updateInstanceNames(metric: any) {
        if (metric.instances.length === 0) {
            return;
        } else if (metric.instances[0].instance === null || metric.instances[0].instance === -1) {
            // this metric has no instances (single value)
            metric.instances[0].instanceName = "";
            return;
        }

        let refreshed = false;
        for (const instance of metric.instances) {
            instance.instanceName = this.getInstanceName(metric.name, instance.instance) || "";
            if (instance.instanceName === "" && !refreshed) {
                // refresh instances at max once per metric
                await this.indom(metric.name);
                instance.instanceName = this.getInstanceName(metric.name, instance.instance) || "";
                refreshed = true;
            }
        }
    }

    async fetch(metrics: string[], instanceNames = false) {
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
                delete this.instanceCache[missingMetric];
                delete this.instanceLabelCache[missingMetric];
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

    labels(metric: string, instance?: string): Record<string, string> {
        const metadata = this.metricMetadataCache[metric];
        if (!metadata)
            return {};

        const labels = this.metricMetadataCache[metric].labels || {};
        if (instance && metadata.indom && metric in this.instanceLabelCache && instance in this.instanceLabelCache[metric]) {
            Object.assign(labels, this.instanceLabelCache[metric][instance]);
        }
        return labels;
    }
}
