import { TestContext } from '../datasource.test';
import { PmApi } from '../../pmapi/pmapi';
import { TargetFormat } from '../../../src/datasources/lib/types';
import * as dateMock from 'jest-date-mock';

export default (ctx: TestContext, backend: PmApi) => {
    it("should remove non existing metrics from polling", async () => {
        ctx.server.addResponses([
            backend.context(1),
            backend.metric(1, [{ name: "non.existing.metric", semantics: "instant" }]),
            backend.fetchSingleMetric(1, 10, [], ["non.existing.metric"]),
        ]);

        const query1 = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "non.existing.metric",
                format: TargetFormat.TimeSeries
            }]
        };
        await ctx.datasource.query(query1);
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll(); // shouldn't request anything

        ctx.server.addResponses([
            backend.metric(1, [{ name: "non.existing.metric", semantics: "instant" }, { name: "existing.metric", semantics: "instant" }]),
            backend.fetchSingleMetric(1, 10, [{ name: "existing.metric", value: 100 }], ["non.existing.metric", "existing.metric"]),
            backend.fetchSingleMetric(1, 10, [{ name: "existing.metric", value: 100 }]),
        ]);

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
        await ctx.datasource.query(query2);
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll(); // should only request existing.metrics
    });

    it("should stop polling expired metrics", async () => {
        ctx.server.addResponses([
            backend.context(1),
            backend.metric(1, [{ name: "metric1", semantics: "instant" }, { name: "metric2", semantics: "instant" }]),
            backend.fetchSingleMetric(1, 30, [{ name: "metric1", value: 100 }, { name: "metric2", value: 200 }]),
            backend.fetchSingleMetric(1, 45, [{ name: "metric2", value: 200 }]),
        ]);

        const queryMetric1AndMetric2 = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "metric1",
                format: TargetFormat.TimeSeries,
            }, {
                refId: "",
                expr: "metric2",
                format: TargetFormat.TimeSeries,
            }]
        };

        const queryMetric2 = {
            ...ctx.defaultQuery,
            targets: [{
                refId: "",
                expr: "metric2",
                format: TargetFormat.TimeSeries,
            }]
        };

        // result is empty, but metric got added to poller
        // current fake time: 20s
        // last requested metric1: 20s, metric2: 20s
        let result = await ctx.datasource.query(queryMetric1AndMetric2);
        expect(result).toStrictEqual({ data: [] });

        // current fake time: 30s
        // last requested metric1: 20s, metric2: 30s
        dateMock.advanceTo(30000);
        result = await ctx.datasource.query(queryMetric2);

        // should request both metrics
        await ctx.datasource.doPollAll();

        // current fake time: 45s
        dateMock.advanceTo(45000);

        // should request metric2 only (25s-45s, as default keepPollingTime is 20s)
        await ctx.datasource.doPollAll();
    });
};
