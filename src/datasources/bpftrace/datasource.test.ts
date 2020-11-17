import { PCPBPFtraceDataSource } from './datasource';
import { backendSrvMock, mockNextResponses } from 'datasources/lib/specs/mocks/backend_srv';
import { TargetFormat } from 'datasources/lib/types';
import { grafana, pmapi } from 'datasources/lib/specs/fixtures';
import { Semantics } from 'common/types/pcp';
import { advanceTo } from 'jest-date-mock';
import { setGlobalLogLevel } from 'common/utils';

jest.mock('@grafana/runtime', () => ({
    ...jest.requireActual<object>('@grafana/runtime'),
    getBackendSrv: () => backendSrvMock,
    getTemplateSrv: () => ({
        replace: (x: string) => x,
    }),
}));

describe('PCP BPFtrace', () => {
    let datasource: PCPBPFtraceDataSource;

    beforeEach(() => {
        jest.resetAllMocks();
        jest.useFakeTimers();
        advanceTo(20000);
        setGlobalLogLevel('DEBUG');

        const instanceSettings = {
            url: 'http://localhost:1234',
            jsonData: {},
        };
        datasource = new PCPBPFtraceDataSource(instanceSettings as any);
    });

    it('should register a script and return the data', async () => {
        const queries = [
            {
                refId: 'A',
                expr: '...cpuwalk...',
                format: TargetFormat.Heatmap,
            },
        ];

        let response = await datasource.query(grafana.dataQueryRequest(queries));
        expect(response).toEqual({ data: [] });

        mockNextResponses([
            pmapi.context(1),
            pmapi.context(2),
            pmapi.store(),
            scriptRegisterResponse,
            metricResponse,
            fetchResponse,
            indomResponse,
        ]);
        await datasource.poller.poll();

        // it's a counter metric, need another poll
        mockNextResponses([fetchResponse2]);
        await datasource.poller.poll();

        response = await datasource.query(grafana.dataQueryRequest(queries));
        expect({ fields: response.data[0].fields }).toMatchInlineSnapshot(
            {
                fields: [
                    { config: expect.anything() },
                    { config: expect.anything() },
                    { config: expect.anything() },
                    { config: expect.anything() },
                    { config: expect.anything() },
                    { config: expect.anything() },
                    { config: expect.anything() },
                    { config: expect.anything() },
                    { config: expect.anything() },
                ],
            },
            `
            Object {
              "fields": Array [
                Object {
                  "config": Anything,
                  "name": "Time",
                  "type": "time",
                  "values": Array [
                    10000,
                    11000,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[0-0]",
                  "type": "number",
                  "values": Array [
                    null,
                    7814,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[1-1]",
                  "type": "number",
                  "values": Array [
                    null,
                    7841,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[2-2]",
                  "type": "number",
                  "values": Array [
                    null,
                    7024,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[3-3]",
                  "type": "number",
                  "values": Array [
                    null,
                    6902,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[4-4]",
                  "type": "number",
                  "values": Array [
                    null,
                    6784,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[5-5]",
                  "type": "number",
                  "values": Array [
                    null,
                    7354,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[6-6]",
                  "type": "number",
                  "values": Array [
                    null,
                    6943,
                  ],
                },
                Object {
                  "config": Anything,
                  "labels": Object {
                    "agent": "bpftrace",
                    "domainname": "localdomain",
                    "hostname": "dev",
                    "machineid": "6dabb302d60b402dabcc13dc4fd0fab8",
                    "metrictype": "histogram",
                  },
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu[7-7]",
                  "type": "number",
                  "values": Array [
                    null,
                    6817,
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
                "params": Object {
                  "hostspec": "127.0.0.1",
                  "polltimeout": 30,
                },
                "url": "http://localhost:1234/pmapi/context",
              },
              Object {
                "params": Object {
                  "context": 2,
                  "name": "bpftrace.control.register",
                  "value": "...cpuwalk...",
                },
                "url": "http://localhost:1234/pmapi/store",
              },
              Object {
                "params": Object {
                  "context": 2,
                  "names": "bpftrace.control.register",
                },
                "url": "http://localhost:1234/pmapi/fetch",
              },
              Object {
                "params": Object {
                  "context": 1,
                  "names": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu",
                },
                "url": "http://localhost:1234/pmapi/metric",
              },
              Object {
                "params": Object {
                  "context": 1,
                  "names": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu,bpftrace.info.scripts_json",
                },
                "url": "http://localhost:1234/pmapi/fetch",
              },
              Object {
                "params": Object {
                  "context": 1,
                  "name": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu",
                },
                "url": "http://localhost:1234/pmapi/indom",
              },
              Object {
                "params": Object {
                  "context": 1,
                  "names": "bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu,bpftrace.info.scripts_json",
                },
                "url": "http://localhost:1234/pmapi/fetch",
              },
            ]
        `);
    });
});

