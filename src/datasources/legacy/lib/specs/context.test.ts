import HttpServerMock from "./lib/http_server_mock";
import { Context } from "../services/pmapi_srv";
import fixtures from "./lib/fixtures";

describe("context pmwebd compat", () => {
    const ctx: { server: HttpServerMock, context: Context } = {} as any;

    beforeEach(() => {
        ctx.server = new HttpServerMock("http://localhost:44323");
        ctx.context = new Context(ctx.server.doRequest.bind(ctx.server), "http://localhost:44323");
    });

    afterEach(() => {
        expect(ctx.server.responsesSize()).toBe(0);
    });

    it("should handle a expired context", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmWebd.context(1),
            fixtures.pmapi.PmWebd.fetchSingleMetric(1, 14, 15, [{ name: "metric1", value: 1 }]),
            fixtures.pmapi.PmWebd.contextExpired("/pmapi/1/_fetch"),
            fixtures.pmapi.PmWebd.context(2),
            fixtures.pmapi.PmWebd.fetchSingleMetric(2, 14, 15, [{ name: "metric2", value: 1 }])
        ]);

        let result = await ctx.context.fetch(["metric1"]);
        expect(result).toStrictEqual({
            "timestamp": 14.000015,
            "values": [{
                "name": "metric1",
                "pmid": "123",
                "instances": [{
                    "instance": null,
                    "value": 1,
                }]
            }]
        });

        result = await ctx.context.fetch(["metric2"]);
        expect(result).toStrictEqual({
            "timestamp": 14.000015,
            "values": [{
                "name": "metric2",
                "pmid": "123",
                "instances": [{
                    "instance": null,
                    "value": 1,
                }]
            }]
        });
    });

    it("request metric metadata", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmWebd.context(1),
            fixtures.pmapi.PmWebd.metric(1, "kernel.all.sysfork", "counter"),
            fixtures.pmapi.PmWebd.metric(1, "kernel.all.load", "counter")
        ]);

        const result = await ctx.context.metric(["kernel.all.load", "kernel.all.sysfork"]);
        expect(result).toStrictEqual({
            "metrics": [{
                "labels": {},
                "name": "kernel.all.load",
                "pmid": "251658254",
                "sem": "counter",
                "text-help": "fork rate metric from /proc/stat",
                "text-oneline": "fork rate metric from /proc/stat",
                "type": "U64",
                "units": "count",
            }, {
                "labels": {},
                "name": "kernel.all.sysfork",
                "pmid": "251658254",
                "sem": "counter",
                "text-help": "fork rate metric from /proc/stat",
                "text-oneline": "fork rate metric from /proc/stat",
                "type": "U64",
                "units": "count",
            }]
        });
    });

    it("fetch metric", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmWebd.context(1),
            fixtures.pmapi.PmWebd.fetchSingleMetric(1, 14, 15, [{ name: "metric1", value: 1 }])
        ]);

        const result = await ctx.context.fetch(["metric1"]);
        expect(result).toStrictEqual({
            "timestamp": 14.000015,
            "values": [{
                "name": "metric1",
                "pmid": "123",
                "instances": [{
                    "instance": null,
                    "value": 1,
                }]
            }]
        });
    });

    it("fetch missing metric", async () => {
        ctx.server.addResponses([
            fixtures.pmapi.PmWebd.context(1),
            fixtures.pmapi.PmWebd.fetchSingleMetric(1, 14, 15, [], ["metric1"])
        ]);

        const result = await ctx.context.fetch(["metric1"]);
        expect(result).toStrictEqual({
            "timestamp": 0,
            "values": []
        });
    });

});
