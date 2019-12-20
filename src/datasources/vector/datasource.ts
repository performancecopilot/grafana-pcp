import _ from "lodash";
import { PmapiDatasourceBase } from "../lib/datasource_base";
import { Endpoint } from "../lib/endpoint_registry";
import { Query, PmapiQueryTarget } from "../lib/models/datasource";
import { TargetResult } from "../lib/models/metrics";

export class PCPVectorDatasource extends PmapiDatasourceBase<Endpoint> {

    /* @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any) {
        super(instanceSettings, backendSrv, templateSrv);
    }

    onTargetUpdate(prevValue: PmapiQueryTarget<Endpoint>, newValue: PmapiQueryTarget<Endpoint>) {
        if (prevValue.endpoint !== newValue.endpoint || prevValue.expr !== newValue.expr)
            this.onTargetInactive(prevValue);
    }

    onTargetInactive(target: PmapiQueryTarget<Endpoint>) {
        if (!this.dashboardObserver.existMatchingTarget(target, { endpoint: target.endpoint, expr: target.expr }))
            target.endpoint.pollSrv.removeMetricsFromPolling([target.expr]);
    }

    async handleTarget(query: Query, target: PmapiQueryTarget<Endpoint>): Promise<TargetResult> {
        // request a bigger time frame to fill the chart (otherwise left and right border of chart is empty)
        // because of the rate conversation of counters first datapoint is "lost" -> expand timeframe at the beginning
        const from = query.range.from.valueOf() - 2 * this.pollIntervalMs;
        const to = query.range.to.valueOf() + this.pollIntervalMs;
        const results = target.endpoint.datastore.queryMetrics(target, [target.expr], from, to);
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
