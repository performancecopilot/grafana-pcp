import _ from 'lodash';
import { PmapiDatasourceBase } from '../lib/datasource_base';
import BPFtraceEndpoint from './bpftrace_endpoint';
import ScriptRegistry from './script_registry';
import { Query, PmapiQueryTarget } from '../lib/models/datasource';
import { Status } from './script';

export class PCPBPFtraceDatasource extends PmapiDatasourceBase<BPFtraceEndpoint> {

    /* @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any) {
        super(instanceSettings, backendSrv, templateSrv);

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);
    }

    doPollAll() {
        return Promise.all(this.endpointRegistry.list().map(async endpoint => {
            this.dashboardObserver.cleanup();
            endpoint.datastore.cleanup();
            await endpoint.pollSrv.poll();
        }));
    }

    configureEndpoint(endpoint: BPFtraceEndpoint) {
        endpoint.scriptRegistry = new ScriptRegistry(endpoint.pmapiSrv, endpoint.pollSrv, endpoint.datastore);
    }

    async onTargetUpdate(prevValue: PmapiQueryTarget<BPFtraceEndpoint>, newValue: PmapiQueryTarget<BPFtraceEndpoint>) {
        if (prevValue.endpoint !== newValue.endpoint || prevValue.expr !== newValue.expr)
            this.onTargetInactive(prevValue);
    }

    async onTargetInactive(target: PmapiQueryTarget<BPFtraceEndpoint>) {
        target.endpoint.scriptRegistry.deregister(target.uid);
    }

    async handleTarget(query: Query, target: PmapiQueryTarget<BPFtraceEndpoint>) {
        const endpoint = target.endpoint;
        const script = await endpoint.scriptRegistry.ensureActive(target.uid, target.expr);
        let metrics: string[];

        if (script.state.status === Status.Started || script.state.status === Status.Starting) {
            metrics = endpoint.scriptRegistry.getDataMetrics(script, target.format);
        }
        else {
            throw new Error(`BPFtrace error:\n\n${script.state.error}`);
        }

        await endpoint.pollSrv.ensurePolling(metrics);
        const results = endpoint.datastore.queryMetrics(target, metrics, query.range.from.valueOf(), query.range.to.valueOf());
        await this.applyTransformations(endpoint.pmapiSrv, results);
        return results;
    }

}
