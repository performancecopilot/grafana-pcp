import _ from 'lodash';
import { PmapiDatasourceBase } from '../lib/datasource_base';
import BPFtraceEndpoint from './bpftrace_endpoint';
import ScriptRegistry from './script_registry';
import { Query, PmapiQueryTarget } from '../lib/models/datasource';
import { Status } from './script';
import { versionCmp } from '../lib/utils';

export class PCPBPFtraceDatasource extends PmapiDatasourceBase<BPFtraceEndpoint> {

    /* @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any) {
        super(instanceSettings, backendSrv, templateSrv);
        window.addEventListener("unload", this.deregisterAllScripts.bind(this), false);
    }

    deregisterAllScripts() {
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.scriptRegistry.deregisterAllScripts();
        }
    }

    configureEndpoint(endpoint: BPFtraceEndpoint) {
        endpoint.scriptRegistry = new ScriptRegistry(endpoint.pmapiSrv, endpoint.pollSrv);
    }

    onTargetUpdate(prevValue: PmapiQueryTarget<BPFtraceEndpoint>, newValue: PmapiQueryTarget<BPFtraceEndpoint>) {
        if (prevValue.endpoint !== newValue.endpoint || prevValue.expr !== newValue.expr)
            this.onTargetInactive(prevValue);
    }

    onTargetInactive(target: PmapiQueryTarget<BPFtraceEndpoint>) {
        void target.endpoint.scriptRegistry.deregister(target.uid);
    }

    async handleTarget(query: Query, target: PmapiQueryTarget<BPFtraceEndpoint>) {
        const endpoint = target.endpoint;
        if (target.minPcpVersion && versionCmp(target.minPcpVersion, endpoint.pcpVersion) > 0) {
            throw new Error(`This target requires PCP version ${target.minPcpVersion}, however PCP version ${endpoint.pcpVersion} is installed.`);
        }

        const script = await endpoint.scriptRegistry.ensureActive(target.uid, target.expr);
        let metrics: string[];
        if (script.state.status === Status.Started || script.state.status === Status.Starting) {
            metrics = endpoint.scriptRegistry.getMetrics(script, target.format);
        }
        else {
            throw new Error(`BPFtrace error:\n\n${script.state.error}`);
        }

        await endpoint.pollSrv.ensurePolling(metrics);

        // request a bigger time frame to fill the chart (otherwise left and right border of chart is empty)
        // because of the rate conversation of counters first datapoint is "lost" -> expand timeframe at the beginning
        const from = query.range.from.valueOf() - 2 * this.pollIntervalMs;
        const to = query.range.to.valueOf() + this.pollIntervalMs;
        const results = endpoint.datastore.queryMetrics(target, metrics, from, to);
        await this.applyTransformations(endpoint.pmapiSrv, results);
        return results;
    }

}
