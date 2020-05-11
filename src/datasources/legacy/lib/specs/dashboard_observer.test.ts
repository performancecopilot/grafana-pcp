import _ from 'lodash';
import * as dateMock from 'jest-date-mock';
import { Endpoint } from "../endpoint_registry";
import { PmapiDatasourceBase } from '../datasource_base';
import { PmapiQueryTarget, Query } from '../models/datasource';
import { TargetResult } from '../models/metrics';
import fixtures from './lib/fixtures';
import HttpServerMock from './lib/http_server_mock';
import { templateSrv } from './lib/template_srv_mock';

class Datasource extends PmapiDatasourceBase<Endpoint> {
    onTargetUpdate(prevValue: PmapiQueryTarget<Endpoint>, newValue: PmapiQueryTarget<Endpoint>) {
        throw new Error("Method not implemented.");
    }

    onTargetInactive(target: PmapiQueryTarget<Endpoint>) {
        throw new Error("Method not implemented.");
    }

    async handleTarget(query: Query, target: PmapiQueryTarget<Endpoint>): Promise<TargetResult> {
        return {
            target: target,
            metrics: []
        };
    }
}

describe("DashboardObserver", () => {
    const ctx: { datasource: Datasource } = {} as any;

    beforeEach(() => {
        dateMock.clear();
        const instanceSettings = {
            url: 'http://localhost',
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0,
                inactivityTimeoutMs: '20s'
            }
        };
        const server = new HttpServerMock(instanceSettings.url, false);
        server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }])
        ]);
        const backendSrv = {
            datasourceRequest: server.doRequest.bind(server)
        };
        ctx.datasource = new Datasource(instanceSettings, backendSrv, templateSrv);
        ctx.datasource.onTargetUpdate = jest.fn();
        ctx.datasource.onTargetInactive = jest.fn();
    });

    it("should detect changes", async () => {
        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "some_query"
            }]
        };
        await ctx.datasource.query(query);

        query.targets[0].expr = "updated_expr";
        await ctx.datasource.query(query);
        expect(ctx.datasource.onTargetUpdate).toHaveBeenCalledTimes(1);

        await ctx.datasource.query(query);
        expect(ctx.datasource.onTargetUpdate).toHaveBeenCalledTimes(1);
    });

    it("should detect inactive targets", async () => {
        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "some_query"
            }]
        };

        dateMock.advanceTo(0);
        await ctx.datasource.query(query);

        dateMock.advanceTo(19000);
        ctx.datasource.dashboardObserver.cleanup();
        expect(ctx.datasource.onTargetInactive).toHaveBeenCalledTimes(0);

        dateMock.advanceTo(21000);
        ctx.datasource.dashboardObserver.cleanup();
        expect(ctx.datasource.onTargetInactive).toHaveBeenCalledTimes(1);
    });

    it("should detect if an inactive target of a panel is NOT used by another panel", async () => {
        const removeTarget = jest.fn();
        ctx.datasource.onTargetInactive = (target: PmapiQueryTarget<Endpoint>) => {
            if (!ctx.datasource.dashboardObserver.existMatchingTarget(target, { endpoint: target.endpoint, expr: target.expr }))
                removeTarget(target.expr);
        };

        const queryPanelA = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric1"
            }, {
                ...fixtures.grafana.queryTarget,
                refId: "B",
                expr: "metric2"
            }]
        };

        const queryPanelB = {
            ...fixtures.grafana.query,
            panelId: 2,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric3"
            }]
        };

        dateMock.advanceTo(0);
        await ctx.datasource.query(queryPanelA);
        await ctx.datasource.query(queryPanelB);

        dateMock.advanceTo(21000);
        await ctx.datasource.query(queryPanelA);
        // panel B is now inactive
        // metric1 *should* be removed, as it's *not* required by panel A
        ctx.datasource.dashboardObserver.cleanup();
        expect(removeTarget).toHaveBeenCalledTimes(1);
        expect(removeTarget).toHaveBeenCalledWith("metric3");
    });

    it("should detect if an inactive target of a panel IS used by another panel", async () => {
        const removeTarget = jest.fn();
        ctx.datasource.onTargetInactive = (target: PmapiQueryTarget<Endpoint>) => {
            if (!ctx.datasource.dashboardObserver.existMatchingTarget(target, { endpoint: target.endpoint, expr: target.expr }))
                removeTarget();
        };

        const queryPanelA = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric1"
            }, {
                ...fixtures.grafana.queryTarget,
                refId: "B",
                expr: "metric2"
            }]
        };

        const queryPanelB = {
            ...fixtures.grafana.query,
            panelId: 2,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric1"
            }]
        };

        dateMock.advanceTo(0);
        await ctx.datasource.query(queryPanelA);
        await ctx.datasource.query(queryPanelB);

        dateMock.advanceTo(21000);
        await ctx.datasource.query(queryPanelA);
        // panel B is now inactive
        // metric1 should *not* be removed, as it's still required by panel A
        ctx.datasource.dashboardObserver.cleanup();
        expect(removeTarget).toHaveBeenCalledTimes(0);
    });

});
