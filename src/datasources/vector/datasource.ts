import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MetricFindValue,
} from '@grafana/data';
import { DefaultRequestOptions, QueryResult } from '../lib/models/pcp';
import { defaults } from 'lodash';
import { interval_to_ms, getDashboardRefreshInterval, getLogger } from '../lib/utils';
import { Poller, Endpoint } from '../lib/poller';
import { PmApi } from '../lib/pmapi';
import { processTargets } from '../lib/data_processor';
import * as config from './config';
import { VectorQuery, VectorOptions, defaultVectorQuery, VectorTargetData } from './types';
import { buildQueries, testDatasource, metricFindQuery } from '../lib/pmapi_datasource_utils';
import { getRequestOptions } from '../../lib/utils/api';
import { CompletePmapiQuery, PmapiTarget } from '../lib/models/pmapi';
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

    queryHasChanged(prevQuery: CompletePmapiQuery, newQuery: CompletePmapiQuery) {
        return newQuery.expr !== prevQuery.expr;
    }

    isDerivedMetric(expr: string) {
        // TODO
        return false;
    }

    async registerTarget(target: PmapiTarget<VectorTargetData>) {
        target.custom = {
            isDerivedMetric: this.isDerivedMetric(target.query.expr),
        };

        if (target.custom.isDerivedMetric) {
            // TOOD: register derived metric
            return ['derived_hash(target.query.expr)'];
        } else {
            return [target.query.expr];
        }
    }

    async redisBackfill(endpoint: Endpoint, targets: Array<PmapiTarget<VectorTargetData>>) {
        // TODO: store metric values from redis (if available) in Metric#values
    }

    async metricFindQuery(query: string, options?: any): Promise<MetricFindValue[]> {
        return await metricFindQuery(query);
    }

    async query(request: DataQueryRequest<VectorQuery>): Promise<DataQueryResponse> {
        const refreshInterval = getDashboardRefreshInterval();
        if (refreshInterval) {
            this.state.poller.setRefreshInterval(refreshInterval);
        }

        const queries = buildQueries(
            request,
            defaultVectorQuery,
            this.instanceSettings.url,
            this.instanceSettings.jsonData.hostspec
        );
        const result = queries
            .map(query =>
                this.state.poller.query(query, request.range?.from.valueOf()!, request.range?.to.valueOf()!, 1)
            )
            .filter(result => result !== null) as QueryResult[];
        const data = processTargets(request, result);

        log.debug('query', request, queries, data);
        return { data };
    }

    async testDatasource() {
        return await testDatasource(
            this.state.pmApi,
            this.instanceSettings.url!,
            this.instanceSettings.jsonData.hostspec!
        );
    }
}
