import { PanelData } from "@grafana/ui";
import { Options } from "./types";

export interface Stack {
    name: string;
    value: number;
    children: Stack[];
}

export function generateFlameGraphModel(panelData: PanelData, options: Options): Stack {
    const root: Stack = { name: "root", value: 0, children: [] };

    for (const dataFrame of panelData.series) {
        const count = (dataFrame as any).rows[0][0];
        // skip samples of empty stack
        if (!dataFrame.name || count < options.minSamples)
            continue;

        let curNode = root;
        const stacks = dataFrame.name!.split('\n');
        for (let stackFrame of stacks) {
            stackFrame = stackFrame.trim();
            if (!stackFrame || (options.hideUnresolvedStackFrames && stackFrame.startsWith("0x")))
                continue;

            let child = curNode.children.find(child => child.name === stackFrame);
            if (!child) {
                child = { name: stackFrame, value: 0, children: [] };
                curNode.children.push(child);
            }
            curNode = child;
        }
        curNode.value = count;
    }

    return root;
}
