import { TestContext } from './datasource.test';
import * as fixtures from '../../../lib/specs/lib/fixtures';

export default (ctx: TestContext) => {
    it("should perform rate-conversation of a counter with no instance domains", async () => {
        ctx.server.addResponses([
            fixtures.PmProxy.context(1),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.PmProxy.kernelAllSysfork.metric,
            fixtures.PmProxy.kernelAllSysfork.fetch(10, 100),
            fixtures.PmProxy.kernelAllSysfork.fetch(11, 200),
            fixtures.PmProxy.kernelAllSysfork.fetch(12, 400)
        ]);

        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
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
            fixtures.PmProxy.context(1),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.PmProxy.kernelAllLoad.metric,
            fixtures.PmProxy.kernelAllLoad.indom,
            fixtures.PmProxy.kernelAllLoad.fetch
        ]);

        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
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
            fixtures.PmProxy.context(1),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.PmProxy.metric(1, [], ["non.existing.metric"]),
            fixtures.PmProxy.metric(1, [{ name: "existing.metric", semantics: "instant" }], ["non.existing.metric,existing.metric"]),
        ]);

        const query1 = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                expr: "non.existing.metric"
            }]
        };
        await expect(ctx.datasource.query(query1)).rejects.toMatchObject({
            message: "Cannot find metric non.existing.metric. Please check if the PMDA is enabled."
        });

        const query2 = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                expr: "non.existing.metric",
            }, {
                ...fixtures.queryTarget,
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
            fixtures.PmProxy.context(1),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.PmProxy.metric(1, [{ name: "metric1", semantics: "instant" }]),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "metric1", value: 100 }]),
            fixtures.PmProxy.contextExpired(1, "/"),
            fixtures.PmProxy.context(2),
            fixtures.PmProxy.fetchSingleMetric(2, 11, [{ name: "metric1", value: 200 }]),
        ]);

        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
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
};
