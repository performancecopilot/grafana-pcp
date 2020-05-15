import { isString } from "lodash";

export class NetworkError extends Error {
    data: any;

    constructor(error: any) {
        let message = "Network error";
        if (error.message) {
            // Fetch failed
            message = `${error.message} Please check the datasource and pmproxy settings`;
        }
        else if (error.statusText) {
            // XHR succeed (if the Grafana proxy is used, it always succeeds)
            message = `HTTP Error ${error.status}: ${error.statusText}, please check the datasource and pmproxy settings`;
        }
        else if (isString(error))
            message = error;
        super(message);

        this.data = error.data; // other layers may inspect the data and throw a custom error message (e.g. insufficient permissions)
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
