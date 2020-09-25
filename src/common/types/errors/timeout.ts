export class TimeoutError extends Error {
    constructor(message?: string) {
        super(message ?? 'Request timeout.');
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
