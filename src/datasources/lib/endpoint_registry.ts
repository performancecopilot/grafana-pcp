import Context from "./context";
import DataStore from "./datastore";
import Poller from './poller';

export interface Endpoint {
    context: Context;
    poller: Poller;
    datastore: DataStore;
}

export default class EndpointRegistry<T extends Endpoint> {
    private endpoints: Record<string, T> = {};

    private generateId(url: string, container: string | null = null) {
        return `${url}::${container}`;
    }

    find(url: string, container: string | null = null) {
        const id = this.generateId(url, container);
        return this.endpoints[id];
    }

    create(url: string, container: string | null, keepPollingMs: number, oldestDataMs: number) {
        const id = this.generateId(url, container);
        const context = new Context(url, container);
        const datastore = new DataStore(context, oldestDataMs);
        const poller = new Poller(context, datastore, keepPollingMs);

        this.endpoints[id] = { context, datastore, poller } as T;
        return this.endpoints[id];
    }

    list() {
        return Object.values(this.endpoints);
    }

}