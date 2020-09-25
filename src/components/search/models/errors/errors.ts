export class PluginInitError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'PluginInitError';
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
