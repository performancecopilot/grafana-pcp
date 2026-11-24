import { getLogger } from 'loglevel';
import { MetricNotFoundError } from '../../../../common/services/pmapi/types';
import { TargetState } from '../types';
import { Poller } from './poller';

describe('Poller', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it('logs only the metric name and target ID for missing metrics', () => {
        const warn = jest.spyOn(getLogger('poller'), 'warn').mockImplementation(() => {});
        const poller = new Poller({} as any, {} as any, {} as any);
        const target = {
            targetId: 'panel-1/A',
            state: TargetState.METRICS_AVAILABLE,
            query: { url: 'http://user:secret-password@pmproxy.internal:44322', expr: 'missing.metric' },
            metricNames: ['missing.metric'],
            errors: [] as any[],
        };

        poller.detectMissingMetrics({ targets: [target] } as any, ['missing.metric'], []);

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith('missing metric missing.metric for target panel-1/A');
        expect(JSON.stringify(warn.mock.calls)).not.toContain('secret-password');
        expect(target.state).toBe(TargetState.PENDING);
        expect(target.errors[0]).toBeInstanceOf(MetricNotFoundError);
        clearTimeout(poller.timer);
    });
});
