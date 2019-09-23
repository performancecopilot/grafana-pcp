import _ from "lodash";
import React, { PureComponent } from 'react';
import memoizeOne from "memoize-one";
import { PanelProps, Tooltip } from '@grafana/ui';
import { Options } from './types';
import { generateFlameGraphModel, Stack } from './model';
import { FlameGraphChart } from "./FlameGraphChart";
import { FlameGraph } from "d3-flame-graph";


interface State {
    flamegraph: FlameGraph;
    stacks: Stack;
}

export class FlameGraphPanel extends PureComponent<PanelProps<Options>, State> {

    constructor(props: PanelProps<Options>) {
        super(props);
    }

    computeModel = memoizeOne(generateFlameGraphModel);

    render() {
        const stacks = this.computeModel(this.props.data, this.props.options);

        if (stacks.children.length === 0) {
            return (
                <div className="datapoints-warning">
                    <span className="small">
                        No data to show
                        <Tooltip content="Nothing returned by data query" placement="top">
                            <i className="grafana-tip fa fa-question-circle" />
                        </Tooltip>
                    </span>
                </div>
            );
        }

        return (
            <FlameGraphChart stacks={stacks} width={this.props.width} height={this.props.height} />
        );
    }

}
