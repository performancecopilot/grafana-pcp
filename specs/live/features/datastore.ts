import { TestContext } from '../datasource.test';
import { PmApi } from '../../pmapi/pmapi';
import { TargetFormat } from '../../../src/datasources/lib/types';
import * as dateMock from 'jest-date-mock';

export default (ctx: TestContext, backend: PmApi) => {
    it("should return datapoints in range", async () => {
        ctx.server.addResponses([
            backend.context(1),
            backend.metric(1, [{ name: "metric1", semantics: "instant" }]),
            backend.fetchSingleMetric(1, 10, [{ name: "metric1", value: 100 }]),
            backend.fetchSingleMetric(1, 11, [{ name: "metric1", value: 200 }]),
            backend.fetchSingleMetric(1, 12, [{ name: "metric1", value: 300 }]),
            backend.fetchSingleMetric(1, 13, [{ name: "metric1", value: 400 }]),
        ]);

        const query = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "metric1",
                format: TargetFormat.TimeSeries,
            }],
            range: {
                from: new Date(11000),
                to: new Date(12000)
            },
        };

        // result is empty, but metric got added to poller
        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({ data: [] });

        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll();

        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "metric1",
                datapoints: [
                    [200, 11000],
                    [300, 12000]
                ]
            }]
        });
    });

    it("should clean expired datapoints", async () => {
        ctx.server.addResponses([
            backend.context(1),
            backend.metric(1, [{ name: "metric1", semantics: "instant" }]),
            backend.fetchSingleMetric(1, 2 * 60, [{ name: "metric1", value: 100 }]),
            backend.fetchSingleMetric(1, 4 * 60, [{ name: "metric1", value: 200 }]),
            backend.fetchSingleMetric(1, 6 * 60, [{ name: "metric1", value: 300 }]),
            backend.fetchSingleMetric(1, 8 * 60, [{ name: "metric1", value: 400 }]),
        ]);

        const query = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "metric1",
                format: TargetFormat.TimeSeries,
            }],
            range: {
                // get everything between 0 - 10min
                from: new Date(0),
                to: new Date(10 * 60 * 1000)
            },
        };

        // unixtime: 5min
        dateMock.advanceTo(5 * 60 * 1000);

        // result is empty, but metric got added to poller
        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({ data: [] });

        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll();

        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "metric1",
                datapoints: [
                    [100, 2 * 60 * 1000],
                    [200, 4 * 60 * 1000]
                ]
            }]
        });

        // unixtime: 8.5min
        dateMock.advanceTo(8.5 * 60 * 1000);
        await ctx.datasource.query(query);
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll();

        // query is in range 0-10min, current time is 8.5min
        // datastore should countain 3.5 - 8.5min (default 5min max age)
        result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "metric1",
                datapoints: [
                    [200, 4 * 60 * 1000],
                    [300, 6 * 60 * 1000],
                    [400, 8 * 60 * 1000]
                ]
            }]
        });
    });
};
