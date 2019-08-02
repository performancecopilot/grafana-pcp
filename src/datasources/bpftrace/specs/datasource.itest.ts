import request from "request";
import { PCPBPFtraceDatasource } from "../datasource";
import { TargetFormat, TimeSeriesData } from '../../lib/types';

function datasourceRequestHttp(options) {
    return new Promise((resolve, reject) => {
        request({ url: options.url, qs: options.params }, function (err, response, body) {
            if (err) {
                reject(err);
                return;
            }
            console.log("url", options.url, "\nparams", options.params, "\nresponse", body);
            resolve({ data: JSON.parse(body) });
        });
    });
}

describe("DataSource", () => {
    let ctx: { datasource: PCPBPFtraceDatasource, backendSrv: any, templateSrv: any, variableSrv: any } = {} as any;

    const sampleQuery = {
        range: {
            from: new Date(0),
            to: new Date(8640000000000000)
        },
        scopedVars: {},
        timezone: "",
        interval: "1s",
        intervalMs: 1000,
        maxDataPoints: 100
    };

    beforeEach(() => {
        const instanceSettings = {
            url: "http://localhost:44322",
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
        ctx.datasource = new PCPBPFtraceDatasource(instanceSettings, ctx.backendSrv, ctx.templateSrv, ctx.variableSrv);

        ctx.templateSrv.replace.mockImplementation((str: string, vars: any) => {
            for (const var_ in vars)
                str = str.replace('$' + var_, vars[var_].value);
            return str;
        });
    });

    it("should query timeseries", async () => {
        const query = {
            ...sampleQuery,
            targets: [{
                refId: 'A',
                expr: "kretprobe:vfs_read { @bytes = hist(retval); }",
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
            ...sampleQuery,
            targets: [{
                refId: 'A',
                expr: "kretprobe:vfs_read { @scalar1 = 1; @scalar2 = 2; }",
                format: TargetFormat.TimeSeries,
                legendFormat: "a $metric $metric0 b"
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
        expect((result2.data[0] as TimeSeriesData).target).toMatch(/^a bpftrace\.scripts\.script\d+\.data\.scalar1 scalar1 b$/);
        expect((result2.data[1] as TimeSeriesData).target).toMatch(/^a bpftrace\.scripts\.script\d+\.data\.scalar2 scalar2 b$/);
    });

    it("should query heatmaps", async () => {
        const query = {
            ...sampleQuery,
            targets: [{
                refId: 'A',
                expr: "kretprobe:vfs_read { @bytes = hist(retval); }",
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
