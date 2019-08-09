import _ from 'lodash';
import { PCPLiveDatasourceBase } from "../datasource_base";
import { Endpoint } from "../endpoint_registry";
import { Query, QueryTarget, TargetResult, TargetFormat, TDatapoint } from "../types";
import DataStore from "../datastore";

class Datasource extends PCPLiveDatasourceBase {
    async handleTarget(endpoint: Endpoint, query: Query, target: QueryTarget): Promise<TargetResult> {
        const results = endpoint.datastore.queryMetrics(target, [target.expr], query.range.from.valueOf(), query.range.to.valueOf());
        await this.applyTransformations(endpoint.context, results);
        return results;
    }
}

describe("DatasourceBase", () => {
    const ctx: { context: any, datasource: Datasource } = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0
            }
        };
        ctx.context = {
            metricMetadata: jest.fn()
        };
        ctx.datasource = new Datasource(instanceSettings, null, null, null);
    });

    it("should perform rate-conversation for counters", async () => {
        const targetResult = {
            target: {
                refId: "",
                expr: "",
                format: TargetFormat.TimeSeries
            },
            metrics: [{
                name: "metric1",
                instances: [{
                    name: "",
                    values: [
                        [45200, 1000] as TDatapoint,
                        [55200, 2000] as TDatapoint,
                        [75200, 3000] as TDatapoint,
                    ],
                    metadata: {}
                }]
            }]
        };
        ctx.context.metricMetadata.mockReturnValue({
            name: "",
            pmid: 1,
            sem: "counter",
            type: "u64",
            units: "bytes",
            labels: {}
        });

        await ctx.datasource.applyTransformations(ctx.context, targetResult);
        const expected = {
            metrics: [{
                instances: [{
                    values: [
                        [10000, 2000],
                        [20000, 3000]
                    ]
                }]
            }]
        };
        expect(targetResult).toMatchObject(expected);
    });

    it("should perform utilization-conversation for time-based counters", async () => {
        const targetResult = {
            target: {
                refId: "",
                expr: "",
                format: TargetFormat.TimeSeries
            },
            metrics: [{
                name: "metric1",
                instances: [{
                    name: "",
                    values: [
                        [1.5 * 1000000000, 1000] as TDatapoint,
                        [2.0 * 1000000000, 2000] as TDatapoint,
                        [3.0 * 1000000000, 3000] as TDatapoint,
                    ],
                    metadata: {}
                }]
            }]
        };
        ctx.context.metricMetadata.mockReturnValue({
            name: "",
            pmid: 1,
            sem: "counter",
            type: "u64",
            units: "nanosec",
            labels: {}
        });

        await ctx.datasource.applyTransformations(ctx.context, targetResult);
        const expected = {
            metrics: [{
                instances: [{
                    values: [
                        [0.5, 2000],
                        [1, 3000]
                    ]
                }]
            }]
        };
        expect(targetResult).toMatchObject(expected);
    });

    it("should not modify the datastore", async () => {
        const datastore = new DataStore(ctx.context, 10000);
        ctx.context.metricMetadata.mockReturnValue({});
        await datastore.ingest({
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
        await datastore.ingest({
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
        await datastore.ingest({
            "timestamp": {
                "s": 7,
                "us": 2000
            },
            "values": [{
                "pmid": 633356298,
                "name": "bpftrace.scripts.script1.data.scalar",
                "instances": [{
                    "instance": -1,
                    "value": 75200,
                    "instanceName": ""
                }]
            }]
        });

        const query = {
            targets: [{
                refId: "",
                expr: "bpftrace.scripts.script1.data.scalar",
                format: TargetFormat.TimeSeries
            }],
            range: {
                from: new Date(0),
                to: new Date(8640000000000000)
            }
        };
        const endpoint = {
            id: "",
            context: ctx.context,
            poller: {} as any,
            datastore
        };
        ctx.context.metricMetadata.mockReturnValue({
            name: "",
            pmid: 1,
            sem: "counter",
            type: "u64",
            units: "",
            labels: {}
        });
        const result1 = _.cloneDeep(await ctx.datasource.handleTarget(endpoint, query as any, query.targets[0]));
        const result2 = await ctx.datasource.handleTarget(endpoint, query as any, query.targets[0]);

        const expected = {
            metrics: [{
                instances: [{
                    values: [
                        [10000, 6002],
                        [20000, 7002]
                    ]
                }]
            }]
        };
        expect(result1).toMatchObject(expected);
        expect(result1).toStrictEqual(result2);
    });

});
