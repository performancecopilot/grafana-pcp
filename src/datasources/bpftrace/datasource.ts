import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MetricFindValue,
} from '@grafana/data';
import { DefaultRequestOptions, CompletePmapiQuery } from '../lib/types';
import { defaults } from 'lodash';
import { isBlank, interval_to_ms, getDashboardRefreshInterval } from '../lib/utils';
import { Poller, QueryResult, Target } from '../lib/poller';
import { PmApi } from '../lib/pmapi';
import { processTargets } from '../lib/data_processor';
import { getTemplateSrv } from '@grafana/runtime';
import * as config from './config';
import { BPFtraceQuery, BPFtraceOptions, defaultBPFtraceQuery } from './types';
import { ScriptManager } from './script_manager';

interface DataSourceState {
    defaultRequestOptions: DefaultRequestOptions;
    pmApi: PmApi;
    poller: Poller;
    scriptManager: ScriptManager;
}

export class DataSource extends DataSourceApi<BPFtraceQuery, BPFtraceOptions> {
    state: DataSourceState;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<BPFtraceOptions>) {
        super(instanceSettings);

        this.instanceSettings.jsonData = defaults(this.instanceSettings.jsonData, {
            hostspec: config.defaults.hostspec,
            retentionTime: config.defaults.retentionTime,
        });

        const defaultRequestOptions: DefaultRequestOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (this.instanceSettings.basicAuth || this.instanceSettings.withCredentials) {
            defaultRequestOptions.withCredentials = true;
        }
        if (this.instanceSettings.basicAuth) {
            defaultRequestOptions.headers['Authorization'] = this.instanceSettings.basicAuth;
        }

        const retentionTimeMs = interval_to_ms(this.instanceSettings.jsonData.retentionTime!);
        const refreshIntervalMs = getDashboardRefreshInterval() || 1000;

        const pmApi = new PmApi(defaultRequestOptions);
        const poller = new Poller(pmApi, refreshIntervalMs, retentionTimeMs, this.registerTarget.bind(this));
        const scriptManager = new ScriptManager(pmApi);

        this.state = {
            defaultRequestOptions,
            pmApi,
            poller,
            scriptManager,
        };

        document.addEventListener('visibilitychange', () => {
            this.state.poller.setPageVisibility(!document.hidden);
        });
    }

    async registerTarget(target: Target) {
        await this.state.scriptManager.register(target.query.url, target.query.hostspec, target.query.expr);
    }

    async metricFindQuery(query: string, options?: any): Promise<MetricFindValue[]> {
        query = getTemplateSrv().replace(query.trim());
        const metricValues = await this.state.pmApi.getMetricValues(this.instanceSettings.url!, null, [query]);
        return metricValues.values[0].instances.map(instance => ({ text: instance.value.toString() }));
    }

    buildQueries(request: DataQueryRequest<BPFtraceQuery>): Array<CompletePmapiQuery<BPFtraceQuery>> {
        return request.targets
            .map(target => defaults(target, defaultBPFtraceQuery))
            .filter(target => !target.hide && !isBlank(target.expr))
            .map(target => {
                const url = target.url ?? this.instanceSettings.url;
                const hostspec = target.hostspec ?? this.instanceSettings.jsonData.hostspec;
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
                    targetId: `${request.dashboardId}/${request.panelId}/${target.refId}`,
                };
            });
    }

    async query(request: DataQueryRequest<BPFtraceQuery>): Promise<DataQueryResponse> {
        const refreshInterval = getDashboardRefreshInterval();
        if (refreshInterval) {
            this.state.poller.setRefreshInterval(refreshInterval);
        }
        console.log('q');

        const queries = this.buildQueries(request);
        const result = queries.map(query => this.state.poller.query(query)).filter(result => !!result) as QueryResult[];
        const data = processTargets(request, result, 10);
        return { data };
    }

    async testDatasource() {
        try {
            const context = await this.state.pmApi.createContext(
                this.instanceSettings.url!,
                this.instanceSettings.jsonData.hostspec!
            );
            const pmcdVersionMetric = await this.state.pmApi.getMetricValues(
                this.instanceSettings.url!,
                context.context,
                ['pmcd.version']
            );
            return {
                status: 'success',
                message: `Data source is working, using PCP Version ${pmcdVersionMetric.values[0].instances[0].value}`,
            };
        } catch (error) {
            return {
                status: 'error',
                message: `${error.message}. To use this data source, please configure the URL in the query editor.`,
            };
        }
    }
}
