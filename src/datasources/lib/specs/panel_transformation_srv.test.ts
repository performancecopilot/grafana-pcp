import PanelTransformationSrv from "../services/panel_transformation_srv";
import { PCPRedisDatasource } from "../../redis/datasource";
import * as fixtures from './lib/fixtures';
import { TargetResult } from "../models/metrics";
import { TargetFormat } from "../models/datasource";
import { PCPVectorDatasource } from "../../vector/datasource";

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
                region: { value: "eu" }
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

    it("should handle empty instance names", () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget
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
                }, {
                    id: 2,
                    name: "",
                    values: [],
                    labels: {
                        "label2": "value2"
                    }
                }]
            }],
        }];

        const result = ctx.transformationSrv.transform(query, targetResults, PCPVectorDatasource.defaultLegendFormatter);
        expect(result).toStrictEqual([{
            target: "inst1",
            datapoints: []
        }, {
            target: "",
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

    it("should transform a CSV table", () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                format: TargetFormat.CsvTable
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric",
                instances: [{
                    id: 1,
                    name: "bpftrace.script.script1.output",
                    values: [[`
TIME,PID,COMM,SADDR,SPORT,DADDR,DPORT
15:45:05,6085,pmproxy,0:0:4b2::a00:0,45572,0:0:21ad::,44321
15:45:05,6085,pmproxy,127.0.0.1,59890,127.0.0.1,44321
15:45:07,6085,pmproxy,0:0:8b2::a00:0,45576,0:0:21ad::,44321
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

    it("should transform a CSV table with quotes", async () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                format: TargetFormat.CsvTable
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric",
                instances: [{
                    id: 1,
                    name: "bpftrace.script.script1.output",
                    values: [[`
PID,COMM,FD,ERR,PATH,MIX1,MIX2
123,"some,command",0,0,'/home/user/strange,folder',"'",'"'
`, 1400]],
                    labels: {}
                }]
            }]
        }];

        const result = ctx.transformationSrv.transform(query, results, () => "");
        expect(result).toStrictEqual([{
            "columns": [
                { "text": "PID" },
                { "text": "COMM" },
                { "text": "FD" },
                { "text": "ERR" },
                { "text": "PATH" },
                { "text": "MIX1" },
                { "text": "MIX2" }
            ],
            "rows": [[
                "123",
                "some,command",
                "0",
                "0",
                "/home/user/strange,folder",
                "'",
                '"'
            ]],
            "type": "table"
        }]);
    });

    it("should transform multiple queries into a table", () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                expr: "metric1",
                format: TargetFormat.MetricsTable,
            }, {
                ...fixtures.queryTarget,
                expr: "metric2",
                format: TargetFormat.MetricsTable,
            }, {
                ...fixtures.queryTarget,
                expr: "single",
                format: TargetFormat.MetricsTable,
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric1",
                instances: [
                    { id: 0, name: "sda", values: [[1, 1000], [2, 2000]], labels: {} },
                    { id: 1, name: "nvme", values: [[3, 1000], [4, 2000]], labels: {} }
                ]
            }]
        }, {
            target: query.targets[1],
            metrics: [{
                name: "metric2",
                instances: [
                    { id: 1, name: "nvme", values: [[5, 1000], [6, 2000]], labels: {} },
                    { id: 2, name: "hda", values: [[7, 1000], [8, 2000]], labels: {} }
                ]
            }]
        }, {
            target: query.targets[2],
            metrics: [{
                name: "single",
                instances: [
                    { id: null, name: "", values: [[9, 1000], [10, 2000]], labels: {} }
                ]
            }]
        }];

        const result = ctx.transformationSrv.transform(query, results, PCPVectorDatasource.defaultLegendFormatter);
        expect(result).toStrictEqual([{
            "columns": [
                { "text": "instance" },
                { "text": "metric1" },
                { "text": "metric2" },
                { "text": "single" }
            ],
            "rows": [
                ["sda", 2, "", ""],
                ["nvme", 4, 6, ""],
                ["hda", "", 8, ""],
                ["", "", "", 10]
            ],
            "type": "table"
        }]);
    });

    it("should transform multiple queries into a table and transform legends", () => {
        const query = {
            ...fixtures.query,
            targets: [{
                ...fixtures.queryTarget,
                expr: "metric1",
                format: TargetFormat.MetricsTable,
                legendFormat: "TX"
            }, {
                ...fixtures.queryTarget,
                expr: "disk.dev.read",
                format: TargetFormat.MetricsTable,
                legendFormat: "$metric"
            }]
        };
        const results: TargetResult[] = [{
            target: query.targets[0],
            metrics: [{
                name: "metric1",
                instances: [
                    { id: 0, name: "sda", values: [[1, 1000], [2, 2000]], labels: {} }
                ]
            }]
        }, {
            target: query.targets[1],
            metrics: [{
                name: "disk.dev.read",
                instances: [
                    { id: 0, name: "sda", values: [[3, 1000], [4, 2000]], labels: {} }
                ]
            }]
        }];

        const result = ctx.transformationSrv.transform(query, results, PCPVectorDatasource.defaultLegendFormatter);
        expect(result).toStrictEqual([{
            "columns": [
                { "text": "instance" },
                { "text": "TX" },
                { "text": "disk.dev.read" }
            ],
            "rows": [
                ["sda", 2, 4]
            ],
            "type": "table"
        }]);
    });

});
