import { BackendSrvRequest } from '@grafana/runtime';
import { isString } from 'lodash';

interface FetchError {
    message: string;
    data: any;
}

interface GrafanaProxyError {
    status: number;
    statusText: string;
    data: any;
}

export class NetworkError extends Error {
    data: any; // other layers may inspect the data and throw a custom error message (e.g. insufficient permissions)
    error: any;

    constructor(error: FetchError | GrafanaProxyError | string, request: BackendSrvRequest) {
        let message = 'Network error';
        if (isString(error)) {
            message = error;
        }
        else if ("message" in error) {
            // Browser mode, Fetch() failed
            message = `${error.message} Please check the datasource and pmproxy settings.`;
        } else if ("statusText" in error) {
            // Proxy mode, Fetch() succeed (if the Grafana proxy is used, it always succeeds)
            message = `HTTP Error ${error.status}: ${error.statusText}, please check the datasource and pmproxy settings.`;
        }

        if (request) {
            const params = request.params ? '?' + new URLSearchParams(request.params) : "";
            message += ` Request: ${request.url}${params}`;
        }
        super(message);

        this.error = error;
        if (!isString(error) && "data" in error)
            this.data = error.data;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
