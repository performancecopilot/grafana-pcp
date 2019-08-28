import _ from 'lodash';
import { PCPLiveDatasourceBase } from '../lib/datasource_base';
import BPFtraceEndpoint from './bpftrace_endpoint';
import ScriptRegistry from './script_registry';
import { Query, QueryTarget } from '../lib/models/datasource';
import { ScriptStatus } from './script';

export class PCPBPFtraceDatasource extends PCPLiveDatasourceBase<BPFtraceEndpoint> {

    /* @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any) {
        super(instanceSettings, backendSrv, templateSrv);

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);
    }

    doPollAll() {
        return Promise.all(this.endpointRegistry.list().map(async endpoint => {
            endpoint.datastore.cleanup();
            endpoint.pollSrv.cleanup();
            endpoint.scriptRegistry.cleanup();
            await endpoint.pollSrv.poll();
        }));
    }

    configureEndpoint(endpoint: BPFtraceEndpoint) {
        endpoint.scriptRegistry = new ScriptRegistry(endpoint.pmapiSrv, endpoint.pollSrv, endpoint.datastore, this.keepPollingMs);
    }

    onTargetUpdate(prevValue: QueryTarget, newValue: QueryTarget) {
    }

    async handleTarget(endpoint: BPFtraceEndpoint, query: Query, target: QueryTarget) {
        const script = await endpoint.scriptRegistry.ensureActive(target.expr);
        let metrics: string[];

        if (script.status === ScriptStatus.Started || script.status === ScriptStatus.Starting) {
            metrics = await script.getDataMetrics(endpoint.pmapiSrv, target.format);
        }
        else {
            throw new Error(`BPFtrace error:\n\n${script.output}`);
        }

        await endpoint.pollSrv.ensurePolling(metrics);
        const results = endpoint.datastore.queryMetrics(target, metrics, query.range.from.valueOf(), query.range.to.valueOf());
        await this.applyTransformations(endpoint.pmapiSrv, results);
        return results;
    }

}
