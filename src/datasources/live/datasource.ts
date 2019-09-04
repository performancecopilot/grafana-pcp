import _ from "lodash";
import { PmapiDatasourceBase } from "../lib/datasource_base";
import { Endpoint } from "../lib/endpoint_registry";
import { Query, PmapiQueryTarget } from "../lib/models/datasource";
import { TargetResult } from "../lib/models/metrics";

export class PCPLiveDatasource extends PmapiDatasourceBase<Endpoint> {

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

    async onTargetUpdate(prevValue: PmapiQueryTarget<Endpoint>, newValue: PmapiQueryTarget<Endpoint>) {
        if (prevValue.endpoint !== newValue.endpoint || prevValue.expr !== newValue.expr)
            this.onTargetInactive(prevValue);
    }

    async onTargetInactive(target: PmapiQueryTarget<Endpoint>) {
        if (!this.dashboardObserver.existMatchingTarget(target, { endpoint: target.endpoint, expr: target.expr }))
            target.endpoint.pollSrv.removeMetricsFromPolling([target.expr]);
    }

    async handleTarget(query: Query, target: PmapiQueryTarget<Endpoint>): Promise<TargetResult> {
        const results = target.endpoint.datastore.queryMetrics(target, [target.expr], query.range.from.valueOf(), query.range.to.valueOf());
        await this.applyTransformations(target.endpoint.pmapiSrv, results);
        return results;
    }

    async queryTargetsByEndpoint(query: Query, targets: PmapiQueryTarget<Endpoint>[]) {
        // endpoint is the same for all targets, ensured by _.groupBy() in query()
        const endpoint = targets[0].endpoint;
        await endpoint.pollSrv.ensurePolling(targets.map(target => target.expr));
        return super.queryTargetsByEndpoint(query, targets);
    }

}
