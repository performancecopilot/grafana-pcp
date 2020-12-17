import { has } from 'lodash';

export class GenericError extends Error {
    err?: GenericError;

    constructor(message: string, err?: GenericError) {
        super(message);
        this.err = err;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

interface FetchError {
    config: any;
    data: any;
    status: number;
    statusText: string;
}

export class NetworkError extends GenericError {
    data?: { message?: string };

    constructor(error: TypeError | FetchError) {
        let message;

        /**
         * error has the following attributes:
         * mode      with server response       without server response
         * browser   status, statusText, data   message, data: {message: 'unexpected error'}
         * proxy     status, statusText, data   status, statusText, data: {error, response, message: 'Bad Gateway'}
         */

        if (error instanceof TypeError) {
            // browser mode, no server response
            message = `Network Error: ${error.message}`;
        } else if (error.status === 502) {
            // most likely proxy mode, no server response
            // could also be pmproxy returning 502, but unlikely
            message = `Network Error: ${error.statusText}`;
        } else if (has(error, 'data.message')) {
            // pmproxy returned an error message
            message = error.data.message;
        } else {
            // pmproxy didn't return an error message
            message = `HTTP Error ${error.status}: ${error.statusText}`;
        }

        super(message);
        if ('data' in error) {
            this.data = error.data;
        }
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
