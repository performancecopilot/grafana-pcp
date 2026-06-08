import { MISSING_VALUE } from '@grafana/data';
import { grafana, pcp, poller } from '../specs/fixtures';
import { TargetFormat } from '../types';
import { processQueries } from './data_processor';

describe('data processor', () => {
    it('should create a dataframe and handle missing frames and backward counters', () => {
        const target = poller.target({ query: { expr: 'disk.dev.read' } });
        const dataQueryRequest = grafana.dataQueryRequest({ targets: [target.query] }); // request data between 10-20s

        const values = [
            {
                timestampMs: 7000, // out of range
                values: [
                    { instance: 0, value: 7 },
                    { instance: 1, value: 5 },
                ],
            },
            {
                timestampMs: 8000, // request 1 value more to fill the graph
                values: [
                    { instance: 0, value: 8 },
                    { instance: 1, value: 5 },
                ],
            },
            {
                timestampMs: 9000, // request 1 value more because of counter metric
                values: [
                    { instance: 0, value: 9 },
                    { instance: 1, value: 5 },
                ],
            },
            {
                timestampMs: 10000,
                values: [
                    { instance: 0, value: 10 },
                    { instance: 1, value: 6 },
                ],
            },
            {
                timestampMs: 11000,
                values: [
                    { instance: 0, value: 13 },
                    { instance: 1, value: 7 },
                ],
            },
            {
                timestampMs: 12000,
                values: [
                    { instance: 0, value: 14 },
                    // instance 1 missing
                ],
            },
            {
                timestampMs: 13000,
                values: [
                    { instance: 0, value: 15 },
                    { instance: 1, value: 8 },
                ],
            },
            {
                timestampMs: 14000,
                values: [
                    { instance: 0, value: 16 },
                    { instance: 1, value: 9 },
                ],
            },
            {
                timestampMs: 15000,
                values: [
                    { instance: 0, value: 18 },
                    { instance: 1, value: 8 }, // counter went backwards
                ],
            },
            {
                timestampMs: 16000,
                values: [
                    { instance: 0, value: 19 },
                    { instance: 1, value: 9 },
                ],
            },
            {
                timestampMs: 17000,
                values: [
                    { instance: 0, value: 20 },
                    { instance: 1, value: 10 },
                ],
            },
            {
                timestampMs: 21000, // request 1 value more to fill the graph
                values: [
                    { instance: 0, value: 21 },
                    { instance: 1, value: 11 },
                ],
            },
            {
                timestampMs: 22000, // out of range
                values: [
                    { instance: 0, value: 22 },
                    { instance: 1, value: 12 },
                ],
            },
        ];
        const metric = {
            ...pcp.metrics['disk.dev.read'],
            values,
        };
        const endpoint = poller.endpoint({ metrics: [metric], targets: [target] });

        const result = processQueries(dataQueryRequest, [{ endpoint, query: target.query, metrics: [metric] }], 1);
        expect({ fields: result[0].fields }).toMatchInlineSnapshot(
            {
                fields: [{}, { config: { custom: expect.anything() } }, { config: { custom: expect.anything() } }],
            },
            `
            {
              "fields": [
                {
                  "config": {},
                  "name": "Time",
                  "type": "time",
                  "values": [
                    8000,
                    9000,
                    10000,
                    11000,
                    12000,
                    13000,
                    14000,
                    15000,
                    16000,
                    17000,
                    21000,
                  ],
                },
                {
                  "config": {
                    "custom": Anything,
                    "displayNameFromDS": "",
                  },
                  "labels": {
                    "agent": "linux",
                    "device_type": "block",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "indom_name": "per disk",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                  },
                  "name": "disk.dev.read[nvme0n1]",
                  "type": "number",
                  "values": [
                    undefined,
                    1,
                    1,
                    3,
                    1,
                    1,
                    1,
                    2,
                    1,
                    1,
                    0.25,
                  ],
                },
                {
                  "config": {
                    "custom": Anything,
                    "displayNameFromDS": "",
                  },
                  "labels": {
                    "agent": "linux",
                    "device_type": "block",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "indom_name": "per disk",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                  },
                  "name": "disk.dev.read[sda]",
                  "type": "number",
                  "values": [
                    undefined,
                    0,
                    1,
                    1,
                    undefined,
                    undefined,
                    1,
                    undefined,
                    1,
                    1,
                    0.25,
                  ],
                },
              ],
            }
        `
        );
    });

    it('should process a metrics table', () => {
        const targetA = poller.target({
            query: { expr: 'some.string.A', refId: 'A', format: TargetFormat.MetricsTable },
        });
        const targetB = poller.target({
            query: { expr: 'some.string.B', refId: 'B', format: TargetFormat.MetricsTable },
        });

        const metricA = {
            metadata: pcp.metadata({
                name: 'some.string.A',
                type: 'string',
                units: 'none',
            }),
            values: [
                {
                    timestampMs: 10000,
                    values: [
                        { instance: 0, value: 'A/0/10000' },
                        { instance: 1, value: 'A/1/10000' },
                    ],
                },
                {
                    timestampMs: 11000,
                    values: [
                        { instance: 0, value: 'A/0/11000' },
                        { instance: 1, value: 'A/1/11000' },
                    ],
                },
            ],
            instanceDomain: {
                instances: {
                    0: { name: 'Inst 0', instance: 0, labels: {} },
                    1: { name: 'Inst 1', instance: 1, labels: {} },
                },
                labels: {},
            },
        };
        const metricB = {
            metadata: pcp.metadata({
                name: 'some.string.B',
                type: 'string',
                units: 'none',
            }),
            values: [
                {
                    timestampMs: 10000,
                    values: [
                        { instance: 0, value: 'B/0/10000' },
                        { instance: 1, value: 'B/1/10000' },
                    ],
                },
                {
                    timestampMs: 11000,
                    values: [
                        { instance: 0, value: 'B/0/11000' },
                        { instance: 1, value: 'B/1/11000' },
                    ],
                },
            ],
            instanceDomain: {
                instances: {
                    0: { name: 'Inst 0', instance: 0, labels: {} },
                    1: { name: 'Inst 1', instance: 1, labels: {} },
                },
                labels: {},
            },
        };

        const endpoint = poller.endpoint({ metrics: [metricA, metricB], targets: [targetA, targetB] });
        const dataQueryRequest = grafana.dataQueryRequest({ targets: [targetA.query, targetB.query] });

        const result = processQueries(
            dataQueryRequest,
            [
                { endpoint, query: targetA.query, metrics: [metricA] },
                { endpoint, query: targetB.query, metrics: [metricB] },
            ],
            1
        );
        expect({ fields: result[0].fields }).toMatchInlineSnapshot(
            { fields: [{}, { config: { custom: expect.anything() } }, { config: { custom: expect.anything() } }] },
            `
            {
              "fields": [
                {
                  "config": {},
                  "name": "instance",
                  "type": "string",
                  "values": [
                    "Inst 0",
                    "Inst 1",
                  ],
                },
                {
                  "config": {
                    "custom": Anything,
                    "displayNameFromDS": "A",
                  },
                  "labels": {
                    "agent": "linux",
                    "hostname": "host1",
                  },
                  "name": "some.string.A",
                  "type": "string",
                  "values": [
                    "A/0/11000",
                    "A/1/11000",
                  ],
                },
                {
                  "config": {
                    "custom": Anything,
                    "displayNameFromDS": "B",
                  },
                  "labels": {
                    "agent": "linux",
                    "hostname": "host1",
                  },
                  "name": "some.string.B",
                  "type": "string",
                  "values": [
                    "B/0/11000",
                    "B/1/11000",
                  ],
                },
              ],
            }
        `
        );
    });

    it('should transform to Grafana flamegraph nested set format', () => {
        const target = poller.target({
            query: { expr: 'bpftrace.scripts.test.data.root', refId: 'A', format: TargetFormat.FlameGraph },
        });

        const metric = {
            metadata: pcp.metadata({
                name: 'bpftrace.scripts.test.data.root',
                type: 'u64',
                sem: 'instant' as any,
                units: 'count',
            }),
            values: [
                {
                    timestampMs: 10000,
                    values: [
                        { instance: 0, value: 5 },
                        { instance: 1, value: 3 },
                        { instance: 2, value: 4 },
                    ],
                },
            ],
            instanceDomain: {
                instances: {
                    0: { instance: 0, name: '\n    write+24\n    do_syscall_64\n', labels: {} },
                    1: { instance: 1, name: '\n    read+24\n    do_syscall_64\n', labels: {} },
                    2: { instance: 2, name: '\n    write+24\n    __x64_sys_write\n', labels: {} },
                },
                labels: {},
            },
        };

        const endpoint = poller.endpoint({ metrics: [metric], targets: [target] });
        const dataQueryRequest = grafana.dataQueryRequest({ targets: [target.query] });

        const result = processQueries(dataQueryRequest, [{ endpoint, query: target.query, metrics: [metric] }], 1);
        expect(result).toHaveLength(1);

        const frame = result[0];
        expect(frame.meta?.preferredVisualisationType).toBe('flamegraph');
        expect(frame.fields).toHaveLength(4);

        const levels = frame.fields[0].values;
        const labels = frame.fields[1].values;
        const values = frame.fields[2].values;
        const selfs = frame.fields[3].values;

        expect(labels[0]).toBe('root');
        expect(levels[0]).toBe(0);
        expect(values[0]).toBe(12); // 5 + 3 + 4
        expect(selfs[0]).toBe(0);

        // write+24 appears under two parents (do_syscall_64 and __x64_sys_write)
        // but at level 1 there should be write+24 with cumulative value 9 (5+4), read+24 with 3
        const level1Labels = labels.filter((_: string, i: number) => levels[i] === 1);
        expect(level1Labels).toContain('write+24');
        expect(level1Labels).toContain('read+24');
    });

    it('should apply flamegraph filtering options', () => {
        const target = poller.target({
            query: {
                expr: 'bpftrace.scripts.test.data.root',
                refId: 'A',
                format: TargetFormat.FlameGraph,
                flamegraphMinSamples: 4,
                flamegraphHideUnresolved: true,
                flamegraphHideIdle: false,
            } as any,
        });

        const metric = {
            metadata: pcp.metadata({
                name: 'bpftrace.scripts.test.data.root',
                type: 'u64',
                sem: 'instant' as any,
                units: 'count',
            }),
            values: [
                {
                    timestampMs: 10000,
                    values: [
                        { instance: 0, value: 5 },
                        { instance: 1, value: 2 },
                        { instance: 2, value: 6 },
                    ],
                },
            ],
            instanceDomain: {
                instances: {
                    0: { instance: 0, name: '\n    write+24\n', labels: {} },
                    1: { instance: 1, name: '\n    read+24\n', labels: {} },
                    2: { instance: 2, name: '\n    0xdeadbeef\n    write+24\n', labels: {} },
                },
                labels: {},
            },
        };

        const endpoint = poller.endpoint({ metrics: [metric], targets: [target] });
        const dataQueryRequest = grafana.dataQueryRequest({ targets: [target.query] });

        const result = processQueries(dataQueryRequest, [{ endpoint, query: target.query, metrics: [metric] }], 1);
        const labels = result[0].fields[1].values;
        const values = result[0].fields[2].values;

        // read+24 has value 2, below minSamples of 4 — should be filtered out
        expect(labels).not.toContain('read+24');
        // 0xdeadbeef should be filtered out (hideUnresolved)
        expect(labels).not.toContain('0xdeadbeef');
        // write+24 should still appear — instance 2's 0xdeadbeef is skipped, leaving write+24 as the leaf
        // both instances (5 + 6) accumulate at the same node
        expect(labels).toContain('write+24');
        const writeIdx = labels.indexOf('write+24');
        expect(values[writeIdx]).toBe(11);
    });

    it('should process a CSV table', () => {
        const target = poller.target({
            query: { expr: 'some.string', refId: 'A', format: TargetFormat.CsvTable },
        });
        const metric = {
            metadata: pcp.metadata({
                name: 'some.string',
                type: 'string',
                units: 'none',
            }),
            values: [
                {
                    timestampMs: 10000,
                    values: [{ instance: null, value: 'a,b,c' }],
                },
                {
                    timestampMs: 11000,
                    values: [
                        {
                            instance: null,
                            value:
                                'col1,col2,col3\n' +
                                'row1 col1,row1 col2,row1 col3\n' +
                                'row2 col1,row2 col2,row2 col3',
                        },
                    ],
                },
            ],
        };

        const endpoint = poller.endpoint({ metrics: [metric], targets: [target] });
        const dataQueryRequest = grafana.dataQueryRequest({ targets: [target.query] });
        const result = processQueries(dataQueryRequest, [{ endpoint, query: target.query, metrics: [metric] }], 1);
        expect(result[0].fields).toMatchInlineSnapshot(`
            [
              {
                "config": {},
                "name": "col1",
                "type": "string",
                "values": [
                  "row1 col1",
                  "row2 col1",
                ],
              },
              {
                "config": {},
                "name": "col2",
                "type": "string",
                "values": [
                  "row1 col2",
                  "row2 col2",
                ],
              },
              {
                "config": {},
                "name": "col3",
                "type": "string",
                "values": [
                  "row1 col3",
                  "row2 col3",
                ],
              },
            ]
        `);
    });
});
