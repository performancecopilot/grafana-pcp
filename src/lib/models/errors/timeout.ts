export class TimeoutError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'TimeoutError';
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
