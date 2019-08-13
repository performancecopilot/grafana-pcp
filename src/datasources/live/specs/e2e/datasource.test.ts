import * as dateMock from 'jest-date-mock';
import HttpServerMock from '../../../lib/specs/lib/http_server_mock';
import { PCPLiveDatasource } from '../../datasource';
import queryTests from './query';
import datastoreTests from './datastore';
import formattingTests from './formatting';
import pollSrvTests from './poll_srv';
import queryEditorTests from './query_editor';

export interface TestContext {
    server: HttpServerMock;
    datasource: PCPLiveDatasource;
}

describe("PCP Live End-to-End", () => {
    const ctx: TestContext = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            url: 'http://localhost:44322',
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0
            }
        };
        ctx.server = new HttpServerMock(instanceSettings.url, false);
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

    describe("Query Capabilities", () => {
        queryTests(ctx);
    });

    describe("Datastore", () => {
        datastoreTests(ctx);
    });

    describe("Formatting", () => {
        formattingTests(ctx);
    });

    describe("PollSrv", () => {
        pollSrvTests(ctx);
    });

    describe("query editor", () => {
        queryEditorTests(ctx);
    });
});
