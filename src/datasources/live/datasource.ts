///<reference path="../../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import _ from "lodash";
import { PcpLiveDatasourceBase } from "../lib/datasource_base";
import { QueryTarget, Query, TargetResult } from "../lib/types";
import { Endpoint } from "../lib/endpoint_registry";

export class PcpLiveDatasource extends PcpLiveDatasourceBase<Endpoint> {

    container_name_filter: any;

    /** @ngInject **/
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any, variableSrv: any) {
        super(instanceSettings, backendSrv, templateSrv, variableSrv);

        if (this.pollIntervalMs > 0)
            setInterval(this.doPollAll.bind(this), this.pollIntervalMs);

        //const UUID_REGEX = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
        //this.container_name_filter = name => true // name => name.match(UUID_REGEX)
    }

    doPollAll() {
        let promises: Promise<void>[] = [];
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.datastore.cleanExpiredMetrics();
            endpoint.poller.cleanupExpiredMetrics();
            promises.push(endpoint.poller.poll());
        }
        return Promise.all(promises);
    }

    async handleTarget(endpoint: Endpoint, query: Query, target: QueryTarget): Promise<TargetResult> {
        return endpoint.datastore.queryMetrics(target, [target.expr], query.range.from.valueOf(), query.range.to.valueOf());
    }

    async queryTargetsByEndpoint(query: Query, targets: QueryTarget[]) {
        // endpoint is the same for all targets, ensured by _.groupBy() in query()
        const endpoint = targets[0].endpoint;
        await endpoint.poller.ensurePolling(targets.map(target => target.expr));
        return super.queryTargetsByEndpoint(query, targets);
    }

}
