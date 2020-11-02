import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { PmApiService } from 'common/services/pmapi/PmApiService';
import { PmapiDefaultOptions, PmapiOptions, PmapiQuery, TemplatedPmapiQuery } from './types';
import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MetricFindValue,
    ScopedVars,
} from '@grafana/data';
import { getLogger, interval_to_ms, isBlank } from 'common/utils';
import { PmSeriesApiService } from 'common/services/pmseries/PmSeriesApiService';
import { processQueries } from './data_processor';
import { QueryResult } from './poller/types';
import { Poller } from './poller/poller';
const log = getLogger('datasource_base');

export abstract class DatasourceBase<Q extends PmapiQuery, O extends PmapiOptions> extends DataSourceApi<Q, O> {
    url?: string;
    hostspec: string;
    retentionTimeMs: number;
    pmApiService: PmApiService;
    pmSeriesApiService: PmSeriesApiService;
    poller?: Poller;

    constructor(
        readonly instanceSettings: DataSourceInstanceSettings<O>,
        defaults: PmapiDefaultOptions,
        apiTimeoutMs: number
    ) {
        super(instanceSettings);
        this.url = instanceSettings.url;
        this.hostspec = instanceSettings.jsonData.hostspec ?? defaults.hostspec;
        this.retentionTimeMs = interval_to_ms(instanceSettings.jsonData.retentionTime ?? defaults.retentionTime);
        this.pmApiService = new PmApiService(getBackendSrv(), {
            dsInstanceSettings: instanceSettings,
            timeoutMs: apiTimeoutMs,
        });
        this.pmSeriesApiService = new PmSeriesApiService(getBackendSrv(), {
            dsInstanceSettings: instanceSettings,
            baseUrl: this.url!,
            timeoutMs: apiTimeoutMs,
        });
    }

    filterQuery(query: PmapiQuery): boolean {
        // remove targets with container hostspec set to empty string
        // happens in the Vector Container Overview dashboard, when selecting "All" and no containers are present
        // $container gets replaced with "", and then PCP returns values for all cgroups
        return !(query.hide === true || isBlank(query.expr) || /container=(&|$)/.test(query.hostspec ?? ''));
    }

    getUrlAndHostspec(query?: Q, scopedVars = {}): { url: string; hostspec: string } {
        const url = getTemplateSrv().replace(query?.url ?? this.url ?? '', scopedVars);
        const orInTheQueryErrorText = query ? ' or in the query editor' : '';

        if (isBlank(url)) {
            throw new Error(`Please specify a connection URL in the datasource settings${orInTheQueryErrorText}.`);
        }

        const hostspec = getTemplateSrv().replace(query?.hostspec ?? this.hostspec, scopedVars);
        if (isBlank(hostspec)) {
            throw new Error(`Please specify a host specification in the datasource settings${orInTheQueryErrorText}.`);
        }

        return { url, hostspec };
    }

    applyTemplateVariables(query: Q, scopedVars: ScopedVars): TemplatedPmapiQuery {
        const expr = getTemplateSrv().replace(query.expr.trim(), scopedVars);
        const { url, hostspec } = this.getUrlAndHostspec(query, scopedVars);
        return {
            ...query,
            expr,
            url,
            hostspec,
        };
    }

    async metricFindQuery(query: string): Promise<MetricFindValue[]> {
        query = getTemplateSrv().replace(query.trim());
        const { url, hostspec } = this.getUrlAndHostspec();
        const context = await this.pmApiService.createContext(url, { hostspec });
        const metricValues = await this.pmApiService.fetch(url, { context: context.context, names: [query] });
        return metricValues.values[0].instances.map(instance => ({ text: instance.value.toString() }));
    }

    getDashboardRefreshInterval() {
        const interval = new URLSearchParams(window.location.search).get('refresh');
        return interval ? interval_to_ms(interval) : undefined;
    }

    async query(request: DataQueryRequest<Q>): Promise<DataQueryResponse> {
        if (!this.poller) {
            return { data: [] };
        }
        const refreshInterval = this.getDashboardRefreshInterval();
        if (refreshInterval) {
            this.poller.setRefreshInterval(refreshInterval);
        }

        const queryResults = request.targets
            .filter(this.filterQuery)
            .map(query => this.applyTemplateVariables(query, request.scopedVars))
            .filter(this.filterQuery) // filter again after applying template variables
            .map(query => this.poller?.query(request, query))
            .filter(result => result !== null) as QueryResult[];
        const data = processQueries(request, queryResults, this.poller.state.refreshIntervalMs / 1000);

        log.debug('query', request, data);
        return { data };
    }

    async testDatasource() {
        try {
            const { url, hostspec } = this.getUrlAndHostspec();
            const context = await this.pmApiService.createContext(url, { hostspec });
            const pmcdVersionMetric = await this.pmApiService.fetch(url, {
                context: context.context,
                names: ['pmcd.version'],
            });
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
