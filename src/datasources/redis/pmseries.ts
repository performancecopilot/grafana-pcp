import _ from 'lodash';

export interface Description {
    semantics: string;
    indom: string;
}

export class PmSeries {

    private descriptionCache: Record<string, Description> = {}; // descriptionCache[series] = description;
    private instanceCache: Record<string, Record<string, string>> = {}; // instanceCache[series][instance] = name;
    private labelCache: Record<string, Description> = {}; // labelCache[series] = labels;
    private metricNamesCache: Record<string, string[]> = {}; // metricNamesCache[prefix] = name[];

    constructor(private datasourceRequest: (options: any) => any,
        private url: string) {
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

    async descs(series: string[]): Promise<Record<string, Description>> {
        const requiredSeries = _.difference(series, Object.keys(this.descriptionCache));
        if (requiredSeries.length > 0) {
            const response = await this.datasourceRequest({
                url: `${this.url}/series/descs`,
                params: { series: requiredSeries.join(',') }
            });

            for (const description of response.data) {
                this.descriptionCache[description.series] = description;
            }
        }
        return _.pick(this.descriptionCache, series);
    }

    async instances(series: string[], force: boolean = false): Promise<Record<string, Record<string, string>>> {
        const requiredSeries = force ? series : _.difference(series, Object.keys(this.instanceCache));
        if (requiredSeries.length > 0) {
            const response = await this.datasourceRequest({
                url: `${this.url}/series/instances`,
                params: { series: requiredSeries.join(',') }
            });

            for (const instance of response.data) {
                if (!(instance.series in this.instanceCache))
                    this.instanceCache[instance.series] = {};
                this.instanceCache[instance.series][instance.instance] = instance.name;
            }
        }
        return _.pick(this.instanceCache, series);
    }

    private getInstanceName(series: string, instance: string): string | undefined {
        if (!(series in this.instanceCache))
            return undefined;
        return this.instanceCache[series][instance];
    }

    private async updateInstanceNames(instances: any[]) {
        // max 1 refresh per series
        let refreshed: Record<string, boolean> = {};
        for (const instance of instances) {
            if (!instance.instance) { // this metric has no instances (single value)
                instance.instanceName = "";
                continue;
            }

            instance.instanceName = this.getInstanceName(instance.series, instance.instance) || "";
            if (instance.instanceName === "" && !refreshed[instance.series]) {
                await this.instances([instance.series], true);
                instance.instanceName = this.getInstanceName(instance.series, instance.instance) || "";
                refreshed[instance.series] = true;
            }
        }
    }

    instancesOfSeries(series: string) {
        return series in this.instanceCache ? Object.keys(this.instanceCache[series]) : [];
    }

    async values(series: string[], timeSpec: any = {}, instanceNames: boolean = false) {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/values`,
            params: {
                series: series.join(','),
                ...timeSpec
            }
        });

        const instances = response.data;
        if (!_.isArray(instances)) // TODO: on error, pmproxy returns an object (should be an empty array)
            return [];

        if (instanceNames) {
            await this.updateInstanceNames(instances);
        }
        return instances;
    }

    async metrics(pattern: string): Promise<string[]> {
        if (!(pattern in this.metricNamesCache)) {
            const response = await this.datasourceRequest({
                url: `${this.url}/series/metrics`,
                params: { match: pattern }
            });
            this.metricNamesCache[pattern] = response.data;
        }
        return this.metricNamesCache[pattern];
    }

    async labels(series: string[]): Promise<Record<string, Record<string, any>>> {
        const requiredSeries = _.difference(series, Object.keys(this.labelCache));
        if (requiredSeries.length > 0) {
            const response = await this.datasourceRequest({
                url: `${this.url}/series/labels`,
                params: { series: requiredSeries.join(',') }
            });
            const data = _.isArray(response.data) ? response.data : [];
            for (const labels of data) {
                this.labelCache[labels.series] = labels.labels;
            }
        }
        return _.pick(this.labelCache, series);
    }

}
