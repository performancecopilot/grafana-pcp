import { toDataFrame } from '../data_processor';
import fixtures from './lib/fixtures';
import { MISSING_VALUE } from '@grafana/data';

describe('data processor', () => {
    it('should create a dataframe', () => {
        fixtures.grafana.dataFrameRequest;

        const result = toDataFrame(
            fixtures.grafana.dataFrameRequest,
            fixtures.poller.queryResult as any,
            fixtures.poller.metricIndom,
            0
        );
        expect(result).toMatchObject({
            fields: [
                {
                    name: 'Time',
                    values: { buffer: [0, 1000, 2000, 3000] },
                },
                {
                    name: 'metric.indom[inst0]',
                    values: { buffer: [0, 1000, 2000, 3000] },
                },
                {
                    name: 'metric.indom[inst1]',
                    values: { buffer: [1, 1001, 2001, 3001] },
                },
                {
                    name: 'metric.indom[inst2]',
                    values: { buffer: [MISSING_VALUE, 1002, MISSING_VALUE, 3002] },
                },
            ],
        });
    });
});
