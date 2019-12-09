import { PanelData } from "@grafana/ui";
import { StackFrame } from 'd3-flame-graph';
import { Options } from "./types";

interface FlameGraphModel {
    root: StackFrame;
    minDate: number;
    maxDate: number;
}

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

export function generateFlameGraphModel(panelData: PanelData, options: Options): FlameGraphModel {
    const model: FlameGraphModel = {
        root: { name: "root", value: 0, children: [] },
        minDate: 0,
        maxDate: 0
    };

    // dataFrame == target == PCP instance == stack
    for (const dataFrame of panelData.series) {
        const typedDataFrame = dataFrame as any as { rows: number[][] };
        if (!dataFrame.name || typedDataFrame.rows.length === 0)
            continue;

        // each dataframe (stack) is a rate-converted counter
        // sum all rates in the selected time frame
        const count = typedDataFrame.rows.reduce((prev, cur) => prev + cur[0], 0);
        if (count < options.minSamples)
            continue;

        // we have to examine all stacks, as we clear dataframes every 5 seconds
        // it's possible that the first stack got only sampled a fraction of the overall time period
        const minDate = typedDataFrame.rows[0][1];
        const maxDate = typedDataFrame.rows[typedDataFrame.rows.length - 1][1];
        if (!model.minDate || minDate < model.minDate)
            model.minDate = minDate;
        if (!model.maxDate || maxDate > model.maxDate)
            model.maxDate = maxDate;

        const stacks = dataFrame.name.split('\n');
        readStacks(model.root, options, stacks, count);
    }

    return model;
}
