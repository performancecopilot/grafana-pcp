import _ from 'lodash';

export interface Description {
    semantics: string;
}

export class PmSeries {

    private descriptionCache: Record<string, Description> = {}; // descriptionCache[series] = description;
    private instanceCache: Record<string, Record<string, string>> = {}; // instanceCache[series][instance] = name;
    private labelCache: Record<string, Description> = {}; // labelCache[series] = labels;

    constructor(private datasourceRequest: (options: any) => any,
        private url: string) {
    }

    async ping() {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/ping`
        });
        return response;
    }

    async query(expr: string) {
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
        return _.pick(this.descriptionCache, series); // _.pick ignores non-existing keys
    }

    private async refreshInstances(series: string[]) {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/instances`,
            params: { series: series.join(',') }
        });

        const instances = response.data;
        for (const instance of instances) {
            if (!(instance.series in this.instanceCache))
                this.instanceCache[instance.series] = {};
            this.instanceCache[instance.series][instance.instance] = instance.name;
        }
    }

    private async updateInstanceNames(instances: any[]) {
        // max 1 refresh per series
        let refreshed: Record<string, boolean> = {};
        for (const instance of instances) {
            if (!instance.instance) { // this metric has no instances (single value)
                instance.instanceName = "";
                continue;
            }

            if (!(instance.series in this.instanceCache)) {
                await this.refreshInstances([instance.series]);
                refreshed[instance.series] = true;
            }

            instance.instanceName = this.instanceCache[instance.series][instance.instance] || "";
            if (instance.instanceName === "" && !refreshed[instance.series]) {
                await this.refreshInstances([instance.series]);
                instance.instanceName = this.instanceCache[instance.series][instance.instance] || "";
                refreshed[instance.series] = true;
            }
        }
    }

    async values(series: string[], timeSpec: {}, instanceNames: boolean = false) {
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
        const response = await this.datasourceRequest({
            url: `${this.url}/series/metrics`,
            params: { target: pattern }
        });
        return response.data;
    }

    async labels(series?: string[]): Promise<Record<string, Record<string, any>>> {
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
        return _.pick(this.labelCache, series); // _.pick ignores non-existing keys
    }

    async labelNames(): Promise<string[]> {
        const response = await this.datasourceRequest({
            url: `${this.url}/series/labels`
        });
        const labels = response.data;
        return _.isArray(labels) ? labels : []; // TODO: on error, pmproxy returns an object (should be an empty array)
    }

}
