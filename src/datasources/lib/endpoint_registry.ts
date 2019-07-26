import Context from "./context";
import DataStore from "./datastore";
import Poller from './poller';

export interface Endpoint {
    id: string;
    context: Context;
    poller: Poller;
    datastore: DataStore;
}

export default class EndpointRegistry<T extends Endpoint> {
    private endpoints: Record<string, T> = {};

    private generateId(url: string, container?: string) {
        if (!container)
            container = "";
        return `${url}::${container}`;
    }

    find(url: string, container?: string) {
        const id = this.generateId(url, container);
        return this.endpoints[id];
    }

    create(url: string, container: string | undefined, keepPollingMs: number, localHistoryAgeMs: number) {
        const id = this.generateId(url, container);
        const context = new Context(url, container);
        const datastore = new DataStore(context, localHistoryAgeMs);
        const poller = new Poller(context, datastore, keepPollingMs);

        this.endpoints[id] = { id, context, datastore, poller } as T;
        return this.endpoints[id];
    }

    list() {
        return Object.values(this.endpoints);
    }

}