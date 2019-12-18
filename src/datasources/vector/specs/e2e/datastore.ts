import * as dateMock from 'jest-date-mock';
import { TestContext } from './datasource.test';
import fixtures from '../../../lib/specs/lib/fixtures';

export default (ctx: TestContext) => {
    it("should return datapoints in range", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.pmapi.PmProxy.metric(1, [{ name: "metric1", semantics: "instant" }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "metric1", value: 100 }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 20, [{ name: "metric1", value: 200 }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 30, [{ name: "metric1", value: 300 }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 40, [{ name: "metric1", value: 400 }]),
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric1"
            }],
            range: {
                from: new Date(20000),
                to: new Date(30000)
            },
        };

        // result is empty, but metric got added to pollSrv
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
                    [200, 20000],
                    [300, 30000]
                ]
            }]
        });
    });

    it("should clean expired datapoints", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmProxy.context(1),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 10, [{ name: "pmcd.version", value: "5.0.2" }]),
            fixtures.pmapi.PmProxy.metric(1, [{ name: "metric1", semantics: "instant" }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 2 * 60, [{ name: "metric1", value: 100 }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 4 * 60, [{ name: "metric1", value: 200 }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 6 * 60, [{ name: "metric1", value: 300 }]),
            fixtures.pmapi.PmProxy.fetchSingleMetric(1, 8 * 60, [{ name: "metric1", value: 400 }]),
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "metric1"
            }],
            range: {
                // get everything between 0 - 10min
                from: new Date(0),
                to: new Date(10 * 60 * 1000)
            },
        };

        // unixtime: 5min
        dateMock.advanceTo(5 * 60 * 1000);

        // result is empty, but metric got added to pollSrv
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
