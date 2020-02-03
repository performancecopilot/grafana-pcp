import _ from 'lodash';
import { synchronized, isBlank } from '../utils';
import { MetricMetadata, IndomInstance, MetricValues } from '../models/pmapi';
import { DatasourceRequestFn } from '../models/datasource';
import { Labels } from '../models/metrics';
import "core-js/stable/array/flat-map";

export interface MetricsResponse {
    metrics: MetricMetadata[];
}

export interface IndomResponse {
    instances: IndomInstance[];
}

export interface FetchResponse {
    timestamp: number;
    values: MetricValues[];
}

export interface StoreResponse {
    success: boolean;
}

export interface ChildrenResponse {
    leaf: string[];
    nonleaf: string[];
}

export class MissingMetricsError extends Error {
    readonly metrics: string[];
    constructor(metrics: string[], message?: string) {
        const s = metrics.length !== 1 ? 's' : '';
        if (!message)
            message = `Cannot find metric${s} ${metrics.join(', ')}. Please check if the PMDA is enabled.`;
        super(message);
        this.metrics = metrics;
        Object.setPrototypeOf(this, MissingMetricsError.prototype);
    }
}

export class PermissionError extends Error {
    readonly metrics: string[];
    constructor(metrics: string[], message?: string) {
        const s = metrics.length !== 1 ? 's' : '';
        if (!message)
            message = `Insufficient permissions to store metric${s} ${metrics.join(', ')}.`;
        super(message);
        this.metrics = metrics;
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}

export class Context {

    private context: string;
    private isPmwebd = false;
    private isPmproxy = true;
    private d = '';

    constructor(private datasourceRequest: DatasourceRequestFn, private url: string, private container?: string) {
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
        if (contextResponse.data.source) {
            this.isPmproxy = true;
            this.isPmwebd = false;
            this.d = '';
        }
        else {
            this.isPmwebd = true;
            this.isPmproxy = false;
            this.d = '_';
        }

        if (!isBlank(this.container)) {
            await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}store`,
                params: { name: "pmcd.client.container", value: this.container }
            });
        }
    }

    static ensureContext(target: any, methodName: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        const asyncFn = async function (this: Context, args: IArguments) {
            if (!this.context) {
                await this.createContext();
            }

            try {
                return await method.apply(this, args);
            } catch (error) {
                if ((this.isPmproxy && _.has(error, 'data.message') && error.data.message.includes("unknown context identifier")) ||
                    (this.isPmwebd && _.isString(error.data) && error.data.includes("12376"))) {
                    console.debug("context expired, creating new context...");
                    await this.createContext();
                    return await method.apply(this, args);
                }
                else {
                    throw error;
                }
            }
        };
        descriptor.value = function (this: Context) {
            return asyncFn.call(this, arguments);
        };
    }

    @Context.ensureContext
    async metric(metrics: string[]): Promise<MetricsResponse> {
        if (this.isPmproxy) {
            try {
                const response = await this.datasourceRequest({
                    url: `${this.url}/pmapi/${this.context}/${this.d}metric`,
                    params: { names: metrics.join(',') }
                });
                return response.data;
            }
            catch (error) {
                // pmproxy throws an exception if exactly one metric is requested
                // and this metric is not found
                if (_.has(error, 'data.message') && error.data.message.includes("Unknown metric name"))
                    return { metrics: [] };
                else
                    throw error;
            }
        }
        else {
            const responses = await Promise.all(metrics.map(metric => this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}metric`,
                params: { prefix: metric }
            })));
            return {
                metrics: responses.flatMap(response => {
                    const metricsList = response.data.metrics;
                    if (metricsList.length > 0) {
                        metricsList[0].pmid = metricsList[0].pmid.toString();
                        metricsList[0].labels = {};
                    }
                    return metricsList;
                })
            };
        }
    }

    @Context.ensureContext
    async indom(metric: string): Promise<IndomResponse> {
        const response = await this.datasourceRequest({
            url: `${this.url}/pmapi/${this.context}/${this.d}indom`,
            params: { name: metric }
        });
        const data = response.data;

        if (this.isPmwebd) {
            for (const instance of data.instances) {
                instance.labels = {};
            }
        }
        return data;
    }

    @Context.ensureContext
    async fetch(metrics: string[]): Promise<FetchResponse> {
        let data: any;
        try {
            const response = await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}fetch`,
                params: { names: metrics.join(',') }
            });
            data = response.data;
        }
        catch (e) {
            // pmwebd throws an exception if exactly one metric is requested
            // and this metric is not found
            if (this.isPmwebd && _.isString(e.data) && e.data.includes("-12443"))
                data = { timestamp: { s: 0, us: 0 }, values: [] };
            else
                throw e;
        }

        if (this.isPmwebd) {
            data.timestamp = data.timestamp.s + data.timestamp.us / 1000000;
            for (const metric of (data as FetchResponse).values) {
                metric.pmid = metric.pmid.toString();
                for (const instance of metric.instances) {
                    if (instance.instance === -1)
                        instance.instance = null;
                }
            }
        }

        return data;
    }

    @Context.ensureContext
    async store(metric: string, value: string): Promise<StoreResponse> {
        try {
            const response = await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}store`,
                params: { name: metric, value: value }
            });
            return response.data;
        }
        catch (error) {
            if ((this.isPmproxy && _.has(error, 'data.message') && error.data.message.includes("failed to lookup metric")) ||
                (this.isPmwebd && _.isString(error.data) && error.data.includes("-12357")))
                throw new MissingMetricsError([metric]);
            else if ((this.isPmproxy && _.has(error, 'data.message') &&
                error.data.message.includes("No permission to perform requested operation")) ||
                (this.isPmwebd && _.isString(error.data) && error.data.includes("-12387")))
                throw new PermissionError([metric]);
            else if ((this.isPmproxy && _.has(error, 'data.message') && error.data.message.includes("Bad input")) ||
                (this.isPmwebd && _.isString(error.data) && error.data.includes("-12400")))
                return { success: false };
            else
                throw error;
        }
    }

    @Context.ensureContext
    storeBeacon(metric: string, value: string): boolean {
        return navigator.sendBeacon(`${this.url}/pmapi/${this.context}/${this.d}store?name=${metric}`, value);
    }

    @Context.ensureContext
    async children(prefix: string): Promise<ChildrenResponse> {
        if (this.isPmproxy) {
            const response = await this.datasourceRequest({
                url: `${this.url}/pmapi/${this.context}/${this.d}children`,
                params: { prefix: prefix }
            });
            return response.data;
        }
        else {
            return { nonleaf: [], leaf: [] };
        }
    }
}

