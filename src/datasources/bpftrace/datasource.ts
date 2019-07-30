///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from 'lodash';
import { PcpLiveDatasourceBase } from '../lib/datasource_base';
import BPFtraceEndpoint from './bpftrace_endpoint';
import { Query, QueryTarget } from '../lib/types';
import ScriptRegistry from './script_registry';

export class PCPBPFtraceDatasource extends PcpLiveDatasourceBase<BPFtraceEndpoint> {

    /** @ngInject **/
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any, variableSrv: any) {
        super(instanceSettings, backendSrv, templateSrv, variableSrv);

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);
    }

    doPollAll() {
        let promises: Promise<void>[] = [];
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.datastore.cleanExpiredMetrics();
            endpoint.poller.cleanupExpiredMetrics();
            endpoint.scriptRegistry.cleanupExpiredScripts();
            promises.push(endpoint.poller.poll());
        }
        return Promise.all(promises);
    }

    configureEndpoint(endpoint: BPFtraceEndpoint) {
        endpoint.scriptRegistry = new ScriptRegistry(endpoint.context, endpoint.poller, endpoint.datastore, this.keepPollingMs);
    }

    async handleTarget(endpoint: BPFtraceEndpoint, query: Query, target: QueryTarget) {
        let script = await endpoint.scriptRegistry.ensureActive(target.expr);
        let metrics: string[];

        if (script.status === "started" || script.status === "starting") {
            metrics = await script.getDataMetrics(endpoint.context, target.format);
        }
        else {
            throw { message: `BPFtrace error:\n\n${script.output}` };
        }

        await endpoint.poller.ensurePolling(metrics);
        return endpoint.datastore.queryMetrics(target, metrics, query.range.from.valueOf(), query.range.to.valueOf());
    }

}
