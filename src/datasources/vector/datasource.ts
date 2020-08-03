import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MetricFindValue,
} from '@grafana/data';
import { DefaultRequestOptions, QueryResult } from '../lib/models/pcp';
import { defaults } from 'lodash';
import md5 from 'blueimp-md5';
import { interval_to_ms, getDashboardRefreshInterval, getLogger } from '../lib/utils';
import { Poller, Target, Endpoint, QueryResult, RegisterRequest } from '../lib/poller';
import { PmApi } from '../lib/pmapi';
import { processTargets } from '../lib/data_processor';
import * as config from './config';
import { VectorQuery, VectorOptions, defaultVectorQuery, VectorTargetData } from './types';
import { buildQueries, testDatasource, metricFindQuery } from '../lib/pmapi_datasource_utils';
import { getRequestOptions } from '../../lib/utils/api';
const log = getLogger('datasource');

interface DataSourceState {
    defaultRequestOptions: DefaultRequestOptions;
    pmApi: PmApi;
    poller: Poller;
    derivedMetrics: Map<string, string>;
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
            derivedMetrics: new Map<string, string>(),
        };

        document.addEventListener('visibilitychange', () => {
            this.state.poller.setPageVisibility(!document.hidden);
        });
    }

    queryHasChanged(prevQuery: CompletePmapiQuery, newQuery: CompletePmapiQuery) {
        return newQuery.expr !== prevQuery.expr;
    }

    isDerivedMetric(expr: Expr) {
        /* From: PCPIntro(1)
         * A node label must begin with an alphabetic character, followed by
         * zero or more characters drawn from the alphabetics, the digits and
         * character ``_'' (underscore).  For alphabetic characters in a node
         * label, upper and lower case are distinguished.
         *
         * By convention, the name of a performance metric is constructed by
         * concatenation of the node labels on a path through the PMNS from the
         * root node to a leaf node, with a ``.'' as a separator.
         *
         * -> Anything that is not a name is considered derived metric expression
         */
        return !/^[a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z][a-zA-Z0-9_]+)*$/.test(expr);
    }

    derivedMetricName(expr: string): string {
        return `derived_${md5(expr)}`;
    }

    async registerDerivedMetric(target: Target<VectorTargetData>): Promise<string[]> {
        const name = this.derivedMetricName(target.query.expr);
        const result = await this.state.pmApi.createDerived(this.instanceSettings.url!, target.query.expr, name);
        if (result.success) {
            this.state.derivedMetrics.set(target.query.expr, name);
            return [name];
        }
        return [];
    }

    async registerTarget(target: Target<VectorTargetData>): Promise<RegisterRequest> {
        target.custom = {
            isDerivedMetric: this.isDerivedMetric(target.query.expr),
        };
        if (target.custom.isDerivedMetric) {
            const key = this.state.derivedMetrics.get(target.query.expr);
            if (key) {
                return { metrics: [key] };
            }
            const metrics = await this.registerDerivedMetric(target);
            return { metrics, renewContext: true };
        } else {
            return { metrics: [target.query.expr] };
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
