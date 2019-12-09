import * as dateMock from 'jest-date-mock';
import { TestContext } from './datasource.test';
import * as fixtures from '../../../lib/specs/lib/fixtures';

export default (ctx: TestContext) => {
    it("should remove non existing metrics from polling", async () => {
        ctx.server.addResponses([
            fixtures.PmProxy.context(1),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.PmProxy.metric(1, [{ name: "non.existing.metric", semantics: "instant" }]),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [], ["non.existing.metric"]),
        ]);

        const query1 = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                expr: "non.existing.metric"
            }]
        };
        await ctx.datasource.query(query1);
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll(); // shouldn't request anything

        ctx.server.addResponses([
            fixtures.PmProxy.metric(1, [{ name: "non.existing.metric", semantics: "instant" }, { name: "existing.metric", semantics: "instant" }]),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "existing.metric", value: 100 }], ["non.existing.metric", "existing.metric"]),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "existing.metric", value: 100 }]),
        ]);

        const query2 = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                expr: "non.existing.metric"
            }, {
                ...fixtures.queryTarget,
                expr: "existing.metric"
            }]
        };
        await ctx.datasource.query(query2);
        await ctx.datasource.doPollAll();
        await ctx.datasource.doPollAll(); // should only request existing.metrics
    });

    it("should stop polling expired metrics", async () => {
        ctx.server.addResponses([
            fixtures.PmProxy.context(1),
            fixtures.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.PmProxy.metric(1, [{ name: "metric1", semantics: "instant" }, { name: "metric2", semantics: "instant" }]),
            fixtures.PmProxy.fetchSingleMetric(1, 30, [{ name: "metric1", value: 100 }, { name: "metric2", value: 200 }]),
            fixtures.PmProxy.fetchSingleMetric(1, 45, [{ name: "metric2", value: 200 }]),
        ]);

        const queryMetric1AndMetric2 = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                expr: "metric1"
            }, {
                ...fixtures.queryTarget,
                refId: "B",
                expr: "metric2"
            }]
        };

        const queryMetric2 = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                refId: "B",
                expr: "metric2"
            }]
        };

        // result is empty, but metric got added to pollSrv
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
