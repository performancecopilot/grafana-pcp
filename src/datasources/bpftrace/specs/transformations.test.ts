import Transformations from "../transformations";
import { TargetFormat, TimeSeriesResult, TargetResult } from "../datasource";

describe("Transformations", () => {
    let ctx: { templateSrv: any, transformations: Transformations } = {} as any;

    beforeEach(() => {
        ctx.templateSrv = {
            replace: jest.fn()
        };
        ctx.transformations = new Transformations(ctx.templateSrv);
    });

    it("should update labels", () => {
        const targetResults: TimeSeriesResult[] = [{
            target: "abc",
            datapoints: []
        }];
        const target: any = {
            format: TargetFormat.TimeSeries,
            legendFormat: "a $instance b"
        };

        ctx.templateSrv.replace.mockReturnValueOnce("a abc b");
        const result = ctx.transformations.transform(targetResults, target);
        const expected: TargetResult[] = [{
            target: "a abc b",
            datapoints: []
        }];
        expect(ctx.templateSrv.replace).toHaveBeenCalledWith("a $instance b", { instance: { value: "abc" } });
        expect(result).toStrictEqual(expected);
    });

    it("should transform histograms", () => {
        const targetResults: TimeSeriesResult[] = [
            { target: "2-3", datapoints: [[1, 1400]] },
            { target: "4-7", datapoints: [[2, 2300]] },
            { target: "8-15", datapoints: [[3, 5000]] }
        ];
        const target: any = {
            format: TargetFormat.Heatmap,
        };

        const result = ctx.transformations.transform(targetResults, target);
        const expected: TargetResult[] = [
            { target: "3", datapoints: [[1, 1000]] },
            { target: "7", datapoints: [[2, 2000]] },
            { target: "15", datapoints: [[3, 5000]] }
        ];
        expect(result).toStrictEqual(expected);
    });

    it("should transform tables", () => {
        const targetResults: TimeSeriesResult[] = [{
            target: "bpftrace.script.script1.output",
            datapoints: [[`
Tracing tcp connections. Hit Ctrl-C to end.
TIME     PID      COMM             SADDR                                   SPORT  DADDR                                   DPORT 
15:45:05 6085     pmproxy          0:0:4b2::a00:0                          45572  0:0:21ad::                              44321 
15:45:05 6085     pmproxy          127.0.0.1                               59890  127.0.0.1                               44321 
15:45:07 6085     pmproxy          0:0:8b2::a00:0                          45576  0:0:21ad::                              44321 
`, 1400]]
        }];

        const target: any = {
            format: TargetFormat.Table,
        };

        const result = ctx.transformations.transform(targetResults, target);
        const expected: TargetResult[] = [{
            "columns": [
                { "text": "TIME" },
                { "text": "PID" },
                { "text": "COMM" },
                { "text": "SADDR" },
                { "text": "SPORT" },
                { "text": "DADDR" },
                { "text": "DPORT" }
            ],
            "rows": [[
                "15:45:05",
                "6085",
                "pmproxy",
                "0:0:4b2::a00:0",
                "45572",
                "0:0:21ad::",
                "44321"
            ], [
                "15:45:05",
                "6085",
                "pmproxy",
                "127.0.0.1",
                "59890",
                "127.0.0.1",
                "44321"
            ], [
                "15:45:07",
                "6085",
                "pmproxy",
                "0:0:8b2::a00:0",
                "45576",
                "0:0:21ad::",
                "44321"
            ]],
            "type": "table"
        }];
        expect(result).toStrictEqual(expected);
    });

});
