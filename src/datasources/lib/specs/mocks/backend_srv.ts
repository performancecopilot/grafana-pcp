import { getLogger } from 'loglevel';
import { of } from 'rxjs';
import { BackendSrv } from '@grafana/runtime';
import * as grafana from '../../../../datasources/lib/specs/fixtures/grafana';

const backendSrvMockLogger = getLogger('backendSrvMock');
export const backendSrvMock: jest.Mocked<BackendSrv> = {
    fetch: jest.fn(),
} as any;

export function mockNextResponse<T>(response: T) {
    backendSrvMock.fetch.mockImplementationOnce(request => {
        backendSrvMockLogger.debug('fetch', {
            request: {
                url: request.url,
                params: request.params,
            },
            response: JSON.stringify(response),
        });
        return of(grafana.response(response));
    });
}

export function mockNextResponses(responses: any[]) {
    for (const response of responses) {
        mockNextResponse(response);
    }
}
