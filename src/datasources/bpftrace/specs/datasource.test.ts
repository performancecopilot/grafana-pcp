import q from 'q';
import { PCPBPFtraceDatasource } from "../datasource";
import request from "request";
import { TargetFormat, TimeSeriesData } from '../../lib/types';

function datasourceRequestHttp(options) {
    return new Promise((resolve, reject) => {
        request({ url: options.url, qs: options.params }, function (err, response, body) {
            if (err) {
                reject(err);
                return;
            }
            //console.log(options.url, options.params, JSON.stringify(JSON.parse(body)));
            resolve({ data: JSON.parse(body) });
        });
    });
}

describe.skip("DataSource", () => {
    let ctx: { datasource: PCPBPFtraceDatasource, backendSrv: any, templateSrv: any, variableSrv: any } = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            url: "http://localhost:44323",
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0
            }
        };
        ctx.backendSrv = {
            datasourceRequest: datasourceRequestHttp
        };
        ctx.templateSrv = {
            replace: jest.fn()
        };
        ctx.variableSrv = {};
        ctx.datasource = new PCPBPFtraceDatasource(instanceSettings, q, ctx.backendSrv, ctx.templateSrv, ctx.variableSrv);
    });

    it("should query timeseries", async () => {
        const query = {
            range: {
                from: new Date(0),
                to: Infinity
            },
            targets: [{
                code: "kretprobe:vfs_read { @bytes = hist(retval); }",
                format: TargetFormat.TimeSeries
            }]
        };

        const result1 = await ctx.datasource.query(query);
        expect(result1).toStrictEqual({ data: [] });

        // get initial values
        await ctx.datasource.doPollAll();
        // because it's a counter, we need at least 2 polls
        await ctx.datasource.doPollAll();

        const result2 = await ctx.datasource.query(query);
        expect(result2.data.length).toBeGreaterThan(0);
        expect((result2.data[0] as TimeSeriesData).datapoints).toHaveLength(1);
    });

    it("should do legend transformation for timeseries", async () => {
        const query = {
            range: {
                from: new Date(0),
                to: Infinity
            },
            targets: [{
                code: "kretprobe:vfs_read { @scalar = 1; }",
                format: TargetFormat.TimeSeries,
                legendFormat: "a $instance b"
            }]
        };

        const result1 = await ctx.datasource.query(query);
        expect(result1).toStrictEqual({ data: [] });

        // get initial values
        await ctx.datasource.doPollAll();
        // because it's a counter, we need at least 2 polls
        await ctx.datasource.doPollAll();

        ctx.templateSrv.replace.mockReturnValueOnce("a bpftrace.scripts.scriptX.data.scalar b");
        const result2 = await ctx.datasource.query(query);
        expect(ctx.templateSrv.replace.mock.calls[0][0]).toBe("a $instance b");
        expect(ctx.templateSrv.replace.mock.calls[0][1].instance.value).toMatch(/^bpftrace\.scripts\.script\d+\.data\.scalar$/);
        expect(result2.data.length).toBeGreaterThan(0);
        expect((result2.data[0] as TimeSeriesData).target).toBe("a bpftrace.scripts.scriptX.data.scalar b");
    });

    it("should query heatmaps", async () => {
        const query = {
            range: {
                from: new Date(0),
                to: Infinity
            },
            targets: [{
                code: "kretprobe:vfs_read { @bytes = hist(retval); }",
                format: TargetFormat.Heatmap
            }]
        };

        const result1 = await ctx.datasource.query(query);
        expect(result1).toStrictEqual({ data: [] });

        // get initial values
        await ctx.datasource.doPollAll();
        // because it's a counter, we need at least 2 polls
        await ctx.datasource.doPollAll();

        const result2 = await ctx.datasource.query(query);
        expect(result2.data.length).toBeGreaterThan(0);
        expect((result2.data[0] as TimeSeriesData).datapoints).toHaveLength(1);
        expect((result2.data[0] as TimeSeriesData).target).not.toContain("-");
    });
});
