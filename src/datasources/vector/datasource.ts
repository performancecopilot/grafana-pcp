
import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { VectorQuery, VectorOptions, defaultQuery, VectorQueryWithUrl, DatasourceRequestOptions } from './types';
import { defaults, every } from 'lodash';
import { isBlank, getTemplateSrv, interval_to_ms } from './utils';
import { Poller, PollerQueryResult } from './poller';
import { PmApi } from './pmapi';
import { processTargets } from './data_processor';

interface DataSourceState {
    datasourceRequestOptions: DatasourceRequestOptions;
}

export class DataSource extends DataSourceApi<VectorQuery, VectorOptions> {
    state: DataSourceState;
    poller: Poller;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings);
        this.state = {
            datasourceRequestOptions: {
                headers: {}
            }
        };

        this.state.datasourceRequestOptions.headers["Content-Type"] = "application/json";
        if (this.instanceSettings.basicAuth || this.instanceSettings.withCredentials)
            this.state.datasourceRequestOptions.withCredentials = true;
        if (this.instanceSettings.basicAuth)
            this.state.datasourceRequestOptions.headers["Authorization"] = this.instanceSettings.basicAuth;

        const retentionTimeMs = interval_to_ms(this.instanceSettings.jsonData.retentionTime || "10m");
        this.poller = new Poller(this.state.datasourceRequestOptions, retentionTimeMs);
    }

    buildQueryTargets(request: DataQueryRequest<VectorQuery>): VectorQueryWithUrl[] {
        return request.targets
            .map(target => defaults(target, defaultQuery))
            .filter(target => !target.hide && !isBlank(target.expr))
            .map(target => {
                const url = target.url || this.instanceSettings.url;
                if (isBlank(url))
                    throw new Error("Please specify a connection URL in the datasource settings or in the query editor.");
                return {
                    ...target,
                    expr: getTemplateSrv().replace(target.expr.trim(), request.scopedVars),
                    url: getTemplateSrv().replace(url, request.scopedVars),
                    container: target.container ? getTemplateSrv().replace(target.container, request.scopedVars) : undefined,
                };
            });
    }

    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const targets = this.buildQueryTargets(request);
        if (targets.length === 0)
            return { data: [] };
        if (!every(targets, ['format', targets[0].format]))
            throw new Error("Format must be the same for all queries of a panel.");

        const pollerQueryResult = targets
            .map(target => this.poller.query(target))
            .filter(result => result.metric) as Required<PollerQueryResult>[];
        return { data: processTargets(request, pollerQueryResult) };
    }

    async testDatasource() {
        try {
            await new PmApi(this.state.datasourceRequestOptions).createContext(this.instanceSettings.url!);
            return {
                status: 'success',
                message: 'Data source is working',
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `${error.message}. To use this data source, please configure the URL in the query editor.`
            };
        }
    }
}