const scriptRegisterResponse = {
    context: 2034847508,
    timestamp: 10.267776,
    values: [
        {
            pmid: '151.0.0',
            name: 'bpftrace.control.register',
            instances: [
                {
                    instance: null,
                    value: JSON.stringify({
                        script_id: 'sce2abad9ff87465582cfd5945b375205',
                        username: null,
                        persistent: false,
                        created_at: '2020-11-12T15:42:39.804277',
                        last_accessed_at: '2020-11-12T15:42:39.804284',
                        code:
                            '/*\n * cpuwalk\tSample which CPUs are executing processes.\n *\t\tFor Linux, uses bpftrace and eBPF.\n *\n * USAGE: cpuwalk.bt\n *\n * This is a bpftrace version of the DTraceToolkit tool of the same name.\n *\n * Copyright 2018 Netflix, Inc.\n * Licensed under the Apache License, Version 2.0 (the "License")\n *\n * 08-Sep-2018\tBrendan Gregg\tCreated this.\n */\n\nprofile:hz:99\n/pid/\n{\n\t@cpu = lhist(cpu, 0, 1000, 1);\n}',
                        metadata: {
                            name: null,
                            include: null,
                            table_retain_lines: null,
                            custom_output_block: false,
                        },
                        variables: {
                            '@cpu': { single: false, semantics: 1, datatype: 3, metrictype: 'histogram' },
                        },
                        state: { status: 'starting', pid: -1, exit_code: 0, error: '', probes: 0, data_bytes: 0 },
                    }),
                },
            ],
        },
    ],
};

const metricResponse = {
    metrics: [
        {
            name: 'bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu',
            series: '683ecb966ec0656df5e13e51a76185a6b693b36f',
            indom: '151.102010',
            type: 'u64',
            sem: Semantics.Counter,
            units: 'none',
            labels: {
                agent: 'bpftrace',
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
                metrictype: 'histogram',
            },
            'text-oneline': '@cpu variable of bpftrace script',
            'text-help': '@cpu variable of bpftrace script',
        },
    ],
};

const fetchResponse = {
    context: 214989420,
    timestamp: 10,
    values: [
        {
            pmid: '151.102.10',
            name: 'bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu',
            instances: [
                {
                    instance: 0,
                    value: 11708,
                },
                {
                    instance: 1,
                    value: 12355,
                },
                {
                    instance: 2,
                    value: 11248,
                },
                {
                    instance: 3,
                    value: 12238,
                },
                {
                    instance: 4,
                    value: 11633,
                },
                {
                    instance: 5,
                    value: 11468,
                },
                {
                    instance: 6,
                    value: 11464,
                },
                {
                    instance: 7,
                    value: 11103,
                },
            ],
        },
        {
            pmid: '151.1.1',
            name: 'bpftrace.info.scripts_json',
            instances: [
                {
                    instance: null,
                    value: JSON.stringify([
                        {
                            script_id: 'sce2abad9ff87465582cfd5945b375205',
                            username: null,
                            persistent: false,
                            created_at: '2020-11-12T15:42:39.804277',
                            last_accessed_at: '2020-11-12T15:42:39.804284',
                            code:
                                '/*\n * cpuwalk\tSample which CPUs are executing processes.\n *\t\tFor Linux, uses bpftrace and eBPF.\n *\n * USAGE: cpuwalk.bt\n *\n * This is a bpftrace version of the DTraceToolkit tool of the same name.\n *\n * Copyright 2018 Netflix, Inc.\n * Licensed under the Apache License, Version 2.0 (the "License")\n *\n * 08-Sep-2018\tBrendan Gregg\tCreated this.\n */\n\nprofile:hz:99\n/pid/\n{\n\t@cpu = lhist(cpu, 0, 1000, 1);\n}',
                            metadata: {
                                name: null,
                                include: null,
                                table_retain_lines: null,
                                custom_output_block: false,
                            },
                            variables: {
                                '@cpu': {
                                    single: false,
                                    semantics: 1,
                                    datatype: 3,
                                    metrictype: 'histogram',
                                },
                            },
                            state: {
                                status: 'started',
                                pid: 821919,
                                exit_code: 0,
                                error: '',
                                probes: 2,
                                data_bytes: 264974,
                            },
                        },
                    ]),
                },
            ],
        },
    ],
};

