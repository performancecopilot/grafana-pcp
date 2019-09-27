import _ from 'lodash';
import { Labels } from '../lib/models/metrics';
import { Description, Instance, MetricValue, PM_INDOM_NULL } from './models/pmseries';
import { DatasourceRequestFn } from '../lib/models/datasource';

export interface LabelsResponse {
    series: string;
    labels: Labels;
}

class PmSeriesApi {

    constructor(private datasourceRequest: DatasourceRequestFn, private url: string) {
    }

    async ping() {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/ping`
        });
        // full response object is required for testDatasource()
        return response;
    }

    async query(expr: string): Promise<string[]> {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/query`,
            params: { expr }
        });
        const series = response.data;
        return _.isArray(series) ? series : []; // TODO: on error, pmproxy returns an object (should be an empty array)
    }

    async descs(series: string[]): Promise<Description[]> {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/descs`,
            params: { series: series.join(',') }
        });
        return response.data;
    }

    async instances(series: string[]): Promise<Instance[]> {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/instances`,
            params: { series: series.join(',') }
        });
        return response.data;
    }

    async values(series: string[], timeSpec: any = {}): Promise<MetricValue[]> {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/values`,
            params: {
                series: series.join(','),
                ...timeSpec
            }
        });
        const instances = response.data;
        return _.isArray(instances) ? instances : []; // TODO: on error, pmproxy returns an object (should be an empty array)
    }

    async metrics(pattern: string): Promise<string[]> {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/metrics`,
            params: { match: pattern }
        });
        const metrics = response.data;
        return _.isArray(metrics) ? metrics : []; // TODO: on error (no metrics found), pmproxy returns an object (should be an empty array)
    }

    async labels(series: string[]): Promise<LabelsResponse[]> {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/labels`,
            params: { series: series.join(',') }
        });
        return response.data;
    }

}

export class PmSeriesSrv {

    private pmSeriesApi: PmSeriesApi;
    private descriptionCache: Record<string, Description> = {}; // descriptionCache[series] = description;
    private instanceCache: Record<string, Record<string, Instance>> = {}; // instanceCache[series][instance] = instance;
    private labelCache: Record<string, Labels> = {}; // labelCache[series_or_instance] = labels;
    private metricNamesCache: Record<string, string[]> = {}; // metricNamesCache[prefix] = name[];

    constructor(datasourceRequest: DatasourceRequestFn, url: string) {
        this.pmSeriesApi = new PmSeriesApi(datasourceRequest, url);
    }

    async ping() {
        return this.pmSeriesApi.ping();
    }

    async query(expr: string): Promise<string[]> {
        return this.pmSeriesApi.query(expr);
    }

    async getDescriptions(series: string[]): Promise<Record<string, Description>> {
        const requiredSeries = _.difference(series, Object.keys(this.descriptionCache));
        if (requiredSeries.length > 0) {
            const descriptions = await this.pmSeriesApi.descs(requiredSeries);
            for (const description of descriptions) {
                this.descriptionCache[description.series] = description;
            }
        }
        return _.pick(this.descriptionCache, series);
    }

    async getInstances(series: string[], ignoreCache = false): Promise<Record<string, Record<string, Instance>>> {
        const requiredSeries = ignoreCache ? series : _.difference(series, Object.keys(this.instanceCache));
        if (requiredSeries.length > 0) {
            const instances = await this.pmSeriesApi.instances(requiredSeries);
            for (const serie of requiredSeries) {
                this.instanceCache[serie] = {};
            }
            for (const instance of instances) {
                this.instanceCache[instance.series][instance.instance] = instance;
            }
        }
        return _.pick(this.instanceCache, series);
    }

    async getInstance(series: string, instance: string, cacheOnly = false): Promise<Instance | undefined> {
        if (!(series in this.instanceCache && instance in this.instanceCache[series]) && !cacheOnly)
            await this.getInstances([series], true);
        return (this.instanceCache[series] || {})[instance];
    }

    async getValues(series: string[], timeSpec: any = {}) {
        return this.pmSeriesApi.values(series, timeSpec);
    }

    async getMetrics(pattern: string): Promise<string[]> {
        if (!(pattern in this.metricNamesCache)) {
            this.metricNamesCache[pattern] = await this.pmSeriesApi.metrics(pattern);
        }
        return this.metricNamesCache[pattern];
    }

    async getLabels(series: string[]): Promise<Record<string, Labels>> {
        const requiredSeries = _.difference(series, Object.keys(this.labelCache));
        if (requiredSeries.length > 0) {
            const response = await this.pmSeriesApi.labels(series);
            for (const labels of response) {
                this.labelCache[labels.series] = labels.labels;
            }
        }
        return _.pick(this.labelCache, series);
    }

    async getMetricAndInstanceLabels(series: string[]) {
        const descriptions = await this.getDescriptions(series);
        const [seriesWithIndoms, seriesWithoutIndoms] = _.partition(series, serie => descriptions[serie].indom !== PM_INDOM_NULL);
        let instanceIds: string[] = [];
        if (seriesWithIndoms.length > 0) {
            const instances = await this.getInstances(seriesWithIndoms);
            instanceIds = Object.values(instances).flatMap(Object.keys);
        }
        return await this.getLabels([...seriesWithoutIndoms, ...instanceIds]);
    }

    async getQualifiers(metric: string): Promise<Record<string, string[]>> {
        const seriesList = await this.query(metric);
        if (seriesList.length === 0)
            return {};

        const qualifiers: Record<string, string[]> = {};

        const descriptions = await this.getDescriptions(seriesList);
        const seriesWithIndoms = seriesList.filter(series => descriptions[series].indom !== PM_INDOM_NULL);
        if (seriesWithIndoms.length > 0) {
            const instances = await this.getInstances(seriesWithIndoms);
            qualifiers["instance.name"] = Object.values(instances).flatMap(Object.values).map(instance => instance.name);
        }

        const labels = await this.getMetricAndInstanceLabels(seriesList);
        for (const label of Object.values(labels)) {
            for (const [key, value] of Object.entries(label)) {
                const valueStr = value.toString();
                if (!(key in qualifiers))
                    qualifiers[key] = [];
                if (!qualifiers[key].includes(valueStr))
                    qualifiers[key].push(valueStr);
            }
        }
        return qualifiers;
    }

}
