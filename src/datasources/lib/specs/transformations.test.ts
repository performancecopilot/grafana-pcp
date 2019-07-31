import Transformations from "../transformations";
import { TargetFormat, TimeSeriesData, TableData, TargetResult, QueryTarget } from "../types";

describe("Transformations", () => {
    let ctx: { templateSrv: any, transformations: Transformations } = {} as any;

    beforeEach(() => {
        ctx.templateSrv = {
            replace: jest.fn()
        };
        ctx.transformations = new Transformations(ctx.templateSrv);
    });

    it("should update labels", () => {
        const query: any = {
            targets: [{
                format: TargetFormat.TimeSeries,
                legendFormat: "a $instance b"
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric",
                instances: [{
                    name: "abc",
                    values: []
                }]
            }]
        }];

        ctx.templateSrv.replace.mockReturnValueOnce("a abc b");
        const result = ctx.transformations.transform(query, results);
        const expected: TimeSeriesData[] = [{
            target: "a abc b",
            datapoints: []
        }];
        expect(ctx.templateSrv.replace.mock.calls[0][0]).toBe("a $instance b");
        expect(ctx.templateSrv.replace.mock.calls[0][1]).toMatchObject({ instance: { value: "abc" } });
        expect(result).toStrictEqual(expected);
    });

    it("should transform histograms", () => {
        const query: any = {
            targets: [{
                format: TargetFormat.Heatmap,
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric",
                instances: [
                    { name: "-inf--1", values: [[1, 1400]] },
                    { name: "2-3", values: [[1, 1400]] },
                    { name: "4-7", values: [[2, 2300]] },
                    { name: "8-15", values: [[3, 5000]] },
                    { name: "8-inf", values: [[3, 5000]] },
                ]
            }]
        }];

        const result = ctx.transformations.transform(query, results);
        const expected: TimeSeriesData[] = [
            { target: "-1", datapoints: [[1, 1000]] },
            { target: "3", datapoints: [[1, 1000]] },
            { target: "7", datapoints: [[2, 2000]] },
            { target: "15", datapoints: [[3, 5000]] },
            { target: "inf", datapoints: [[3, 5000]] }
        ];
        expect(result).toStrictEqual(expected);
    });

    it("should transform tables", () => {
        const query: any = {
            targets: [{
                format: TargetFormat.Table
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric",
                instances: [{
                    name: "bpftrace.script.script1.output",
                    values: [[`
Tracing tcp connections. Hit Ctrl-C to end.
TIME     PID      COMM             SADDR                                   SPORT  DADDR                                   DPORT 
15:45:05 6085     pmproxy          0:0:4b2::a00:0                          45572  0:0:21ad::                              44321 
15:45:05 6085     pmproxy          127.0.0.1                               59890  127.0.0.1                               44321 
15:45:07 6085     pmproxy          0:0:8b2::a00:0                          45576  0:0:21ad::                              44321 
`, 1400]]
                }]
            }]
        }];


        const result = ctx.transformations.transform(query, results);
        const expected: TableData[] = [{
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
