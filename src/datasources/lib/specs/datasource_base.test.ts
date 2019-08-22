import _ from 'lodash';
import { PCPLiveDatasourceBase } from "../datasource_base";
import { Endpoint } from "../endpoint_registry";
import DataStore from "../datastore";
import { PmapiSrv, Context } from '../services/pmapi_srv';
import { Query, QueryTarget, TDatapoint } from '../models/datasource';
import { TargetResult } from '../models/metrics';
import * as fixtures from './lib/fixtures';

class Datasource extends PCPLiveDatasourceBase {
    async handleTarget(endpoint: Endpoint, query: Query, target: QueryTarget): Promise<TargetResult> {
        const results = endpoint.datastore.queryMetrics(target, [target.expr], query.range.from.valueOf(), query.range.to.valueOf());
        await this.applyTransformations(endpoint.pmapiSrv, results);
        return results;
    }
}

describe("DatasourceBase", () => {
    const ctx: { context: jest.Mocked<Context>, pmapiSrv: PmapiSrv, datasource: Datasource } = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0
            }
        };
        ctx.context = {
            indom: jest.fn(),
            metric: jest.fn()
        } as any;
        ctx.pmapiSrv = new PmapiSrv(ctx.context);
        ctx.datasource = new Datasource(instanceSettings, null, null);
    });

    it("should perform rate-conversation for counters", async () => {
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle,
                sem: "counter"
            }]
        });

        const targetResult = {
            target: fixtures.queryTarget,
            metrics: [{
                name: "metric.single",
                instances: [{
                    id: null,
                    name: "",
                    values: [
                        [400, 1000] as TDatapoint,
                        [500, 2000] as TDatapoint,
                        [700, 3000] as TDatapoint,
                    ],
                    labels: {}
                }]
            }]
        };

        await ctx.datasource.applyTransformations(ctx.pmapiSrv, targetResult);
        expect(targetResult).toMatchObject({
            metrics: [{
                instances: [{
                    values: [
                        [100, 2000],
                        [200, 3000]
                    ]
                }]
            }]
        });
    });

    it("should perform utilization-conversation for time-based counters", async () => {
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle,
                sem: "counter",
                units: "nanosec"
            }]
        });

        const targetResult = {
            target: fixtures.queryTarget,
            metrics: [{
                name: "metric.single",
                instances: [{
                    id: null,
                    name: "",
                    values: [
                        [1.5 * 1000000000, 1000] as TDatapoint,
                        [2.0 * 1000000000, 2000] as TDatapoint,
                        [3.0 * 1000000000, 3000] as TDatapoint,
                    ],
                    labels: {}
                }]
            }]
        };

        await ctx.datasource.applyTransformations(ctx.pmapiSrv, targetResult);
        expect(targetResult).toMatchObject({
            metrics: [{
                instances: [{
                    values: [
                        [0.5, 2000],
                        [1, 3000]
                    ]
                }]
            }]
        });
    });

    it("should not modify the datastore", async () => {
        ctx.context.metric.mockResolvedValueOnce({
            metrics: [{
                ...fixtures.metricMetadataSingle,
                sem: "counter"
            }]
        });

        const datastore = new DataStore(ctx.pmapiSrv, 10000);
        await datastore.ingest({
            "timestamp": 1,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 400
                }]
            }]
        });
        await datastore.ingest({
            "timestamp": 2,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 500
                }]
            }]
        });
        await datastore.ingest({
            "timestamp": 3,
            "values": [{
                "pmid": "1.0.1",
                "name": "metric.single",
                "instances": [{
                    "instance": null,
                    "value": 700
                }]
            }]
        });

        const query = {
            ...fixtures.query,
            range: {
                from: new Date(1000),
                to: new Date(3000)
            },
            targets: [{
                ...fixtures.queryTarget,
                expr: "metric.single",
            }]
        };
        const endpoint = {
            id: "",
            pmapiSrv: ctx.pmapiSrv,
            pollSrv: {} as any,
            datastore
        };
        const result1 = _.cloneDeep(await ctx.datasource.handleTarget(endpoint, query, query.targets[0]));
        const result2 = await ctx.datasource.handleTarget(endpoint, query, query.targets[0]);

        expect(result1).toMatchObject({
            metrics: [{
                instances: [{
                    values: [
                        [100, 2000],
                        [200, 3000]
                    ]
                }]
            }]
        });
        expect(result1).toStrictEqual(result2);
    });

});
