import * as dateMock from 'jest-date-mock';
import fixtures from '../../lib/specs/lib/fixtures';
import { TargetFormat } from '../../lib/models/datasource';
import HttpServerMock from '../../lib/specs/lib/http_server_mock';
import { PCPVectorDatasource } from '../datasource';
import { templateSrv } from '../../lib/specs/lib/template_srv_mock';

describe("PCP Vector e2e: Formatting", () => {
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

    it("should support legend templating", async () => {
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
                expr: "kernel.all.load",
                legendFormat: "a $metric $metric0 $instance $hostname $region b"
            }],
            scopedVars: {
                region: { value: "eu" }
            }
        };

        // result is empty, but metric got added to pollSrv
        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({ data: [] });


        await ctx.datasource.doPollAll();
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "a kernel.all.load load 1 minute test-vm eu b",
                datapoints: [
                    [11, 10000]
                ]
            }, {
                target: "a kernel.all.load load 5 minute test-vm eu b",
                datapoints: [
                    [12, 10000]
                ]
            }, {
                target: "a kernel.all.load load 15 minute test-vm eu b",
                datapoints: [
                    [13, 10000]
                ]
            }]
        });
    });

    it("should convert to heatmaps", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.pmapi.PmProxy.metric(1, [{ name: "metric1", semantics: "instant" }]),
            fixtures.pmapi.PmProxy.indom(1, "metric1", [
                { instance: 0, name: "-inf--1" },
                { instance: 1, name: "2-3" },
                { instance: 2, name: "4-inf" }
            ]),
            fixtures.pmapi.PmProxy.fetchIndomMetric(1, 10.4, [{
                name: "metric1", instances: [
                    { instance: 0, value: 100 },
                    { instance: 1, value: 200 },
                    { instance: 2, value: 300 }
                ]
            }]),
            fixtures.pmapi.PmProxy.fetchIndomMetric(1, 11.5, [{
                name: "metric1", instances: [
                    { instance: 0, value: 400 },
                    { instance: 1, value: 500 },
                    { instance: 2, value: 600 }
                ]
            }]),
            fixtures.pmapi.PmProxy.fetchIndomMetric(1, 12.6, [{
                name: "metric1", instances: [
                    { instance: 0, value: 700 },
                    { instance: 1, value: 800 },
                    { instance: 2, value: 900 }
                ]
            }])
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric1",
                format: TargetFormat.Heatmap
            }]
        };

        // result is empty, but metric got added to pollSrv
        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({ data: [] });


        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll();

        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "-1",
                datapoints: [
                    [100, 10000],
                    [400, 11000],
                    [700, 12000]
                ]
            }, {
                target: "3",
                datapoints: [
                    [200, 10000],
                    [500, 11000],
                    [800, 12000]
                ]
            }, {
                target: "inf",
                datapoints: [
                    [300, 10000],
                    [600, 11000],
                    [900, 12000]
                ]
            }]
        });
    });

    it.skip("should convert to table", async () => {
    });
});
