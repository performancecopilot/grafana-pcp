import { PmapiSrv, Context } from "./services/pmapi_srv";
import DataStore from "./datastore";
import PollSrv from './services/poll_srv';
import { DatasourceRequestFn } from "./models/datasource";

export interface Endpoint {
    id: string;
    pmapiSrv: PmapiSrv;
    pollSrv: PollSrv;
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

    create(datasourceRequest: DatasourceRequestFn, url: string, container: string | undefined, keepPollingMs: number, localHistoryAgeMs: number) {
        const id = this.generateId(url, container);
        const pmapiSrv = new PmapiSrv(new Context(datasourceRequest, url, container));
        const datastore = new DataStore(pmapiSrv, localHistoryAgeMs);
        const pollSrv = new PollSrv(pmapiSrv, datastore, keepPollingMs);

        this.endpoints[id] = { id, pmapiSrv, datastore, pollSrv } as T;
        return this.endpoints[id];
    }

    list() {
        return Object.values(this.endpoints);
    }

}
