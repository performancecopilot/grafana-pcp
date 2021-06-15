import { FieldType, MutableDataFrame } from '@grafana/data';
import { Semantics } from '../../../common/types/pcp';
import { pmapiQuery } from '../specs/fixtures/datasource';
import { TargetFormat } from '../types';
import { applyFieldTransformations } from './field_transformations';

describe('field transformations', () => {
    it('should convert time based counters to time utilization', () => {
        const frame = new MutableDataFrame();
        frame.addField({ name: 'Time', type: FieldType.time, values: [2000, 4000, 6000] });
        // first rate:  1,000,000us = 1.0s per sec = CPU was busy 100%
        // second rate:   500,000us = 0.5s per sec = CPU was busy 50%
        frame.addField({ name: 'cgroup.cpu.stat.usage', type: FieldType.number, values: [1000000, 3000000, 4000000] });

        const metadata = {
            name: 'cgroup.cpu.stat.usage',
            series: 'e750369c34fccb1f9c62554dcb9051ff5749b529',
            pmid: '3.67.2',
            indom: '3.16',
            type: 'u64',
            sem: Semantics.Counter,
            units: 'microsec',
            labels: {
                agent: 'proc',
                domainname: 'localdomain',
                hostname: 'agerstmayr-thinkpad',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
            'text-oneline': 'CPU time consumed by processes in each cgroup',
            'text-help': 'CPU time consumed by processes in each cgroup',
        };
        applyFieldTransformations(pmapiQuery({ format: TargetFormat.TimeSeries }), metadata, frame);
        expect(frame).toMatchInlineSnapshot(`
            Object {
              "fields": Array [
                Object {
                  "config": Object {},
                  "labels": undefined,
                  "name": "Time",
                  "type": "time",
                  "values": Array [
                    2000,
                    4000,
                    6000,
                  ],
                },
                Object {
                  "config": Object {
                    "unit": "percentunit",
                  },
                  "labels": undefined,
                  "name": "cgroup.cpu.stat.usage",
                  "type": "number",
                  "values": Array [
                    undefined,
                    1,
                    0.5,
                  ],
                },
              ],
              "meta": undefined,
              "name": undefined,
              "refId": undefined,
            }
        `);
    });
});
