import { QueryTarget } from "./models/datasource";

interface ObservedTarget {
    target: QueryTarget;
    references: Set<string>;
}

export default class DashboardObserver {

    private targets: Record<string, ObservedTarget> = {};
    onTargetUpdate: (prevValue: QueryTarget, newValue: QueryTarget) => void;

    cmpTargets(a: QueryTarget, b: QueryTarget) {
        return a.expr === b.expr && a.format === b.format && a.url === b.url && a.container === b.container;
    }

    refresh(targets: QueryTarget[]) {
        for (const target of targets) {
            const uid = target.uid!;
            const prevObservedTarget = this.targets[uid];

            if (!prevObservedTarget) {
                this.targets[uid] = { target: Object.assign({}, target), references: new Set() };
            }
            else if (!this.cmpTargets(prevObservedTarget.target, target)) {
                this.onTargetUpdate(prevObservedTarget.target, target);
                this.targets[uid] = { target: Object.assign({}, target), references: new Set() };
            }
        }
    }

    addTargetDependency(target: QueryTarget, reference: string) {
        const uid = target.uid!;
        const prevObservedTarget = this.targets[uid];
        if (!prevObservedTarget)
            throw new Error("Cannot find target");
        prevObservedTarget.references.add(reference);
    }

}
