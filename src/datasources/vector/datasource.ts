import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import {
    VectorQuery,
    VectorOptions,
    defaultQuery,
    VectorQueryWithEndpointInfo,
    DefaultBackendSrvRequestOptions,
} from './types';
import { defaults } from 'lodash';
import { isBlank, interval_to_ms, getDashboardRefreshInterval } from './utils';
import { Poller, QueryResult } from './poller';
import { PmApi } from './pmapi';
import { processTargets } from './data_processor';
import { getTemplateSrv } from '@grafana/runtime';
import * as config from './config';

interface DataSourceState {
    defaultBackendSrvRequestOptions: DefaultBackendSrvRequestOptions;
}

export class DataSource extends DataSourceApi<VectorQuery, VectorOptions> {
    state: DataSourceState;
    poller: Poller;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings);
        this.state = {
            defaultBackendSrvRequestOptions: {
                headers: {},
            },
        };

        this.state.defaultBackendSrvRequestOptions.headers['Content-Type'] = 'application/json';
        if (this.instanceSettings.basicAuth || this.instanceSettings.withCredentials) {
            this.state.defaultBackendSrvRequestOptions.withCredentials = true;
        }
        if (this.instanceSettings.basicAuth) {
            this.state.defaultBackendSrvRequestOptions.headers['Authorization'] = this.instanceSettings.basicAuth;
        }

        this.instanceSettings.jsonData = {
            hostspec: this.instanceSettings.jsonData.hostspec || config.defaults.hostspec,
            retentionTime: this.instanceSettings.jsonData.retentionTime || config.defaults.retentionTime,
        };
        const retentionTimeMs = interval_to_ms(this.instanceSettings.jsonData.retentionTime!);
        const refreshIntervalMs = getDashboardRefreshInterval() || 1000;

        const pmApi = new PmApi(this.state.defaultBackendSrvRequestOptions);
        this.poller = new Poller(pmApi, refreshIntervalMs, retentionTimeMs);
    }

    buildQueries(request: DataQueryRequest<VectorQuery>): VectorQueryWithEndpointInfo[] {
        return request.targets
            .map(target => defaults(target, defaultQuery))
            .filter(target => !target.hide && !isBlank(target.expr))
            .map(target => {
                const url = target.url || this.instanceSettings.url;
                const hostspec = target.hostspec || this.instanceSettings.jsonData.hostspec;
                if (isBlank(url)) {
                    throw new Error(
                        'Please specify a connection URL in the datasource settings or in the query editor.'
                    );
                }
                if (isBlank(hostspec)) {
                    throw new Error(
                        'Please specify a host specification in the datasource settings or in the query editor.'
                    );
                }

                return {
                    ...target,
                    expr: getTemplateSrv().replace(target.expr.trim(), request.scopedVars),
                    url: getTemplateSrv().replace(url!, request.scopedVars),
                    hostspec: getTemplateSrv().replace(hostspec!, request.scopedVars),
                };
            });
    }

    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const refreshInterval = getDashboardRefreshInterval();
        if (refreshInterval) {
            this.poller.setRefreshInterval(refreshInterval);
        }

        const queries = this.buildQueries(request);
        const result = queries.map(query => this.poller.query(query)).filter(result => !!result) as QueryResult[];
        const data = processTargets(request, result, 10);
        return { data };
    }

    async testDatasource() {
        try {
            await new PmApi(this.state.defaultBackendSrvRequestOptions).createContext(
                this.instanceSettings.url!,
                this.instanceSettings.jsonData.hostspec!
            );
            return {
                status: 'success',
                message: 'Data source is working',
            };
        } catch (error) {
            return {
                status: 'error',
                message: `${error.message}. To use this data source, please configure the URL in the query editor.`,
            };
        }
    }
}
