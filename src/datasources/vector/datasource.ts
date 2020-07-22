import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MetricFindValue,
} from '@grafana/data';
import { DefaultRequestOptions, CompletePmapiQuery } from '../lib/types';
import { defaults } from 'lodash';
import { interval_to_ms, getDashboardRefreshInterval, getLogger } from '../lib/utils';
import { Poller, Target, Endpoint, QueryResult } from '../lib/poller';
import { PmApi } from '../lib/pmapi';
import { processTargets } from '../lib/data_processor';
import { getTemplateSrv } from '@grafana/runtime';
import * as config from './config';
import { Expr } from '../lib/pcp';
import { VectorQuery, VectorOptions, defaultVectorQuery } from './types';
import { buildQueries, testDatasource, getRequestOptions } from '../lib/pmapi_datasource_utils';
const log = getLogger('datasource');

interface DataSourceState {
    defaultRequestOptions: DefaultRequestOptions;
    pmApi: PmApi;
    poller: Poller;
}

export class DataSource extends DataSourceApi<VectorQuery, VectorOptions> {
    state: DataSourceState;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<VectorOptions>) {
        super(instanceSettings);

        this.instanceSettings.jsonData = defaults(this.instanceSettings.jsonData, {
            hostspec: config.defaults.hostspec,
            retentionTime: config.defaults.retentionTime,
        });

        const defaultRequestOptions = getRequestOptions(this.instanceSettings);
        const retentionTimeMs = interval_to_ms(this.instanceSettings.jsonData.retentionTime!);
        const refreshIntervalMs = getDashboardRefreshInterval() ?? 1000;

        const pmApi = new PmApi(defaultRequestOptions);
        const poller = new Poller(pmApi, refreshIntervalMs, retentionTimeMs, {
            queryHasChanged: this.queryHasChanged,
            registerTarget: this.registerTarget.bind(this),
            redisBackfill: this.redisBackfill.bind(this),
        });

        this.state = {
            defaultRequestOptions,
            pmApi: pmApi,
            poller: poller,
        };

        document.addEventListener('visibilitychange', () => {
            this.state.poller.setPageVisibility(!document.hidden);
        });
    }

    isDerivedMetric(expr: Expr) {
        // TODO
        return false;
    }

    queryHasChanged(prevQuery: CompletePmapiQuery, newQuery: CompletePmapiQuery) {
        return newQuery.expr !== prevQuery.expr;
    }

    async registerTarget(target: Target) {
        target.custom = {};

        if (this.isDerivedMetric(target.query.expr)) {
            target.custom.isDerivedMetric = true;
            return ['derived_XXX']; // TOOD: register derived metric
        } else {
            target.custom.isDerivedMetric = false;
            return [target.query.expr];
        }
    }

    async redisBackfill(endpoint: Endpoint, targets: Target[]) {
        // TODO: store metric values from redis (if available) in Metric#values
    }

    async metricFindQuery(query: string, options?: any): Promise<MetricFindValue[]> {
        query = getTemplateSrv().replace(query.trim());
        const metricValues = await this.state.pmApi.getMetricValues(this.instanceSettings.url!, null, [query]);
        return metricValues.values[0].instances.map(instance => ({ text: instance.value.toString() }));
    }

    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const refreshInterval = getDashboardRefreshInterval();
        if (refreshInterval) {
            this.state.poller.setRefreshInterval(refreshInterval);
        }

        const queries = buildQueries(
            request,
            defaultVectorQuery,
            this.instanceSettings.url!,
            this.instanceSettings.jsonData.hostspec!
        );
        const result = queries
            .map(query => this.state.poller.query(query))
            .filter(result => result !== null) as QueryResult[];
        const data = processTargets(request, result, 10);

        log.debug('query', request, data);
        return { data };
    }

    async testDatasource() {
        await testDatasource(this.state.pmApi, this.instanceSettings.url!, this.instanceSettings.jsonData.hostspec!);
    }
}
