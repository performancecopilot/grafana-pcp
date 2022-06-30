import { defaultsDeep, keyBy } from 'lodash';
import { getLogger } from 'loglevel';
import { DataSourceInstanceSettings, ScopedVars } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { GenericError } from '../../common/types/errors';
import { DataSourceBase } from '../../datasources/lib/pmapi/datasource_base';
import { Poller } from '../../datasources/lib/pmapi/poller/poller';
import { EndpointWithCtx } from '../../datasources/lib/pmapi/poller/types';
import { PmapiQuery, Target, TargetState } from '../../datasources/lib/pmapi/types';
import { Config } from './config';
import { Script, Status } from './script';
import { ScriptManager } from './script_manager';
import { BPFtraceOptions, BPFtraceQuery, BPFtraceTargetData, defaultBPFtraceQuery } from './types';

const log = getLogger('datasource');

export class PCPBPFtraceDataSource extends DataSourceBase<BPFtraceQuery, BPFtraceOptions> {
    poller: Poller;
    scriptManager: ScriptManager;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<BPFtraceOptions>) {
        super(instanceSettings, Config.defaults, Config.apiTimeoutMs);
        log.debug('initializate bpftrace data source');
        this.poller = new Poller(this.pmApiService, this.pmSeriesApiService, {
            retentionTimeMs: this.retentionTimeMs,
            refreshIntervalMs: this.getDashboardRefreshInterval() ?? Config.defaultRefreshIntervalMs,
            gracePeriodMs: Config.gracePeriodMs,
            hooks: {
                queryHasChanged: this.queryHasChanged,
                registerEndpoint: this.registerEndpoint.bind(this),
                registerTarget: this.registerTarget.bind(this),
                deregisterTarget: this.deregisterTarget.bind(this),
            },
        });
        this.scriptManager = new ScriptManager(this.pmApiService);

        document.addEventListener('visibilitychange', () => {
            this.poller.setPageVisibility(!document.hidden);
        });
    }

    buildPmapiQuery(query: BPFtraceQuery, scopedVars: ScopedVars): PmapiQuery {
        const expr = getTemplateSrv().replace(query.expr?.trim(), scopedVars);
        const { url, hostspec } = this.getUrlAndHostspec(query, scopedVars);
        return defaultsDeep(
            {},
            {
                ...query,
                expr,
                url,
                hostspec,
            },
            defaultBPFtraceQuery
        );
    }

    /**
     * force a deregistration of the current target if the format has changed,
     * because then we need different metrics (e.g. heatmap format -> looking for histogram maps)
     */
    queryHasChanged(prevQuery: PmapiQuery, newQuery: PmapiQuery) {
        return newQuery.expr !== prevQuery.expr || newQuery.format !== prevQuery.format;
    }

    async registerEndpoint(endpoint: EndpointWithCtx) {
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
                    if (script && script.state.status === Status.Error) {
                        target.errors = [new GenericError(`BPFtrace error:\n\n${script.state.error}`)];
                        target.state = TargetState.ERROR;
                    }
                }
            },
        });
    }

    async registerTarget(endpoint: EndpointWithCtx, target: Target<BPFtraceTargetData>) {
        const script = await this.scriptManager.register(target.query.url, target.query.hostspec, target.query.expr);
        if (script.state.status === Status.Error) {
            throw new GenericError(`BPFtrace error:\n\n${script.state.error}`);
        }
        target.custom = { script };
        return this.scriptManager.getMetrics(target.custom.script, target.query.format);
    }

    deregisterTarget(target: Target<BPFtraceTargetData>) {
        if (target.custom?.script) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.scriptManager.deregister(target.query.url, target.query.hostspec, target.custom.script);
        }
    }
}
