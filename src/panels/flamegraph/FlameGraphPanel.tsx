import _ from "lodash";
import React, { PureComponent } from 'react';
import memoizeOne from "memoize-one";
import { PanelProps, Tooltip } from '@grafana/ui';
import { Options } from './types';
import { dateTime } from "@grafana/data";
import { generateFlameGraphModel } from './model';
import { FlameGraphChart } from "./FlameGraphChart";

export class FlameGraphPanel extends PureComponent<PanelProps<Options>> {

    computeModel = memoizeOne(generateFlameGraphModel);

    render() {
        const model = this.computeModel(this.props.data, this.props.options);
        if (model.root.children.length === 0) {
            return (
                <div className="datapoints-warning">
                    <span className="small">
                        Sampling, waiting for data...
                        <Tooltip content="Data query didn't return anything yet" placement="top">
                            <i className="grafana-tip fa fa-question-circle" />
                        </Tooltip>
                    </span>
                </div>
            );
        }

        const fromDate = dateTime(model.minDate).format("HH:mm:ss");
        const toDate = dateTime(model.maxDate).format("HH:mm:ss");
        const title = `${fromDate} - ${toDate}`;
        return (<FlameGraphChart width={this.props.width} height={this.props.height} stacks={model.root} title={title} />);
    }

}
