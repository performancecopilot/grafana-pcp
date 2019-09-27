import _ from "lodash";
import React, { PureComponent } from 'react';
import memoizeOne from "memoize-one";
import { PanelProps, Tooltip } from '@grafana/ui';
import { Options } from './types';
import { generateFlameGraphModel } from './model';
import { FlameGraphChart } from "./FlameGraphChart";

export class FlameGraphPanel extends PureComponent<PanelProps<Options>> {

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

        const timestamp = (this.props.data.series[0] as any).rows[0][1];
        return (<FlameGraphChart width={this.props.width} height={this.props.height} stacks={stacks} timestamp={timestamp} />);
    }

}
