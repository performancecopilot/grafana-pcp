export class NetworkError extends Error {
    data: any;
    constructor(error: any) {
        let message = "Network error";
        if (error.err) {
            // XHR failed
            message = `Network error: Could not connect to ${error.err.config.url}, please check the datasource and pmproxy settings`;
        }
        else if (error.statusText) {
            // XHR succeed (if the Grafana proxy is used, it always succeeds)
            message = `HTTP Error ${error.status}: ${error.statusText}, please check the datasource and pmproxy settings`;
        }
        super(message);
        this.data = error.data; // other layers may inspect the data and throw a custom error message (e.g. insufficient permissions)
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
