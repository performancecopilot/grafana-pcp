import { PanelData } from '@grafana/data';
import { StackFrame } from 'd3-flame-graph';
import { Options } from './types';
import { getTimeField, FieldType } from '@grafana/data';

interface FlameGraphModel {
    root: StackFrame;
    minDate: number;
    maxDate: number;
}

function readStacks(root: StackFrame, options: Options, instanceName: string, count: number) {
    let curNode = root;
    const stacks = instanceName.split(/[\n,]/);
    for (let stackFrame of stacks) {
        stackFrame = stackFrame.trim();
        if (!stackFrame || (options.hideUnresolvedStackFrames && stackFrame.startsWith('0x'))) {
            continue;
        }
        if (options.hideIdleStacks && stackFrame.startsWith('cpuidle_enter_state+')) {
            return;
        }

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
        root: { name: 'root', value: 0, children: [] },
        minDate: 0,
        maxDate: 0,
    };

    if (panelData.series.length !== 1) {
        return model;
    }

    const dataFrame = panelData.series[0];
    const { timeField } = getTimeField(dataFrame);
    if (!timeField || dataFrame.length === 0) {
        return model;
    }

    model.minDate = timeField.values.get(0);
    model.maxDate = timeField.values.get(timeField.values.length - 1);

    for (const field of dataFrame.fields) {
        if (field.type !== FieldType.number || !field.config.custom?.instance?.name) {
            continue;
        }

        // each dataframe (stack) is a rate-converted counter
        // sum all rates in the selected time frame
        let count = 0;
        for (let i = 0; i < field.values.length; i++) {
            count += field.values.get(i);
        }
        if (count < options.minSamples) {
            continue;
        }

        readStacks(model.root, options, field.config.custom?.instance?.name, count);
    }

    return model;
}
