import { advanceTo } from 'jest-date-mock';
import { setGlobalLogLevel } from '../../common/utils';
import { EndpointWithCtx } from '../../datasources/lib/pmapi/poller/types';
import { Target } from '../../datasources/lib/pmapi/types';
import { ds, grafana, pcp, pmapi, pmseries, poller } from '../../datasources/lib/specs/fixtures';
import { backendSrvMock, mockNextResponses } from '../../datasources/lib/specs/mocks/backend_srv';
import { TargetFormat } from '../../datasources/lib/types';
import { PCPVectorDataSource } from './datasource';
import { VectorTargetData } from './types';

jest.mock('@grafana/runtime', () => ({
    ...jest.requireActual<object>('@grafana/runtime'),
    getBackendSrv: () => backendSrvMock,
    getTemplateSrv: () => ({
        replace: (x: string) => x,
    }),
}));

describe('PCP Vector', () => {
    let datasource: PCPVectorDataSource;

    beforeEach(() => {
        jest.resetAllMocks();
        jest.useFakeTimers();
        advanceTo(20000);
        setGlobalLogLevel('DEBUG');

        const instanceSettings = {
            url: 'http://localhost:1234',
            jsonData: {},
        };
        datasource = new PCPVectorDataSource(instanceSettings as any);
    });

    it('should poll disk.dev.read, perform rate conversation and return the result', async () => {
        const queries = [ds.query()];
        let response = await datasource.query(grafana.dataQueryRequest(queries));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(false),
            pmapi.metric(['disk.dev.read']),
            pmapi.fetch('disk.dev.read', 10, [
                [0, 100],
                [1, 0],
            ]),
            pmapi.indom('disk.dev.read'),
        ]);
        await datasource.poller.poll();

        mockNextResponses([
            pmapi.fetch('disk.dev.read', 11, [
                [0, 200],
                [1, 0],
            ]),
        ]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(queries));
        expect({ fields: response.data[0].fields }).toMatchInlineSnapshot(
            {
                fields: [{}, { config: { custom: expect.anything() } }, { config: { custom: expect.anything() } }],
            },

            `
            Object {
              "fields": Array [
                Object {
                  "config": Object {},
                  "name": "Time",
                  "type": "time",
                  "values": Array [
                    10000,
                    11000,
                  ],
                },
                Object {
                  "config": Object {
                    "custom": Anything,
                    "displayName": "",
                  },
                  "labels": Object {
                    "agent": "linux",
                    "device_type": "block",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "indom_name": "per disk",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                  },
                  "name": "disk.dev.read[nvme0n1]",
                  "type": "number",
                  "values": Array [
                    null,
                    100,
                  ],
                },
                Object {
                  "config": Object {
                    "custom": Anything,
                    "displayName": "",
                  },
                  "labels": Object {
                    "agent": "linux",
                    "device_type": "block",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "indom_name": "per disk",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                  },
                  "name": "disk.dev.read[sda]",
                  "type": "number",
                  "values": Array [
                    null,
                    0,
                  ],
                },
              ],
            }
        `
        );
        expect(backendSrvMock.fetch.mock.calls.map(([{ url, params }]) => ({ url, params }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "params": Object {
                  "hostspec": "127.0.0.1",
                  "polltimeout": 11,
                },
                "url": "http://localhost:1234/pmapi/context",
              },
              Object {
                "params": undefined,
                "url": "http://localhost:1234/series/ping",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "disk.dev.read",
                },
                "url": "http://localhost:1234/pmapi/metric",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "disk.dev.read",
                },
                "url": "http://localhost:1234/pmapi/fetch",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "name": "disk.dev.read",
                },
                "url": "http://localhost:1234/pmapi/indom",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "disk.dev.read",
                },
                "url": "http://localhost:1234/pmapi/fetch",
              },
            ]
        `);
    });

    // anything thats not a metric name
    it('should be able to detect derived metric formulas', () => {
        const metrics = ['statsd.pmda.received', 'statsd.pmda', 'statsd', 'statsd_pmda', 'statsd_pmda_received'];
        metrics.forEach(metric => expect(datasource.isDerivedMetric(metric)).toBe(false));

        const formulas = [
            'disk.all.blktotal/disk.all.total',
            'disk.all.blktotal+disk.all.total',
            'disk.all.blktotal-disk.all.total',
            'disk.all.blktotal*disk.all.total',
            'network.interface.in.bytes[eth1]',
            'disk.all.blktotal/2',
            'disk.all.blktotal+2',
            'disk.all.blktotal-2',
            'disk.all.blktotal.2',
            'avg(network.interface.speed)',
        ];
        formulas.forEach(formula => expect(datasource.isDerivedMetric(formula)).toBe(true));
    });

    it('should be able to build a derived metric name', () => {
        const formulas = [
            'disk.all.blktotal/disk.all.total',
            'network.interface.in.bytes[eth1]',
            'disk.all.blktotal/2',
            'disk.all.blktotal+2',
        ];
        const names = formulas.map(formula => {
            const name = datasource.computeDerivedMetricName(formula);
            expect(name).toContain('derived_');
            return name;
        });

        // check that all derived metric names are different
        expect(new Set(names).size).toBe(names.length);
    });

    it('should be able to create derived metric and store information about it', async () => {
        const spy = jest.spyOn(datasource.pmApiService, 'derive');
        const expr = 'disk.all.blktotal/2';
        const endpointMock: jest.Mocked<EndpointWithCtx> = { context: { context: 0 } } as any;
        mockNextResponses([pmapi.derive()]);
        await datasource.registerDerivedMetric(endpointMock, expr);

        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0][1]).toMatchObject({ name: datasource.computeDerivedMetricName(expr) });
        expect(datasource.derivedMetrics.has(expr)).toBe(true);
    });

    it('should request registration of derived metric', async () => {
        const expr = 'disk.all.blktotal/2';
        const metricName = datasource.computeDerivedMetricName(expr);
        const createDerivedSpy = jest.spyOn(datasource.pmApiService, 'derive');
        const registerDeriverMetricSpy = jest.spyOn(datasource, 'registerDerivedMetric');
        const targetMock: jest.Mocked<Target<VectorTargetData>> = { query: { expr } } as any;
        const endpointMock: jest.Mocked<EndpointWithCtx> = { context: { context: 0 } } as any;

        mockNextResponses([pmapi.derive()]);
        const resultRegistered = await datasource.registerTarget(endpointMock, targetMock);

        expect(resultRegistered).toEqual([metricName]);
        expect(createDerivedSpy).toBeCalledTimes(1);
        expect(registerDeriverMetricSpy).toBeCalledTimes(1);
        expect(datasource.derivedMetrics.size).toBe(1);
        expect(datasource.derivedMetrics.has(expr)).toBe(true);

        // will skip registering derived metric, since we already did so
        const resultRegistrationSkipped = await datasource.registerTarget(endpointMock, targetMock);
        expect(resultRegistrationSkipped).toEqual([metricName]);
        expect(createDerivedSpy).toBeCalledTimes(1);
        expect(registerDeriverMetricSpy).toBeCalledTimes(1);
        expect(datasource.derivedMetrics.size).toBe(1);
        expect(datasource.derivedMetrics.has(expr)).toBe(true);
    });

    it('redisBackfill hook should request series api for backfilling and populate metric values', async () => {
        const targets = [
            poller.target({ query: { expr: 'disk.dev.read', refId: 'A' } }),
            poller.target({ query: { expr: 'kernel.all.sysfork', refId: 'B' } }),
        ];
        const metrics = [pcp.metrics['disk.dev.read'], pcp.metrics['kernel.all.sysfork']];
        const endpoint = poller.endpoint({ metrics, targets });

        mockNextResponses([
            pmseries.values(['disk.dev.read', 'kernel.all.sysfork']),
            pmseries.instances(['disk.dev.read']),
            pmseries.labels(['disk.dev.read[sda]', 'disk.dev.read[nvme0n1]']),
        ]);
        await datasource.redisBackfill(endpoint, targets);
        expect(endpoint.metrics).toMatchSnapshot();
        expect(backendSrvMock.fetch.mock.calls.map(([{ url, params }]) => ({ url, params }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "params": Object {
                  "finish": "now",
                  "interval": "1s",
                  "series": "73d93ee9efa086923d0c9eabc96f98f2b583b8f2,f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9",
                  "start": "-1800second",
                },
                "url": "http://fixture_url:1234/series/values",
              },
              Object {
                "params": Object {
                  "series": "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9",
                },
                "url": "http://fixture_url:1234/series/instances",
              },
              Object {
                "params": Object {
                  "series": "0aeab8b239522ab0640577ed788cc601fc640266,7f3afb6f41e53792b18e52bcec26fdfa2899fa58",
                },
                "url": "http://fixture_url:1234/series/labels",
              },
            ]
        `);
    });

    it('redisBackfill hook should use panel url', async () => {
        const queries = [ds.query({ expr: 'kernel.all.sysfork', url: 'http://panel_url:1234' })];
        let response = await datasource.query(grafana.dataQueryRequest(queries));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(true),
            pmapi.metric(['kernel.all.sysfork']),
            pmseries.values(['kernel.all.sysfork']),
            pmapi.fetch('kernel.all.sysfork', 12, [[null, 400]]),
            ,
        ]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(queries));
        expect({ fields: response.data[0].fields }).toMatchInlineSnapshot(
            { fields: [{}, { config: { custom: expect.anything() } }] },

            `
            Object {
              "fields": Array [
                Object {
                  "config": Object {},
                  "name": "Time",
                  "type": "time",
                  "values": Array [
                    10000,
                    11000,
                    12000,
                  ],
                },
                Object {
                  "config": Object {
                    "custom": Anything,
                    "displayName": "",
                  },
                  "labels": Object {
                    "agent": "linux",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                  },
                  "name": "kernel.all.sysfork",
                  "type": "number",
                  "values": Array [
                    null,
                    100,
                    200,
                  ],
                },
              ],
            }
        `
        );
        expect(backendSrvMock.fetch.mock.calls.map(([{ url, params }]) => ({ url, params }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "params": Object {
                  "hostspec": "127.0.0.1",
                  "polltimeout": 11,
                },
                "url": "http://panel_url:1234/pmapi/context",
              },
              Object {
                "params": undefined,
                "url": "http://panel_url:1234/series/ping",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "kernel.all.sysfork",
                },
                "url": "http://panel_url:1234/pmapi/metric",
              },
              Object {
                "params": Object {
                  "finish": "now",
                  "interval": "1s",
                  "series": "73d93ee9efa086923d0c9eabc96f98f2b583b8f2",
                  "start": "-1800second",
                },
                "url": "http://panel_url:1234/series/values",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "kernel.all.sysfork",
                },
                "url": "http://panel_url:1234/pmapi/fetch",
              },
            ]
        `);
    });
});

describe('PCP Vector: overridden url and hostspec', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.useFakeTimers();
        advanceTo(20000);
        setGlobalLogLevel('DEBUG');
    });

    it('should use non-default hostspec from datasource settings', async () => {
        const instanceSettings = {
            url: 'http://settings_host:1234',
            jsonData: {
                hostspec: 'pcp://settings_hostspec:4321',
            },
        };
        const datasource = new PCPVectorDataSource(instanceSettings as any);
        const targets = [{ refId: 'A', expr: 'mem.util.free', format: TargetFormat.TimeSeries }];

        let response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(false),
            pmapi.metric(['mem.util.free']),
            pmapi.fetch('mem.util.free', 10, [[null, 1000]]),
        ]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toMatchObject({
            data: [{ fields: [{ values: { buffer: [10000] } }, { values: { buffer: [1000] } }] }],
        });
        expect(backendSrvMock.fetch.mock.calls.map(([{ url, params }]) => ({ url, params }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "params": Object {
                  "hostspec": "pcp://settings_hostspec:4321",
                  "polltimeout": 11,
                },
                "url": "http://settings_host:1234/pmapi/context",
              },
              Object {
                "params": undefined,
                "url": "http://settings_host:1234/series/ping",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://settings_host:1234/pmapi/metric",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://settings_host:1234/pmapi/fetch",
              },
            ]
        `);
    });

    it('should use url from panel config', async () => {
        const instanceSettings = {
            url: 'http://settings_host:1234',
            jsonData: {
                hostspec: 'pcp://settings_hostspec:4321',
            },
        };
        const datasource = new PCPVectorDataSource(instanceSettings as any);
        const targets = [
            { refId: 'A', expr: 'mem.util.free', format: TargetFormat.TimeSeries, url: 'http://panel_host:8080' },
        ];

        let response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(false),
            pmapi.metric(['mem.util.free']),
            pmapi.fetch('mem.util.free', 10, [[null, 1000]]),
        ]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toMatchObject({
            data: [{ fields: [{ values: { buffer: [10000] } }, { values: { buffer: [1000] } }] }],
        });
        expect(backendSrvMock.fetch.mock.calls.map(([{ url, params }]) => ({ url, params }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "params": Object {
                  "hostspec": "pcp://settings_hostspec:4321",
                  "polltimeout": 11,
                },
                "url": "http://panel_host:8080/pmapi/context",
              },
              Object {
                "params": undefined,
                "url": "http://panel_host:8080/series/ping",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://panel_host:8080/pmapi/metric",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://panel_host:8080/pmapi/fetch",
              },
            ]
        `);
    });

    it('should use hostspec from panel config', async () => {
        const instanceSettings = {
            url: 'http://settings_host:1234',
            jsonData: {
                hostspec: 'pcp://settings_hostspec:4321',
            },
        };
        const datasource = new PCPVectorDataSource(instanceSettings as any);
        const targets = [
            {
                refId: 'A',
                expr: 'mem.util.free',
                format: TargetFormat.TimeSeries,
                hostspec: 'pcp://panel_hostspec:44322?container=app',
            },
        ];

        let response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(false),
            pmapi.metric(['mem.util.free']),
            pmapi.fetch('mem.util.free', 10, [[null, 1000]]),
        ]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toMatchObject({
            data: [{ fields: [{ values: { buffer: [10000] } }, { values: { buffer: [1000] } }] }],
        });
        expect(backendSrvMock.fetch.mock.calls.map(([{ url, params }]) => ({ url, params }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "params": Object {
                  "hostspec": "pcp://panel_hostspec:44322?container=app",
                  "polltimeout": 11,
                },
                "url": "http://settings_host:1234/pmapi/context",
              },
              Object {
                "params": undefined,
                "url": "http://settings_host:1234/series/ping",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://settings_host:1234/pmapi/metric",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://settings_host:1234/pmapi/fetch",
              },
            ]
        `);
    });

    it('should use url and hostspec from panel config', async () => {
        const instanceSettings = {
            url: 'http://settings_host:1234',
            jsonData: {
                hostspec: 'pcp://settings_hostspec:4321',
            },
        };
        const datasource = new PCPVectorDataSource(instanceSettings as any);
        const targets = [
            {
                refId: 'A',
                expr: 'mem.util.free',
                format: TargetFormat.TimeSeries,
                url: 'http://panel_host:8080',
                hostspec: 'pcp://panel_hostspec:44322?container=app',
            },
        ];

        let response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(false),
            pmapi.metric(['mem.util.free']),
            pmapi.fetch('mem.util.free', 10, [[null, 1000]]),
        ]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toMatchObject({
            data: [{ fields: [{ values: { buffer: [10000] } }, { values: { buffer: [1000] } }] }],
        });
        expect(backendSrvMock.fetch.mock.calls.map(([{ url, params }]) => ({ url, params }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "params": Object {
                  "hostspec": "pcp://panel_hostspec:44322?container=app",
                  "polltimeout": 11,
                },
                "url": "http://panel_host:8080/pmapi/context",
              },
              Object {
                "params": undefined,
                "url": "http://panel_host:8080/series/ping",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://panel_host:8080/pmapi/metric",
              },
              Object {
                "params": Object {
                  "context": 123,
                  "names": "mem.util.free",
                },
                "url": "http://panel_host:8080/pmapi/fetch",
              },
            ]
        `);
    });
});
