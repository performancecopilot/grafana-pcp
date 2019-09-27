export interface Options {
    minSamples: number;
    hideUnresolvedStackFrames: boolean;
}

export const defaults: Options = {
    minSamples: 1,
    hideUnresolvedStackFrames: false
};
