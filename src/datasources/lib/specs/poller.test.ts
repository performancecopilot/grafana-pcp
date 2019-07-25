import Poller from "../poller";
import DataStore from "../datastore";
import * as dateMock from 'jest-date-mock';

describe("Poller", () => {
    let ctx: { context: any, datastore: DataStore, poller: Poller } = {} as any;

    beforeEach(() => {
        ctx.context = {
            metricMetadatas: jest.fn(),
            metricMetadata: (metric) => ctx.context.metricMetadatas()[metric],
            fetch: jest.fn()
        }
        ctx.datastore = new DataStore(ctx.context, 25000)
        ctx.poller = new Poller(ctx.context, ctx.datastore, 10000);
        dateMock.clear();
    });

    it("should poll", async () => {
        ctx.context.metricMetadatas.mockReturnValue({ "bpftrace.scripts.script1.data.scalar": {} });
        ctx.context.fetch.mockReturnValue({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 45200,
                    "instanceName": null
                }]
            }]
        });

        await ctx.poller.ensurePolling(["bpftrace.scripts.script1.data.scalar"]);
        await ctx.poller.poll();

        const result = ctx.datastore.queryMetric("bpftrace.scripts.script1.data.scalar", 0, Infinity);
        const expected = [{
            "target": "bpftrace.scripts.script1.data.scalar",
            "datapoints": [
                [45200, 5002]
            ]
        }];
        expect(result).toStrictEqual(expected);
    });

    it("should add and remove metrics to poll", async () => {
        ctx.context.metricMetadatas.mockReturnValue({ "metric1": {}, "metric2": {}, "metric3": {} });
        ctx.context.fetch.mockReturnValue({
            "timestamp": {
                "s": 6,
                "us": 2000
            },
            "values": [
                { name: "metric1", instances: [] },
                { name: "metric2", instances: [] },
                { name: "metric3", instances: [] }
            ]
        });

        await ctx.poller.ensurePolling(["metric1", "metric2", "metric3"]);
        ctx.poller.removeMetricsFromPolling(["metric2", "metric3"]);
        await ctx.poller.poll();

        expect(ctx.context.fetch).toHaveBeenCalledWith(["metric1"], true);
    });

    it("should remove metrics which weren't requested in a specified time period", async () => {
        ctx.context.metricMetadatas.mockReturnValue({ "metric1": {}, "metric2": {}, "metric3": {} });
        ctx.context.fetch.mockReturnValue({
            "timestamp": {
                "s": 6,
                "us": 2000
            },
            "values": [
                { name: "metric1", instances: [] },
                { name: "metric2", instances: [] },
                { name: "metric3", instances: [] }
            ]
        });

        await ctx.poller.ensurePolling(["metric1", "metric2", "metric3"]);
        dateMock.advanceBy(7000);
        await ctx.poller.ensurePolling(["metric1"]);
        dateMock.advanceBy(5000);

        // max age is 10s
        // metric1 was requested 5s back, metric2 and metric3 12s back
        ctx.poller.cleanupExpiredMetrics();
        await ctx.poller.poll();

        expect(ctx.context.fetch).toHaveBeenCalledWith(["metric1"], true);
    });

});
