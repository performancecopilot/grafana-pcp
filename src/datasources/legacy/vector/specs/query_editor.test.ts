import * as dateMock from 'jest-date-mock';
import HttpServerMock from "../../lib/specs/lib/http_server_mock";
import { PCPVectorDatasource } from "../datasource";
import { templateSrv } from "../../lib/specs/lib/template_srv_mock";

describe("PCP Vector e2e: Query Editor", () => {
    const ctx: { server: HttpServerMock, datasource: PCPVectorDatasource } = {} as any;

    beforeEach(() => {
        const instanceSettings = {
            url: 'http://localhost:44322',
            jsonData: {
                pollIntervalMs: 0,
                scriptSyncIntervalMs: 0,
                inactivityTimeoutMs: '20s',
                localHistoryAge: '5m'
            }
        };
        ctx.server = new HttpServerMock(instanceSettings.url, false);
        const backendSrv = {
            datasourceRequest: ctx.server.doRequest.bind(ctx.server)
        };
        ctx.datasource = new PCPVectorDatasource(instanceSettings, backendSrv, templateSrv);
        dateMock.advanceTo(20000); // simulate unixtime of 20s (since Jan 1, 1970 UTC)
    });

    afterEach(() => {
        expect(ctx.server.responsesSize()).toBe(0);
    });

    it.skip("handle templating in expression, url, and container", async () => {
    });

    it.skip("auto-complete metrics", async () => {
    });

    it.skip("suggest container names", async () => {
    });
});
