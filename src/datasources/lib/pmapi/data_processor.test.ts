import { grafana, pcp, poller } from '../specs/fixtures';
import { TargetFormat } from '../types';
import { processQueries } from './data_processor';

describe('data processor', () => {
    it('should create a dataframe and handle missing frames and backward counters', () => {
        const target = poller.target({ query: { expr: 'disk.dev.read' } });
        const dataQueryRequest = grafana.dataQueryRequest([target.query]); // request data between 10-20s

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
            Object {
              "fields": Array [
                Object {
                  "config": Object {},
                  "name": "Time",
                  "type": "time",
                  "values": Array [
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
                Object {
                  "config": Object {
                    "custom": Anything,
                    "displayNameFromDS": "",
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
                Object {
                  "config": Object {
                    "custom": Anything,
                    "displayNameFromDS": "",
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
                    1,
                    1,
                    null,
                    null,
                    1,
                    null,
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
        const dataQueryRequest = grafana.dataQueryRequest([targetA.query, targetB.query]);

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
            Object {
              "fields": Array [
                Object {
                  "config": Object {},
                  "name": "instance",
                  "type": "string",
                  "values": Array [
                    "Inst 0",
                    "Inst 1",
                  ],
                },
                Object {
                  "config": Object {
                    "custom": Anything,
                    "displayNameFromDS": "A",
                  },
                  "labels": Object {
                    "agent": "linux",
                    "hostname": "host1",
                  },
                  "name": "some.string.A",
                  "type": "string",
                  "values": Array [
                    "A/0/11000",
                    "A/1/11000",
                  ],
                },
                Object {
                  "config": Object {
                    "custom": Anything,
                    "displayNameFromDS": "B",
                  },
                  "labels": Object {
                    "agent": "linux",
                    "hostname": "host1",
                  },
                  "name": "some.string.B",
                  "type": "string",
                  "values": Array [
                    "B/0/11000",
                    "B/1/11000",
                  ],
                },
              ],
            }
        `
        );
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
        const dataQueryRequest = grafana.dataQueryRequest([target.query]);
        const result = processQueries(dataQueryRequest, [{ endpoint, query: target.query, metrics: [metric] }], 1);
        expect(result[0].fields).toMatchInlineSnapshot(`
            Array [
              Object {
                "config": Object {},
                "name": "col1",
                "type": "string",
                "values": Array [
                  "row1 col1",
                  "row2 col1",
                ],
              },
              Object {
                "config": Object {},
                "name": "col2",
                "type": "string",
                "values": Array [
                  "row1 col2",
                  "row2 col2",
                ],
              },
              Object {
                "config": Object {},
                "name": "col3",
                "type": "string",
                "values": Array [
                  "row1 col3",
                  "row2 col3",
                ],
              },
            ]
        `);
    });
});
