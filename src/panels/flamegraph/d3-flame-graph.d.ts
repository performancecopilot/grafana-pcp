declare module "d3-flame-graph" {
    interface FlameGraph {
        selfValue: (val?: boolean) => FlameGraph;
        minFrameSize: (val?: number) => FlameGraph;
        width: (val?: number) => FlameGraph;
        height: (val?: number) => FlameGraph;
        transitionDuration: (val?: number) => FlameGraph;
        resetZoom: () => void;
        clear: () => void;
        search: (term: string) => void;
    }

    export function flamegraph(): FlameGraph;
}
