import * as dateMock from 'jest-date-mock';
import DataStore from "../datastore";
import { PmapiSrv, Context } from "../services/pmapi_srv";
import * as fixtures from './lib/fixtures';

describe("DataStore", () => {
    const ctx: { context: jest.Mocked<Context>, pmapiSrv: PmapiSrv, datastore: DataStore } = {} as any;

    beforeEach(() => {
        dateMock.clear();
        ctx.context = {
            indom: jest.fn(),
            metric: jest.fn()
        } as any;
        ctx.pmapiSrv = new PmapiSrv(ctx.context);
        ctx.datastore = new DataStore(ctx.pmapiSrv, 5 * 60 * 1000);
    });

    it("should ingest single metrics", async () => {
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle
            }]
        });

        await ctx.datastore.ingest({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 100,
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": 6,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 200
                }]
            }]
        });

        const result = ctx.datastore.queryMetric("metric.single", 5 * 1000, 6 * 1000);
        expect(result).toStrictEqual([{
            "id": null,
            "name": "",
            "values": [
                [100, 5000],
                [200, 6000]
            ],
            "labels": {}
        }]);
    });

    it("should ingest metrics with instance domains", async () => {
        ctx.context.indom.mockResolvedValueOnce({
            instances: [
                { instance: 1, name: "/dev/sda1", labels: {} },
                { instance: 2, name: "/dev/sda2", labels: {} }
            ]
        });
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataIndom
            }]
        });

        await ctx.datastore.ingest({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.indom",
                "instances": [{
                    "instance": 1,
                    "value": 100
                }, {
                    "instance": 2,
                    "value": 200
                }]
            }]
        });

        const result = ctx.datastore.queryMetric("metric.indom", 5 * 1000, 5 * 1000);
        expect(result).toStrictEqual([{
            "id": 1,
            "name": "/dev/sda1",
            "values": [[100, 5000]],
            "labels": {}
        }, {
            "id": 2,
            "name": "/dev/sda2",
            "values": [[200, 5000]],
            "labels": {}
        }]);
    });

    it("should request missing instance names only once", async () => {
        ctx.context.indom.mockResolvedValueOnce({
            instances: [
                { instance: 1, name: "/dev/sda1", labels: {} },
                { instance: 2, name: "/dev/sda2", labels: {} }
            ]
        });
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataIndom
            }]
        });

        await ctx.datastore.ingest({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.indom",
                "instances": [{
                    "instance": 1,
                    "value": 100
                }, {
                    "instance": 2,
                    "value": 200
                }, {
                    "instance": 3,
                    "value": 300
                }, {
                    "instance": 4,
                    "value": 400
                }]
            }]
        });

        const result = ctx.datastore.queryMetric("metric.indom", 5 * 1000, 5 * 1000);
        expect(result).toStrictEqual([{
            "id": 1,
            "name": "/dev/sda1",
            "values": [[100, 5000]],
            "labels": {}
        }, {
            "id": 2,
            "name": "/dev/sda2",
            "values": [[200, 5000]],
            "labels": {}
        }, {
            "id": 3,
            "name": "",
            "values": [[300, 5000]],
            "labels": {}
        }, {
            "id": 4,
            "name": "",
            "values": [[400, 5000]],
            "labels": {}
        }]);
    });

    it("should remove old data from bpftrace control variables", async () => {
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle,
                name: "bpftrace.scripts.script1.output",
                labels: {
                    agent: "bpftrace",
                    metrictype: "control"
                }
            }]
        });

        await ctx.datastore.ingest({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.scripts.script1.output",
                "instances": [{
                    "instance": null,
                    "value": "line1\n"
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": 6,
            "values": [{
                "pmid": "1.0.1",
                "name": "bpftrace.scripts.script1.output",
                "instances": [{
                    "instance": null,
                    "value": "line1\nline2\n"
                }]
            }]
        });

        const result = ctx.datastore.queryMetric("bpftrace.scripts.script1.output", 0, Infinity);
        expect(result).toMatchObject([{
            "values": [["line1\nline2\n", 6000]],
            "labels": {
                "agent": "bpftrace",
                "metrictype": "control"
            }
        }]);
    });

    it("should return metrics in time range", async () => {
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle
            }]
        });

        await ctx.datastore.ingest({
            "timestamp": 5,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 100
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": 6,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 200
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": 7,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 300
                }]
            }]
        });

        expect(ctx.datastore.queryMetric("metric.single", 0, 10 * 10000)).toMatchObject([{
            "values": [
                [100, 5000],
                [200, 6000],
                [300, 7000]
            ]
        }]);

        expect(ctx.datastore.queryMetric("metric.single", 5999, 6001)).toMatchObject([{
            "values": [
                [200, 6000]
            ]
        }]);
    });

    it("should clean expired metrics", async () => {
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle
            }]
        });

        await ctx.datastore.ingest({
            "timestamp": 1 * 60,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 100
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": 4 * 60,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 200
                }]
            }]
        });
        await ctx.datastore.ingest({
            "timestamp": 6 * 60,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 300
                }]
            }]
        });

        // clean metrics older than 5min
        dateMock.advanceTo(6 * 60 * 1000);
        ctx.datastore.cleanup();

        const result = ctx.datastore.queryMetric("metric.single", 0, Infinity);
        expect(result).toMatchObject([{
            "values": [
                [200, 4 * 60 * 1000], [300, 6 * 60 * 1000]
            ]
        }]);

    });

});
