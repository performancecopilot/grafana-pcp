import { DataSource } from './datasource';
import { VectorOptions, VectorTargetData } from './types';
import { DataSourceInstanceSettings } from '@grafana/data';
import { Target } from '../lib/poller';

jest.mock('../lib/poller');
jest.mock('../lib/pmapi');

describe('PCP Vector datasource', () => {
    let instanceSettingsMock: jest.Mocked<DataSourceInstanceSettings<VectorOptions>>;
    let instance: DataSource;
    beforeEach(() => {
        // mocking only relevant properties
        instanceSettingsMock = {
            url: '/api/datasources/proxy/2',
            jsonData: {
                hostspec: '127.0.0.1',
                retentionTime: '10m',
            },
        } as any;
        instance = new DataSource(instanceSettingsMock);
    });

    // anything thats not a metric name
    it('shouble be able to detect derived metric formulas', () => {
        const metrics = ['statsd.pmda.received', 'statsd.pmda', 'statsd', 'statsd_pmda', 'statsd_pmda_received'];
        metrics.forEach(metric => expect(instance.isDerivedMetric(metric)).toBe(false));
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
        formulas.forEach(formula => expect(instance.isDerivedMetric(formula)).toBe(true));
        // empty string, should it ever be passed, is going to be interpreted as derived metric
        const edgeCase = '';
        expect(instance.isDerivedMetric(edgeCase)).toBe(true);
    });

    it('should be able to build derived metric name', () => {
        const formulas = [
            'disk.all.blktotal/disk.all.total',
            'network.interface.in.bytes[eth1]',
            'disk.all.blktotal/2',
            'disk.all.blktotal+2',
        ];
        const names = formulas.map(formula => {
            const name = instance.derivedMetricName(formula);
            expect(name).toContain('derived_');
            return name;
        });
        expect(new Set(names).size).toBe(names.length);
    });

    it('should be able to create derived metric and store information about it', async () => {
        const spy = jest
            .spyOn(instance.state.pmApi, 'createDerived')
            .mockImplementation(() => Promise.resolve({ success: true }));
        const expr = 'disk.all.blktotal/2';
        const targetMock: jest.Mocked<Target<VectorTargetData>> = { query: { expr } } as any;
        await instance.registerDerivedMetric(targetMock);
        expect(spy).toBeCalledTimes(1);
        expect(spy.mock.calls[0][2]).toBe(instance.derivedMetricName(expr));
        expect(instance.state.derivedMetrics.has(expr)).toBe(true);
    });

    it('should request context renewal on registration of derived metric', async () => {
        const expr = 'disk.all.blktotal/2';
        const metricName = instance.derivedMetricName(expr);
        const createDerivedSpy = jest
            .spyOn(instance.state.pmApi, 'createDerived')
            .mockImplementation(() => Promise.resolve({ success: true }));
        const registerDeriverMetricSpy = jest.spyOn(instance, 'registerDerivedMetric');
        const targetMock: jest.Mocked<Target<VectorTargetData>> = { query: { expr } } as any;
        const resultRegistered = await instance.registerTarget(targetMock);
        expect(resultRegistered).toEqual({ metrics: [metricName], renewContext: true });
        expect(createDerivedSpy).toBeCalledTimes(1);
        expect(registerDeriverMetricSpy).toBeCalledTimes(1);
        expect(instance.state.derivedMetrics.size).toBe(1);
        expect(instance.state.derivedMetrics.has(expr)).toBe(true);
        // will skip registering derived metric, since we already did so
        const resultRegistrationSkipped = await instance.registerTarget(targetMock);
        expect(resultRegistrationSkipped).toEqual({ metrics: [metricName] });
        expect(createDerivedSpy).toBeCalledTimes(1);
        expect(registerDeriverMetricSpy).toBeCalledTimes(1);
        expect(instance.state.derivedMetrics.size).toBe(1);
        expect(instance.state.derivedMetrics.has(expr)).toBe(true);
    });
});
