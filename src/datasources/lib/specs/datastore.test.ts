import DataStore from "../datastore";

describe("DataStore", () => {
    const ctx: { context: any, datastore: DataStore } = {} as any;

    beforeEach(() => {
        ctx.context = {
            metricMetadata: jest.fn()
        };
        ctx.datastore = new DataStore(ctx.context, 25000); // max age: 25s
    });

    it("should ingest single metrics", async () => {
        ctx.context.metricMetadata.mockReturnValue({});
        await ctx.datastore.ingest({
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
                    "instanceName": ""
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": {
                "s": 6,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 55200,
                    "instanceName": ""
                }]
            }]
        });

        const result = ctx.datastore.queryMetric("bpftrace.scripts.script1.data.scalar", 0, Infinity);
        const expected = [{
            "name": "",
            "values": [
                [45200, 5002],
                [55200, 6002]
            ],
            "metadata": {}
        }];
        expect(result).toStrictEqual(expected);
    });

    it("should ingest metrics with instance domains", async () => {
        ctx.context.metricMetadata.mockReturnValue({});
        await ctx.datastore.ingest({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.multiple",
                "instances": [{
                    "instance": 1,
                    "value": 45200,
                    "instanceName": "/dev/sda1"
                }, {
                    "instance": 2,
                    "value": 55200,
                    "instanceName": "/dev/sda2"
                }]
            }]
        });

        const result = ctx.datastore.queryMetric("bpftrace.scripts.script1.data.multiple", 0, Infinity);
        const expected = [{
            "name": "/dev/sda1",
            "values": [[45200, 5002]],
            "metadata": {}
        }, {
            "name": "/dev/sda2",
            "values": [[55200, 5002]],
            "metadata": {}
        }];
        expect(result).toStrictEqual(expected);
    });

    it("should remove old data from bpftrace output variables", async () => {
        ctx.context.metricMetadata.mockReturnValue({ labels: { metrictype: "output" } });
        await ctx.datastore.ingest({
            "timestamp": {
                "s": 5,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.output",
                "instances": [{
                    "instance": -1,
                    "value": "line1\n",
                    "instanceName": ""
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": {
                "s": 6,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.output",
                "instances": [{
                    "instance": -1,
                    "value": "line1\nline2\n",
                    "instanceName": ""
                }]
            }]
        });

        const result = ctx.datastore.queryMetric("bpftrace.scripts.script1.data.output", 0, Infinity);
        const expected = [{
            "name": "",
            "values": [["line1\nline2\n", 6002]],
            "metadata": {}
        }];
        expect(result).toStrictEqual(expected);
    });

    it("should return metrics in time range", async () => {
        ctx.context.metricMetadata.mockReturnValue({});
        await ctx.datastore.ingest({
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
                    "instanceName": ""
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": {
                "s": 6,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 55200,
                    "instanceName": ""
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": {
                "s": 7,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 65200,
                    "instanceName": ""
                }]
            }]
        });

        expect(ctx.datastore.queryMetric("bpftrace.scripts.script1.data.scalar", 0, Infinity))
            .toStrictEqual([{
                "name": "",
                "values": [
                    [45200, 5002],
                    [55200, 6002],
                    [65200, 7002]
                ],
                "metadata": {}
            }]);

        expect(ctx.datastore.queryMetric("bpftrace.scripts.script1.data.scalar", 6002, 6003))
            .toStrictEqual([{
                "name": "",
                "values": [
                    [55200, 6002]
                ],
                "metadata": {}
            }]);
    });

    it("should clean expired metrics", async () => {
        ctx.context.metricMetadata.mockReturnValue({});
        const date1 = new Date().getTime() - 30000;  // 30s ago
        const date2 = new Date().getTime() - 20000;
        const date3 = new Date().getTime() - 10000;

        await ctx.datastore.ingest({
            "timestamp": {
                "s": date1 / 1000,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 45200,
                    "instanceName": ""
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": {
                "s": date2 / 1000,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 55200,
                    "instanceName": ""
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": {
                "s": date3 / 1000,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 65200,
                    "instanceName": ""
                }]
            }]
        });

        // clean metrics older than 25s
        ctx.datastore.cleanExpiredMetrics();

        const result = ctx.datastore.queryMetric("bpftrace.scripts.script1.data.scalar", 0, Infinity);
        expect(result[0].values).toHaveLength(2);
        const maxAge = new Date().getTime() - 25000;
        expect(result[0].values[0][0]).toEqual(55200);
        expect(result[0].values[0][1]).toBeGreaterThanOrEqual(maxAge);
        expect(result[0].values[1][0]).toEqual(65200);
        expect(result[0].values[1][1]).toBeGreaterThanOrEqual(maxAge);
    });

});
