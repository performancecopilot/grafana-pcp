import { EndpointRegistry } from './endpoint';

export default class Poller {

    constructor(private endpointRegistry: EndpointRegistry, poll_interval_ms: number) {
        setInterval(this.doPollAll.bind(this), poll_interval_ms)
    }

    doPollAll() {
        for (const endpoint of this.endpointRegistry.list()) {
            endpoint.cleanup();
            endpoint.poll();
        }
    }
}