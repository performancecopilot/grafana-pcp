import { TestContext } from '../datasource.test';
import { PmApi } from '../../pmapi/pmapi';
import { TargetFormat } from '../../../src/datasources/lib/types';

export default (ctx: TestContext, backend: PmApi) => {
    it("should support legend templating", async () => {
        ctx.server.addResponses([
            backend.context(1),
            backend.kernelAllLoad.metric,
            backend.kernelAllLoad.indom,
            backend.kernelAllLoad.fetch
        ]);

        const query = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "kernel.all.load",
                format: TargetFormat.TimeSeries,
                legendFormat: "a $metric $metric0 $instance $hostname $region b"
            }],
            scopedVars: {
                region: { value: "eu" }
            }
        };

        // result is empty, but metric got added to poller
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
            backend.context(1),
            backend.metric(1, [{ name: "metric1", semantics: "instant" }]),
            backend.indom(1, "metric1", [
                { instance: 0, name: "-inf--1" },
                { instance: 1, name: "2-3" },
                { instance: 2, name: "4-inf" }
            ]),
            backend.fetchIndomMetric(1, 10.4, [{
                name: "metric1", instances: [
                    { instance: 0, value: 100 },
                    { instance: 1, value: 200 },
                    { instance: 2, value: 300 }
                ]
            }]),
            backend.fetchIndomMetric(1, 11.5, [{
                name: "metric1", instances: [
                    { instance: 0, value: 400 },
                    { instance: 1, value: 500 },
                    { instance: 2, value: 600 }
                ]
            }]),
            backend.fetchIndomMetric(1, 12.6, [{
                name: "metric1", instances: [
                    { instance: 0, value: 700 },
                    { instance: 1, value: 800 },
                    { instance: 2, value: 900 }
                ]
            }])
        ]);

        const query = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "metric1",
                format: TargetFormat.Heatmap,
            }]
        };

        // result is empty, but metric got added to poller
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
};
