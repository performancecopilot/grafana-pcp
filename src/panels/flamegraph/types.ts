export interface Options {
    minSamples: number;
    hideUnresolvedStackFrames: boolean;
    hideIdleStacks: boolean;
}

export const defaults: Options = {
    minSamples: 1,
    hideUnresolvedStackFrames: false,
    hideIdleStacks: false,
};
