import { PanelData } from "@grafana/ui";
import { StackFrame } from 'd3-flame-graph';
import { Options } from "./types";

function readStacks(root: StackFrame, options: Options, stacks: string[], count: number) {
    let curNode = root;
    for (let stackFrame of stacks) {
        stackFrame = stackFrame.trim();
        if (!stackFrame || (options.hideUnresolvedStackFrames && stackFrame.startsWith("0x")))
            continue;
        if (options.hideIdleStacks && stackFrame.startsWith("cpuidle_enter_state+"))
            return;

        let child = curNode.children.find(child => child.name === stackFrame);
        if (!child) {
            child = { name: stackFrame, value: 0, children: [] };
            curNode.children.push(child);
        }
        curNode = child;
    }
    curNode.value = count;
}

export function generateFlameGraphModel(panelData: PanelData, options: Options): StackFrame {
    const root: StackFrame = { name: "root", value: 0, children: [] };

    // dataFrame == target == PCP instance
    for (const dataFrame of panelData.series) {
        const count = (dataFrame as any as { rows: number[][] }).rows.reduce((prev, cur) => prev + cur[0], 0);
        // skip samples of empty stack or too less samples
        if (!dataFrame.name || count < options.minSamples)
            continue;

        const stacks = dataFrame.name!.split('\n');
        readStacks(root, options, stacks, count);
    }

    return root;
}
