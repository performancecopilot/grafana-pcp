import _ from "lodash";
import { PCPLiveDatasourceBase } from "../lib/datasource_base";
import { Endpoint } from "../lib/endpoint_registry";
import { Query, QueryTarget } from "../lib/models/datasource";
import { TargetResult } from "../lib/models/metrics";

export class PCPLiveDatasource extends PCPLiveDatasourceBase<Endpoint> {

    /* @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any) {
        super(instanceSettings, backendSrv, templateSrv);

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);
    }

    doPollAll() {
        return Promise.all(this.endpointRegistry.list().map(async endpoint => {
            endpoint.datastore.cleanExpiredMetrics();
            endpoint.pollSrv.cleanExpiredMetrics();
            await endpoint.pollSrv.poll();
        }));
    }

    async handleTarget(endpoint: Endpoint, query: Query, target: QueryTarget): Promise<TargetResult> {
        const results = endpoint.datastore.queryMetrics(target, [target.expr], query.range.from.valueOf(), query.range.to.valueOf());
        await this.applyTransformations(endpoint.pmapiSrv, results);
        return results;
    }

    async queryTargetsByEndpoint(query: Query, targets: QueryTarget[]) {
        // endpoint is the same for all targets, ensured by _.groupBy() in query()
        const endpoint = targets[0].endpoint!;
        await endpoint.pollSrv.ensurePolling(targets.map(target => target.expr));
        return super.queryTargetsByEndpoint(query, targets);
    }

}
