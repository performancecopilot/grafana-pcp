import PanelTransformationSrv from "../services/panel_transformation_srv";
import { PCPRedisDatasource } from "../../redis/datasource";
import * as fixtures from './lib/fixtures';
import { TargetResult } from "../models/metrics";
import { TargetFormat } from "../models/datasource";

describe("PanelTransformationSrv", () => {
    const ctx: { templateSrv: any, transformationSrv: PanelTransformationSrv } = {} as any;

    beforeEach(() => {
        ctx.templateSrv = {
            replace: jest.fn()
        };
        ctx.templateSrv.replace.mockImplementation((str: string, vars: any) => {
            for (const var_ in vars)
                str = str.replace('$' + var_, vars[var_].value);
            return str;
        });
        ctx.transformationSrv = new PanelTransformationSrv(ctx.templateSrv);
    });

    it("should update labels", () => {
        const query = {
            ...fixtures.query,
            scopedVars: {
                region: {value: "eu"}
            },
            targets: [{
                ...fixtures.queryTarget,
                legendFormat: "a $metric $metric0 $instance $label1 $region b"
            }]
        };
        const targetResults: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "disk.dev.read",
                instances: [{
                    id: 1,
                    name: "inst1",
                    values: [],
                    labels: {
                        "label1": "value1"
                    }
                }]
            }],
        }];

        const result = ctx.transformationSrv.transform(query, targetResults, () => "");
        expect(result).toStrictEqual([{
            target: "a disk.dev.read read inst1 value1 eu b",
            datapoints: []
        }]);
    });

    it("should use default for pmseries labels", () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "disk.dev.read",
                instances: [{
                    id: 1,
                    name: "inst1",
                    values: [],
                    labels: {
                        "label1": "value1",
                        "hostname": "host"
                    }
                }]
            }],
        }];

        const result = ctx.transformationSrv.transform(query, results, PCPRedisDatasource.defaultLegendFormatter);
        expect(result).toStrictEqual([{
            target: 'inst1 {hostname: "host"}',
            datapoints: []
        }]);
    });

    it("should transform heatmaps", () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                format: TargetFormat.Heatmap,
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric",
                instances: [
                    { id: 1, name: "-inf--1", values: [[1, 1400]], labels: {} },
                    { id: 1, name: "2-3", values: [[1, 1400]], labels: {} },
                    { id: 1, name: "4-7", values: [[2, 2300]], labels: {} },
                    { id: 1, name: "8-15", values: [[3, 5000]], labels: {} },
                    { id: 1, name: "8-inf", values: [[3, 5000]], labels: {} },
                ]
            }]
        }];

        const result = ctx.transformationSrv.transform(query, results, () => "");
        expect(result).toStrictEqual([
            { target: "-1", datapoints: [[1, 1000]] },
            { target: "3", datapoints: [[1, 1000]] },
            { target: "7", datapoints: [[2, 2000]] },
            { target: "15", datapoints: [[3, 5000]] },
            { target: "inf", datapoints: [[3, 5000]] }
        ]);
    });

    it("should transform tables", () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                format: TargetFormat.Table
            }]
        };
        /* tslint:disable:no-trailing-whitespace */
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric",
                instances: [{
                    id: 1,
                    name: "bpftrace.script.script1.output",
                    values: [[`
Tracing tcp connections. Hit Ctrl-C to end.
TIME     PID      COMM             SADDR                                   SPORT  DADDR                                   DPORT 
15:45:05 6085     pmproxy          0:0:4b2::a00:0                          45572  0:0:21ad::                              44321 
15:45:05 6085     pmproxy          127.0.0.1                               59890  127.0.0.1                               44321 
15:45:07 6085     pmproxy          0:0:8b2::a00:0                          45576  0:0:21ad::                              44321 
`, 1400]],
                    labels: {
                        agent: "bpftrace",
                        metrictype: "output"
                    }
                }]
            }]
        }];


        const result = ctx.transformationSrv.transform(query, results, () => "");
        expect(result).toStrictEqual([{
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
        }]);
    });

});
