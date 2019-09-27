import { PmapiQueryTarget } from "./models/datasource";

interface ObservedTarget<EP> {
    target: PmapiQueryTarget<EP>;
    lastActive: number;
}

export default class DashboardObserver<EP> {

    private targets: Record<string, ObservedTarget<EP>> = {};
    onTargetUpdate: (prevValue: PmapiQueryTarget<EP>, newValue: PmapiQueryTarget<EP>) => Promise<void>;
    onTargetInactive: (target: PmapiQueryTarget<EP>) => Promise<void>;

    constructor(private inactivityTimeoutMs: number) {
    }

    cmpTargets(a: PmapiQueryTarget<EP>, b: PmapiQueryTarget<EP>) {
        return a.expr === b.expr && a.format === b.format && a.endpoint === b.endpoint;
    }

    refresh(targets: PmapiQueryTarget<EP>[]) {
        for (const target of targets) {
            const uid = target.uid!;
            const prevObservedTarget = this.targets[uid];

            if (!prevObservedTarget) {
                this.targets[uid] = { target: Object.assign({}, target), lastActive: new Date().getTime() };
            }
            else if (!this.cmpTargets(prevObservedTarget.target, target)) {
                this.onTargetUpdate(prevObservedTarget.target, target);
                this.targets[uid] = { target: Object.assign({}, target), lastActive: new Date().getTime() };
            }
            else {
                prevObservedTarget.lastActive = new Date().getTime();
            }
        }
    }

    existMatchingTarget(excludeTarget: PmapiQueryTarget<EP>, match: Partial<PmapiQueryTarget<EP>>) {
        for (const uid in this.targets) {
            if (uid === excludeTarget.uid)
                continue;

            let isMatch = true;
            for (const key in match) {
                if (this.targets[uid][key] !== match[key]) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch)
                return true;
        }
        return false;
    }

    cleanup() {
        const expiry = new Date().getTime() - this.inactivityTimeoutMs;
        for (const uid in this.targets) {
            if (this.targets[uid].lastActive <= expiry) {
                this.onTargetInactive(this.targets[uid].target);
                delete this.targets[uid];
            }
        }
    }

}
