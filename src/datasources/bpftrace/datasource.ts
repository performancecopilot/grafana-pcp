import {
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings,
    MetricFindValue,
} from '@grafana/data';
import { DefaultRequestOptions, CompletePmapiQuery } from '../lib/types';
import { defaults, keyBy } from 'lodash';
import { interval_to_ms, getDashboardRefreshInterval, getLogger } from '../lib/utils';
import { Poller, QueryResult, Target, Endpoint, TargetState } from '../lib/poller';
import { PmApi } from '../lib/pmapi';
import { processTargets } from '../lib/data_processor';
import { getTemplateSrv } from '@grafana/runtime';
import * as config from './config';
import { BPFtraceQuery, BPFtraceOptions, defaultBPFtraceQuery, BPFtraceTargetData } from './types';
import { ScriptManager } from './script_manager';
import { buildQueries, testDatasource, getRequestOptions } from '../lib/pmapi_datasource_utils';
import { Status, Script } from './script';
const log = getLogger('datasource');

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

        const defaultRequestOptions = getRequestOptions(this.instanceSettings);
        const retentionTimeMs = interval_to_ms(this.instanceSettings.jsonData.retentionTime!);
        const refreshIntervalMs = getDashboardRefreshInterval() ?? 1000;

        const pmApi = new PmApi(defaultRequestOptions);
        const poller = new Poller(pmApi, refreshIntervalMs, retentionTimeMs, {
            queryHasChanged: this.queryHasChanged,
            registerEndpoint: this.registerEndpoint.bind(this),
            registerTarget: this.registerTarget.bind(this),
            deregisterTarget: this.deregisterTarget.bind(this),
        });
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

    queryHasChanged(prevQuery: CompletePmapiQuery, newQuery: CompletePmapiQuery) {
        return newQuery.expr !== prevQuery.expr || newQuery.format !== prevQuery.format;
    }

    async registerEndpoint(endpoint: Endpoint) {
        endpoint.additionalMetricsToPoll.push({
            name: 'bpftrace.info.scripts_json',
            callback: values => {
                const scriptsList = JSON.parse(values[0].value as string) as Script[];
                const scriptsById = keyBy(scriptsList, 'script_id');

                for (const target of endpoint.targets as Array<Target<BPFtraceTargetData>>) {
                    const scriptId = target.custom?.script?.script_id;
                    if (!scriptId) {
                        return;
                    }

                    const script = scriptsById[scriptId];
                    if (script?.state.status === Status.Error) {
                        target.errors.push(new Error(`BPFtrace error:\n\n${script.state.error}`));
                        target.state = TargetState.ERROR;
                    }
                }
            },
        });
    }

    async registerTarget(target: Target<BPFtraceTargetData>) {
        const script = await this.state.scriptManager.register(
            target.query.url,
            target.query.hostspec,
            target.query.expr
        );
        if (script.state.status === Status.Error) {
            throw new Error(`BPFtrace error:\n\n${script.state.error}`);
        }
        target.custom = { script };
        return this.state.scriptManager.getMetrics(target.custom.script, target.query.format);
    }

    deregisterTarget(target: Target<BPFtraceTargetData>) {
        if (target.custom?.script) {
            this.state.scriptManager.deregister(target.query.url, target.query.hostspec, target.custom.script);
        }
    }

    async metricFindQuery(query: string, options?: any): Promise<MetricFindValue[]> {
        query = getTemplateSrv().replace(query.trim());
        const metricValues = await this.state.pmApi.getMetricValues(this.instanceSettings.url!, null, [query]);
        return metricValues.values[0].instances.map(instance => ({ text: instance.value.toString() }));
    }

    async query(request: DataQueryRequest<BPFtraceQuery>): Promise<DataQueryResponse> {
        const refreshInterval = getDashboardRefreshInterval();
        if (refreshInterval) {
            this.state.poller.setRefreshInterval(refreshInterval);
        }

        const queries = buildQueries(
            request,
            defaultBPFtraceQuery,
            this.instanceSettings.url,
            this.instanceSettings.jsonData.hostspec
        );
        const result = queries
            .map(query => this.state.poller.query(query))
            .filter(result => result !== null) as QueryResult[];
        const data = processTargets(request, result, 1);

        log.debug('query', request, data);
        return { data };
    }

    async testDatasource() {
        await testDatasource(this.state.pmApi, this.instanceSettings.url!, this.instanceSettings.jsonData.hostspec!);
    }
}
