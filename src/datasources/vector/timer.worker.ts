const webWorker: Worker = self as any;
let timer: number;

// dummy web worker to wake up main thread
// otherwise JavaScript execution of the main thread is stopped if the tab is inactive
// https://github.com/Netflix/vector/blob/master/src/app/components/Pollers/DatasetPollerTimer.js
webWorker.addEventListener('message', (event) => {
    const interval = event && event.data && event.data.interval;

    if (!interval) {
        console.warn('invalid interval received:', event.data);
        return;
    }

    if (timer) {
        clearInterval(timer)
    }

    console.debug(`adjust timer to ${interval}`);
    timer = setInterval(() => webWorker.postMessage({}), interval);
}, false);

// required for unit tests
export default class NodejsWorker extends Worker {
    constructor() {
        super("");
    }
}
