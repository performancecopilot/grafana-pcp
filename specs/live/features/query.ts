import { TestContext } from '../datasource.test';
import { PmApi } from '../../pmapi/pmapi';
import { TargetFormat } from '../../../src/datasources/lib/types';

export default (ctx: TestContext, backend: PmApi) => {
    it("should perform rate-conversation of a counter with no instance domains", async () => {
        ctx.server.addResponses([
            backend.context(1),
            backend.kernelAllSysfork.metric,
            backend.kernelAllSysfork.fetch(10, 100),
            backend.kernelAllSysfork.fetch(11, 200),
            backend.kernelAllSysfork.fetch(12, 400)
        ]);

        const query = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "kernel.all.sysfork",
                format: TargetFormat.TimeSeries
            }]
        };

        // result is empty, but metric got added to poller
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
                format: TargetFormat.TimeSeries
            }]
        };

        // result is empty, but metric got added to poller
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
            backend.context(1),
            backend.metric(1, [], ["non.existing.metric"]),
            backend.metric(1, [{ name: "existing.metric", semantics: "instant" }], ["non.existing.metric,existing.metric"]),
        ]);

        const query1 = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "non.existing.metric",
                format: TargetFormat.TimeSeries
            }]
        };
        await expect(ctx.datasource.query(query1)).rejects.toStrictEqual({
            message: "Cannot find metric non.existing.metric. Please check if the PMDA is enabled."
        });

        const query2 = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "non.existing.metric",
                format: TargetFormat.TimeSeries
            }, {
                refId: "",
                expr: "existing.metric",
                format: TargetFormat.TimeSeries
            }]
        };
        await expect(ctx.datasource.query(query2)).rejects.toStrictEqual({
            message: "Cannot find metric non.existing.metric. Please check if the PMDA is enabled."
        });
    });

    it.skip("metricFindQuery()", async () => {
    });

    it("should get a new context if current context is expired", async () => {
        ctx.server.addResponses([
            backend.context(1),
            backend.metric(1, [{ name: "metric1", semantics: "instant" }]),
            backend.fetchSingleMetric(1, 10, [{ name: "metric1", value: 100 }]),
            backend.contextExpired(1, "/"),
            backend.context(2),
            backend.fetchSingleMetric(2, 11, [{ name: "metric1", value: 200 }]),
        ]);

        const query = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "metric1",
                format: TargetFormat.TimeSeries,
            }]
        };

        // result is empty, but metric got added to poller
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
};