export class PmapiSrv {
    private pcpVersion: string;
    private metricMetadataCache: Record<string, MetricMetadata> = {};
    private instanceCache: Record<string, Record<number, IndomInstance>> = {}; // instanceCache[metric][instance_id] = instance
    private childrenCache: Record<string, ChildrenResponse> = {};

    constructor(readonly context: Context) {
    }

    @synchronized
    async getPcpVersion() {
        if (!this.pcpVersion) {
            const versionMetric = await this.getMetricValues(["pmcd.version"]);
            this.pcpVersion = versionMetric.values[0].instances[0].value as string;
        }
        return this.pcpVersion;
    }

    async getMetricMetadatas(metrics: string[]): Promise<Record<string, MetricMetadata>> {
        const requiredMetrics = _.difference(metrics, Object.keys(this.metricMetadataCache));
        if (requiredMetrics.length > 0) {
            const metadatas = await this.context.metric(requiredMetrics);
            for (const metricMetadata of metadatas.metrics) {
                this.metricMetadataCache[metricMetadata.name] = metricMetadata;
            }
        }
        return _.pick(this.metricMetadataCache, metrics);
    }

    async getMetricMetadata(metric: string): Promise<MetricMetadata> {
        const metadata = await this.getMetricMetadatas([metric]);
        return metadata[metric];
    }

    async getIndoms(metric: string, ignoreCache = false): Promise<Record<number, IndomInstance>> {
        if (!(metric in this.instanceCache) || ignoreCache) {
            const response = await this.context.indom(metric);
            this.instanceCache[metric] = {};
            for (const instance of response.instances) {
                this.instanceCache[metric][instance.instance] = instance;
            }
        }
        return this.instanceCache[metric] || {};
    }

    async getIndom(metric: string, instance: number, cacheOnly = false): Promise<IndomInstance | undefined> {
        if (!(metric in this.instanceCache && instance in this.instanceCache[metric]) && !cacheOnly)
            await this.getIndoms(metric, true);
        return (this.instanceCache[metric] || {})[instance];
    }

    async getMetricValues(metrics: string[]): Promise<FetchResponse> {
        const response = await this.context.fetch(metrics);

        const returnedMetrics = response.values.map(metric => metric.name);
        const missingMetrics = _.difference(metrics, returnedMetrics);
        if (missingMetrics.length > 0) {
            console.debug(`fetch didn't include result for ${missingMetrics.join(', ')}, clearing it from metric metadata and indom cache`);
            for (const missingMetric of missingMetrics) {
                delete this.metricMetadataCache[missingMetric];
                delete this.instanceCache[missingMetric];
            }
        }
        return response;
    }

    async storeMetricValue(metric: string, value: string): Promise<StoreResponse> {
        return await this.context.store(metric, value);
    }

    storeBeacon(metric: string, value: string): boolean {
        return this.context.storeBeacon(metric, value);
    }

    async getChildren(prefix: string): Promise<ChildrenResponse> {
        if (prefix in this.childrenCache)
            return this.childrenCache[prefix];

        const response = await this.context.children(prefix);
        this.childrenCache[prefix] = response;
        return this.childrenCache[prefix];
    }

    async getLabels(metric: string, instance?: number | null, cacheOnly = false): Promise<Labels> {
        const metadata = await this.getMetricMetadata(metric);
        if (!metadata)
            return {};

        const labels = metadata.labels;
        if (instance) {
            const indom = await this.getIndom(metric, instance, cacheOnly);
            if (indom)
                Object.assign(labels, indom.labels);
        }
        return labels;
    }
}