const indomResponse = {
    context: 1950686598,
    indom: '151.102010',
    labels: {
        domainname: 'localdomain',
        hostname: 'dev',
        machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
    },
    'text-oneline': '',
    'text-help': '',
    instances: [
        {
            instance: 6,
            name: '6-6',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        {
            instance: 5,
            name: '5-5',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        {
            instance: 2,
            name: '2-2',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        {
            instance: 0,
            name: '0-0',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        {
            instance: 4,
            name: '4-4',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        {
            instance: 3,
            name: '3-3',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        {
            instance: 7,
            name: '7-7',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
        {
            instance: 1,
            name: '1-1',
            labels: {
                domainname: 'localdomain',
                hostname: 'dev',
                machineid: '6dabb302d60b402dabcc13dc4fd0fab8',
            },
        },
    ],
};

const fetchResponse2 = {
    context: 1776350321,
    timestamp: 11,
    values: [
        {
            pmid: '151.102.10',
            name: 'bpftrace.scripts.sce2abad9ff87465582cfd5945b375205.data.cpu',
            instances: [
                {
                    instance: 0,
                    value: 19522,
                },
                {
                    instance: 1,
                    value: 20196,
                },
                {
                    instance: 2,
                    value: 18272,
                },
                {
                    instance: 3,
                    value: 19140,
                },
                {
                    instance: 4,
                    value: 18417,
                },
                {
                    instance: 5,
                    value: 18822,
                },
                {
                    instance: 6,
                    value: 18407,
                },
                {
                    instance: 7,
                    value: 17920,
                },
            ],
        },
        {
            pmid: '151.1.1',
            name: 'bpftrace.info.scripts_json',
            instances: [
                {
                    instance: null,
                    value: JSON.stringify([
                        {
                            script_id: 'sce2abad9ff87465582cfd5945b375205',
                            username: null,
                            persistent: false,
                            created_at: '2020-11-12T15:42:39.804277',
                            last_accessed_at: '2020-11-12T15:42:39.804284',
                            code:
                                '/*\n * cpuwalk\tSample which CPUs are executing processes.\n *\t\tFor Linux, uses bpftrace and eBPF.\n *\n * USAGE: cpuwalk.bt\n *\n * This is a bpftrace version of the DTraceToolkit tool of the same name.\n *\n * Copyright 2018 Netflix, Inc.\n * Licensed under the Apache License, Version 2.0 (the "License")\n *\n * 08-Sep-2018\tBrendan Gregg\tCreated this.\n */\n\nprofile:hz:99\n/pid/\n{\n\t@cpu = lhist(cpu, 0, 1000, 1);\n}',
                            metadata: {
                                name: null,
                                include: null,
                                table_retain_lines: null,
                                custom_output_block: false,
                            },
                            variables: {
                                '@cpu': {
                                    single: false,
                                    semantics: 1,
                                    datatype: 3,
                                    metrictype: 'histogram',
                                },
                            },
                            state: {
                                status: 'started',
                                pid: 821919,
                                exit_code: 0,
                                error: '',
                                probes: 2,
                                data_bytes: 447409,
                            },
                        },
                    ]),
                },
            ],
        },
    ],
};
