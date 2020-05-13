import Poller from './poller';

const html5Worker: Worker = self as any;
new Poller(html5Worker);

// required for unit tests
export default class NodejsWorker extends Worker {
    constructor() {
        super("");
    }
}
