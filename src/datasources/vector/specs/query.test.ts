import * as dateMock from 'jest-date-mock';
import fixtures from '../../lib/specs/lib/fixtures';
import HttpServerMock from '../../lib/specs/lib/http_server_mock';
import { PCPVectorDatasource } from '../datasource';
import { templateSrv } from '../../lib/specs/lib/template_srv_mock';

describe("PCP Vector e2e: Query", () => {
    const ctx: { server: HttpServerMock, datasource: PCPVectorDatasource } = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            url: 'http://localhost:44322',
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0,
                inactivityTimeoutMs: '20s',
                localHistoryAge: '5m'
            }
        };
        ctx.server = new HttpServerMock(instanceSettings.url, false);
        const backendSrv = {
            datasourceRequest: ctx.server.doRequest.bind(ctx.server)
        };
        ctx.datasource = new PCPVectorDatasource(instanceSettings, backendSrv, templateSrv);
        dateMock.advanceTo(20000); // simulate unixtime of 20s (since Jan 1, 1970 UTC)
    });

    afterEach(() => {
        expect(ctx.server.responsesSize()).toBe(0);
    });

    it("should perform rate-conversation of a counter with no instance domains", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.pmapi.PmProxy.kernelAllSysfork.metric,
            fixtures.pmapi.PmProxy.kernelAllSysfork.fetch(10, 100),
            fixtures.pmapi.PmProxy.kernelAllSysfork.fetch(11, 200),
            fixtures.pmapi.PmProxy.kernelAllSysfork.fetch(12, 400)
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "kernel.all.sysfork",
            }]
        };

        // result is empty, but metric got added to pollSrv
        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({ data: [] });


        // result is still empty, for counters we need at least 2 values
        await ctx.datasource.doPollAll();
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "kernel.all.sysfork",
                datapoints: []
            }]
        });

        // now we have 1 value
        await ctx.datasource.doPollAll();
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "kernel.all.sysfork",
                datapoints: [
                    [100, 11000]
                ]
            }]
        });

        // now we have 2 values
        await ctx.datasource.doPollAll();
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "kernel.all.sysfork",
                datapoints: [
                    [100, 11000],
                    [200, 12000]
                ]
            }]
        });
    });

    it("should perform a query with instance domains", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.pmapi.PmProxy.kernelAllLoad.metric,
            fixtures.pmapi.PmProxy.kernelAllLoad.indom,
            fixtures.pmapi.PmProxy.kernelAllLoad.fetch
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "kernel.all.load"
            }]
        };

        // result is empty, but metric got added to pollSrv
        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({ data: [] });


        await ctx.datasource.doPollAll();
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "1 minute",
                datapoints: [
                    [11, 10000]
                ]
            }, {
                target: "5 minute",
                datapoints: [
                    [12, 10000]
                ]
            }, {
                target: "15 minute",
                datapoints: [
                    [13, 10000]
                ]
            }]
        });
    });

    it("should handle requesting metadata of non existing metrics", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.pmapi.PmProxy.metric(1, [], ["non.existing.metric"]),
            fixtures.pmapi.PmProxy.metric(1, [{ name: "existing.metric", semantics: "instant" }], ["non.existing.metric,existing.metric"]),
        ]);

        const query1 = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "non.existing.metric"
            }]
        };
        await expect(ctx.datasource.query(query1)).rejects.toMatchObject({
            message: "Cannot find metric non.existing.metric. Please check if the PMDA is enabled."
        });

        const query2 = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "non.existing.metric",
            }, {
                ...fixtures.grafana.queryTarget,
                expr: "existing.metric",
            }]
        };
        await expect(ctx.datasource.query(query2)).rejects.toMatchObject({
            message: "Cannot find metric non.existing.metric. Please check if the PMDA is enabled."
        });
    });

    it.skip("metricFindQuery()", async () => {
    });

    it("should get a new context if current context is expired", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.pmapi.PmProxy.metric(1, [{ name: "metric1", semantics: "instant" }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "metric1", value: 100 }]),
            fixtures.pmapi.PmProxy.contextExpired(1, "/"),
            fixtures.pmapi.PmProxy.context(2),
            fixtures.pmapi.PmProxy.fetchSingleMetric(2, 11, [{ name: "metric1", value: 200 }]),
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric1",
            }]
        };

        // result is empty, but metric got added to pollSrv
        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({ data: [] });


        await ctx.datasource.doPollAll();
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "metric1",
                datapoints: [
                    [100, 10000]
                ]
            }]
        });

        // context expires, immediately new fetch
        await ctx.datasource.doPollAll();
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "metric1",
                datapoints: [
                    [100, 10000],
                    [200, 11000]
                ]
            }]
        });
    });
});
