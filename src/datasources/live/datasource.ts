import _ from "lodash";
import { PCPLiveDatasourceBase } from "../lib/datasource_base";
import { QueryTarget, Query, TargetResult } from "../lib/types";
import { Endpoint } from "../lib/endpoint_registry";

export class PCPLiveDatasource extends PCPLiveDatasourceBase<Endpoint> {

    /* @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any, variableSrv: any) {
        super(instanceSettings, backendSrv, templateSrv, variableSrv);

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);
    }

    doPollAll() {
        return Promise.all(this.endpointRegistry.list().map(async endpoint => {
            endpoint.datastore.cleanExpiredMetrics();
            endpoint.poller.cleanupExpiredMetrics();
            await endpoint.poller.poll();
        }));
    }

    async handleTarget(endpoint: Endpoint, query: Query, target: QueryTarget): Promise<TargetResult> {
        const results = endpoint.datastore.queryMetrics(target, [target.expr], query.range.from.valueOf(), query.range.to.valueOf());
        await this.applyTransformations(endpoint.context, results);
        return results;
    }

    async queryTargetsByEndpoint(query: Query, targets: QueryTarget[]) {
        // endpoint is the same for all targets, ensured by _.groupBy() in query()
        const endpoint = targets[0].endpoint;
        await endpoint.poller.ensurePolling(targets.map(target => target.expr));
        return super.queryTargetsByEndpoint(query, targets);
    }

}
