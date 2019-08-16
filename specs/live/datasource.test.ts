
import { Query } from '../../src/datasources/lib/types';
import HttpServer from '../http_server';
import { PCPLiveDatasource } from '../../src/datasources/live/datasource';
import * as dateMock from 'jest-date-mock';
import PmProxy from '../pmapi/pmproxy';
import queryTests from './features/query';
import datastoreTests from './features/datastore';
import formattingTests from './features/formatting';
import pollerTests from './features/poller';
import queryEditorTests from './features/query_editor';

export interface TestContext {
    defaultQuery: Query;
    server: HttpServer;
    datasource: PCPLiveDatasource;
}

describe("Live DataSource", () => {
    const ctx: TestContext = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            url: 'http://localhost:44322',
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0
            }
        };
        ctx.defaultQuery = {
            scopedVars: {},
            timezone: "",
            interval: "1s",
            intervalMs: 1000,
            maxDataPoints: 100,
            range: {
                from: new Date(0),
                to: new Date(20000)
            },
            targets: []
        };

        ctx.server = new HttpServer(instanceSettings.url, false);
        const backendSrv = {
            datasourceRequest: ctx.server.doRequest.bind(ctx.server)
        };
        const templateSrv = {
            replace: (str: string, vars: any) => {
                for (const var_ in vars)
                    str = str.replace('$' + var_, vars[var_].value);
                return str;
            }
        };
        const variableSrv = {
        };
        ctx.datasource = new PCPLiveDatasource(instanceSettings, backendSrv, templateSrv, variableSrv);
        dateMock.advanceTo(20000); // simulate unixtime of 20s (since Jan 1, 1970 UTC)
    });

    afterEach(() => {
        expect(ctx.server.responsesSize()).toBe(0);
    });

    for (const backend of [new PmProxy()]) {
        describe(`using ${backend.constructor.name} backend`, () => {
            describe("query capabilities", () => {
                queryTests(ctx, backend);
            });

            describe("datastore", () => {
                datastoreTests(ctx, backend);
            });

            describe("formatting", () => {
                formattingTests(ctx, backend);
            });

            describe("poller", () => {
                pollerTests(ctx, backend);
            });

            describe("query editor", () => {
                queryEditorTests(ctx, backend);
            });
        });
    }
});
