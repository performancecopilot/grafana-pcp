import { PCPVectorDataSource } from './datasource';
import { VectorTargetData } from './types';
import { Target } from 'datasources/lib/pmapi/types';
import { Endpoint, InstanceValuesSnapshot } from 'datasources/lib/pmapi/poller/types';
import {
    SeriesInstancesResponse,
    SeriesMetricsItemResponse,
    SeriesValuesResponse,
} from 'common/services/pmseries/types';
import { Dict } from 'common/types/utils';
import { backendSrvMock, mockNextResponses } from 'datasources/lib/specs/mocks/backend_srv';
import { TargetFormat } from 'datasources/lib/types';
import { grafana, pmapi, pmseries } from 'datasources/lib/specs/fixtures';

jest.mock('@grafana/runtime', () => ({
    ...jest.requireActual<object>('@grafana/runtime'),
    getBackendSrv: () => backendSrvMock,
    getTemplateSrv: () => ({
        replace: (x: string) => x,
    }),
}));
jest.mock('./config', () => ({
    Config: {
        ...jest.requireActual<any>('./config').Config,
        defaultRefreshIntervalMs: 999999999, // never run timers in unit tests
    },
}));

describe('PCP Vector', () => {
    let datasource: PCPVectorDataSource;

    beforeEach(() => {
        jest.clearAllMocks();

        //Object.values(rootLogger.getLoggers()).forEach(logger => logger.setLevel('DEBUG'));
        const instanceSettings = {
            url: 'http://localhost:1234',
            jsonData: {
                retentionTime: '0',
            },
        };
        datasource = new PCPVectorDataSource(instanceSettings as any);
    });

    it('should poll disk.dev.read, perform rate conversation and return the result', async () => {
        const targets = [{ refId: 'A', expr: 'disk.dev.read', format: TargetFormat.TimeSeries }];

        let response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(false),
            pmapi.metricIndom(),
            pmapi.fetch(0, 100, 0),
            pmapi.indom(),
        ]);
        await datasource.poller.poll();

        mockNextResponses([pmapi.fetch(1, 200, 0)]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toMatchSnapshot();
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
            const name = datasource.derivedMetricName(formula);
            expect(name).toContain('derived_');
            return name;
        });

        // check that all derived metric names are different
        expect(new Set(names).size).toBe(names.length);
    });

    it('should be able to create derived metric and store information about it', async () => {
        const spy = jest
            .spyOn(datasource.pmApiService, 'derive')
            .mockImplementation(() => Promise.resolve({ success: true }));

        const expr = 'disk.all.blktotal/2';
        const targetMock: jest.Mocked<Target<VectorTargetData>> = { query: { expr } } as any;
        const endpointMock: jest.Mocked<Endpoint> = { context: { context: 0 } } as any;
        await datasource.registerDerivedMetric(targetMock, endpointMock);

        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0][1]).toMatchObject({ name: datasource.derivedMetricName(expr) });
        expect(datasource.derivedMetrics.has(expr)).toBe(true);
    });

    it('should request registration of derived metric', async () => {
        const expr = 'disk.all.blktotal/2';
        const metricName = datasource.derivedMetricName(expr);
        const createDerivedSpy = jest
            .spyOn(datasource.pmApiService, 'derive')
            .mockImplementation(() => Promise.resolve({ success: true }));
        const registerDeriverMetricSpy = jest.spyOn(datasource, 'registerDerivedMetric');
        const targetMock: jest.Mocked<Target<VectorTargetData>> = { query: { expr } } as any;
        const endpointMock: jest.Mocked<Endpoint> = { context: { context: 0 } } as any;
        const resultRegistered = await datasource.registerTarget(targetMock, endpointMock);

        expect(resultRegistered).toEqual([metricName]);
        expect(createDerivedSpy).toBeCalledTimes(1);
        expect(registerDeriverMetricSpy).toBeCalledTimes(1);
        expect(datasource.derivedMetrics.size).toBe(1);
        expect(datasource.derivedMetrics.has(expr)).toBe(true);

        // will skip registering derived metric, since we already did so
        const resultRegistrationSkipped = await datasource.registerTarget(targetMock, endpointMock);
        expect(resultRegistrationSkipped).toEqual([metricName]);
        expect(createDerivedSpy).toBeCalledTimes(1);
        expect(registerDeriverMetricSpy).toBeCalledTimes(1);
        expect(datasource.derivedMetrics.size).toBe(1);
        expect(datasource.derivedMetrics.has(expr)).toBe(true);
    });

    it('redisBackfill hook should request series api for backfilling and populate metricValues with returned stuff', async () => {
        const endpointMock: jest.Mocked<Endpoint> = {
            metrics: [
                { metadata: { name: 'disk.dev.read', series: 'series_0' }, values: [] },
                { metadata: { name: 'disk.dev.write', series: 'series_1' }, values: [] },
                { metadata: { name: 'bogus_metric', series: 'series_2' }, values: [] },
            ],
        } as any;
        const pendingTargetsMock: jest.Mocked<Array<Target<VectorTargetData>>> = [
            {
                metricNames: ['disk.dev.read'],
            },
            {
                metricNames: ['disk.dev.write'],
            },
        ] as any;
        const seriesValuesMockResponse: SeriesValuesResponse = [
            {
                series: 'series_0',
                instance: 'series_0_instance_0',
                timestamp: 1599320691309.87,
                value: '72125',
            },
            {
                series: 'series_0',
                instance: 'series_0_instance_0',
                timestamp: 1599320751310.403,
                value: '72835',
            },
            {
                series: 'series_1',
                instance: 'series_1_instance_0',
                timestamp: 1599320691309.87,
                value: '5373',
            },
            {
                series: 'series_1',
                instance: 'series_1_instance_0',
                timestamp: 1599320751310.403,
                value: '6870',
            },
        ];
        const seriesInstancesMockResponse: SeriesInstancesResponse = [
            {
                series: 'series_0',
                source: 'source_0',
                instance: 'series_0_instance_0',
                id: 0,
                name: 'nvme0n1',
            },
            {
                series: 'series_1',
                source: 'source_0',
                instance: 'series_1_instance_0',
                id: 0,
                name: 'nvme0n1',
            },
        ];
        const seriesMetricsMockResponse: SeriesMetricsItemResponse[] = [
            {
                series: 'series_0',
                name: 'disk.dev.read',
            },
            {
                series: 'series_1',
                name: 'disk.dev.write',
            },
        ];
        const seriesApiValuesSpy = jest
            .spyOn(datasource.pmSeriesApiService, 'values')
            .mockImplementation(() => Promise.resolve(seriesValuesMockResponse));
        const seriesApiInstancesSpy = jest
            .spyOn(datasource.pmSeriesApiService, 'instances')
            .mockImplementation(() => Promise.resolve(seriesInstancesMockResponse));
        const seriesApiMetricsSpy = jest
            .spyOn(datasource.pmSeriesApiService, 'metrics')
            .mockImplementation(() => Promise.resolve(seriesMetricsMockResponse));
        await datasource.redisBackfill(endpointMock, pendingTargetsMock);
        // check that only pending targets' series have been queried for
        const requestedSeriesIdentifiers = ['series_0', 'series_1'];
        expect(seriesApiValuesSpy).toBeCalledTimes(1);
        const seriesApiValuesSeriesParam = seriesApiValuesSpy.mock.calls[0][0].series!;
        expect(seriesApiValuesSeriesParam).toEqual(requestedSeriesIdentifiers);
        expect(seriesApiInstancesSpy).toBeCalledTimes(1);
        const seriesApiInstancesSeriesParam = seriesApiInstancesSpy.mock.calls[0][0].series!;
        expect(seriesApiInstancesSeriesParam).toEqual(requestedSeriesIdentifiers);
        expect(seriesApiMetricsSpy).toBeCalledTimes(1);
        const seriesApiMetricsSeriesParam = seriesApiMetricsSpy.mock.calls[0][0].series!;
        expect(seriesApiMetricsSeriesParam).toEqual(requestedSeriesIdentifiers);
        // check that pending targets have populated metricValues inside endpoint grouped by time
        const expectedPopulatedValues: Dict<string, InstanceValuesSnapshot[]> = {
            'disk.dev.read': [
                {
                    timestampMs: 1599320691309.87,
                    values: [
                        {
                            instance: 0,
                            value: 72125,
                        },
                    ],
                },
                {
                    timestampMs: 1599320751310.403,
                    values: [
                        {
                            instance: 0,
                            value: 72835,
                        },
                    ],
                },
            ],
            'disk.dev.write': [
                {
                    timestampMs: 1599320691309.87,
                    values: [
                        {
                            instance: 0,
                            value: 5373,
                        },
                    ],
                },
                {
                    timestampMs: 1599320751310.403,
                    values: [
                        {
                            instance: 0,
                            value: 6870,
                        },
                    ],
                },
            ],
            bogus_metric: [],
        };
        expect(
            endpointMock.metrics.reduce((acc, cur) => {
                acc[cur.metadata.name] = cur.values;
                return acc;
            }, {} as Dict<string, InstanceValuesSnapshot[]>)
        ).toEqual(expectedPopulatedValues);
    });
});
