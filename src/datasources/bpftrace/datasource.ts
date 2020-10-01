import { DataSourceInstanceSettings } from '@grafana/data';
import { keyBy } from 'lodash';
import { BPFtraceQuery, BPFtraceOptions, BPFtraceTargetData } from './types';
import { ScriptManager } from './script_manager';
import { Status, Script } from './script';

import { DatasourceBase } from 'datasources/lib/pmapi/datasource_base';
import { Poller } from 'datasources/lib/pmapi/poller/poller';
import { PmapiQuery, Target, TargetState } from 'datasources/lib/pmapi/types';
import { Endpoint } from 'datasources/lib/pmapi/poller/types';
import { getLogger } from 'common/utils';
import { Config } from './config';
const log = getLogger('datasource');

export class DataSource extends DatasourceBase<BPFtraceQuery, BPFtraceOptions> {
    poller: Poller;
    scriptManager: ScriptManager;

    constructor(readonly instanceSettings: DataSourceInstanceSettings<BPFtraceOptions>) {
        super(instanceSettings, Config.defaults, Config.apiTimeoutMs);
        log.debug('initializate bpftrace datasource');
        this.poller = new Poller(this.pmApiService, this.pmSeriesApiService, {
            retentionTimeMs: this.retentionTimeMs,
            refreshIntervalMs: this.getDashboardRefreshInterval() ?? 1000,
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

    queryHasChanged(prevQuery: PmapiQuery, newQuery: PmapiQuery) {
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
        const script = await this.scriptManager.register(target.query.url, target.query.hostspec, target.query.expr);
        if (script.state.status === Status.Error) {
            throw new Error(`BPFtrace error:\n\n${script.state.error}`);
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
