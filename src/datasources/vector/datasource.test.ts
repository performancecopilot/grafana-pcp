import { advanceTo } from 'jest-date-mock';
import { PCPVectorDataSource } from './datasource';
import { VectorTargetData } from './types';
import { Target } from 'datasources/lib/pmapi/types';
import { Endpoint } from 'datasources/lib/pmapi/poller/types';
import { backendSrvMock, mockNextResponses } from 'datasources/lib/specs/mocks/backend_srv';
import { TargetFormat } from 'datasources/lib/types';
import { grafana, pcp, pmapi, pmseries, poller } from 'datasources/lib/specs/fixtures';
import { setGlobalLogLevel } from 'common/utils';

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
        const targets = [{ refId: 'A', expr: 'disk.dev.read', format: TargetFormat.TimeSeries }];

        let response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(),
            pmseries.ping(false),
            pmapi.metric(['disk.dev.read']),
            pmapi.fetchDiskDevRead(10, 100, 0),
            pmapi.indom('disk.dev.read'),
        ]);
        await datasource.poller.poll();

        mockNextResponses([pmapi.fetchDiskDevRead(11, 200, 0)]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(targets));
        expect(response).toMatchSnapshot();

        expect(backendSrvMock.fetch.mock.calls).toMatchSnapshot();
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
        const spy = jest.spyOn(datasource.pmApiService, 'derive');
        const expr = 'disk.all.blktotal/2';
        const targetMock: jest.Mocked<Target<VectorTargetData>> = { query: { expr } } as any;
        const endpointMock: jest.Mocked<Endpoint> = { context: { context: 0 } } as any;
        mockNextResponses([pmapi.derive()]);
        await datasource.registerDerivedMetric(targetMock, endpointMock);

        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0][1]).toMatchObject({ name: datasource.derivedMetricName(expr) });
        expect(datasource.derivedMetrics.has(expr)).toBe(true);
    });

    it('should request registration of derived metric', async () => {
        const expr = 'disk.all.blktotal/2';
        const metricName = datasource.derivedMetricName(expr);
        const createDerivedSpy = jest.spyOn(datasource.pmApiService, 'derive');
        const registerDeriverMetricSpy = jest.spyOn(datasource, 'registerDerivedMetric');
        const targetMock: jest.Mocked<Target<VectorTargetData>> = { query: { expr } } as any;
        const endpointMock: jest.Mocked<Endpoint> = { context: { context: 0 } } as any;

        mockNextResponses([pmapi.derive()]);
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
        expect(backendSrvMock.fetch.mock.calls).toMatchSnapshot();
    });
});
