import HttpServerMock from '../../../lib/specs/lib/http_server_mock';
import { PCPRedisDatasource } from '../../datasource';
import { templateSrv } from '../../../lib/specs/lib/template_srv_mock';
import fixtures from '../../../lib/specs/lib/fixtures';

describe("PCP Redis End-to-End", () => {
    const ctx: { server: HttpServerMock, datasource: PCPRedisDatasource } = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            url: 'http://localhost:44322',
        };
        ctx.server = new HttpServerMock(instanceSettings.url, false);
        const backendSrv = {
            datasourceRequest: ctx.server.doRequest.bind(ctx.server)
        };
        ctx.datasource = new PCPRedisDatasource(instanceSettings, backendSrv, templateSrv);
    });

    afterEach(() => {
        expect(ctx.server.responsesSize()).toBe(0);
    });

    it("should perform a query", async () => {
        ctx.server.addResponses([
            fixtures.pmseries.query("kernel.all.sysfork", "4de74f3e9b34fbb12b76590e998fa160cb26ac75"),
            fixtures.pmseries.valuesNoIndom("4de74f3e9b34fbb12b76590e998fa160cb26ac75",
                { start: 0 - 2 * 60, finish: 20 + 60, samples: 200 },
                [{ "timestamp": 1000, "value": "38436" }, { "timestamp": 2000, "value": "38440" }]),
            fixtures.pmseries.descs("4de74f3e9b34fbb12b76590e998fa160cb26ac75", "counter"),
            fixtures.pmseries.metrics("4de74f3e9b34fbb12b76590e998fa160cb26ac75"),
            fixtures.pmseries.labels("4de74f3e9b34fbb12b76590e998fa160cb26ac75")
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "kernel.all.sysfork"
            }]
        };

        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: 'kernel.all.sysfork {hostname: "web01"}',
                datapoints: [
                    [4, 2000]
                ]
            }]
        });
    });

    it("should perform a query with instances", async () => {
        ctx.server.addResponses([
            fixtures.pmseries.query("kernel.all.load", "e12bc48d72d0ecb6d4d5a86f23a1a16121b3cdaa"),
            fixtures.pmseries.valuesIndom("e12bc48d72d0ecb6d4d5a86f23a1a16121b3cdaa",
                { start: 0 - 2 * 60, finish: 20 + 60, samples: 200 }, [
                { instance: "199f236a02406c5ff7a74c91fa5612e3ef58c459", timestamp: 1000, value: "8.700000e01" },
                { instance: "23afd8ee05118c73e32b6a85507ebe0b82bb1d7d", timestamp: 1000, value: "7.000000e01" },
                { instance: "f96de1c90abf0daefd6ef63963a6550c195afac1", timestamp: 1000, value: "5.600000e01" }
            ]),
            fixtures.pmseries.descs("e12bc48d72d0ecb6d4d5a86f23a1a16121b3cdaa"),
            fixtures.pmseries.metrics("e12bc48d72d0ecb6d4d5a86f23a1a16121b3cdaa"),
            fixtures.pmseries.labels("e12bc48d72d0ecb6d4d5a86f23a1a16121b3cdaa"),
            fixtures.pmseries.instances("e12bc48d72d0ecb6d4d5a86f23a1a16121b3cdaa", [
                { instance: "199f236a02406c5ff7a74c91fa5612e3ef58c459", id: 1, name: "1 minute" },
                { instance: "23afd8ee05118c73e32b6a85507ebe0b82bb1d7d", id: 5, name: "5 minute" },
                { instance: "f96de1c90abf0daefd6ef63963a6550c195afac1", id: 15, name: "15 minute" }
            ])
        ]);

        const query = {
            ...fixtures.grafana.query,
            targets: [{
                ...fixtures.grafana.queryTarget,
                expr: "kernel.all.load"
            }]
        };

        let result = await ctx.datasource.query(query);
        expect(result).toStrictEqual({
            data: [{
                target: "1 minute",
                datapoints: [
                    [87, 1000]
                ]
            }, {
                target: "5 minute",
                datapoints: [
                    [70, 1000]
                ]
            }, {
                target: "15 minute",
                datapoints: [
                    [56, 1000]
                ]
            }]
        });
    });
});
