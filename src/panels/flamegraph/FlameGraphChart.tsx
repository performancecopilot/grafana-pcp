import _ from "lodash";
import React, { PureComponent } from "react";
import { Stack } from "./model";
import { FlameGraphBar } from "./FlameGraphBar";
import memoizeOne from "memoize-one";
import { select } from 'd3-selection';
import { flamegraph } from 'd3-flame-graph';
import 'd3-flame-graph/dist/d3-flamegraph.css';
import './css/flamegraph_chart.css';

interface Props {
    width: number;
    height: number;
    stacks: Stack;
}

interface State {
    flamegraph: any;
}

export class FlameGraphChart extends PureComponent<Props, State> {
    container: React.RefObject<HTMLDivElement>;
    static minChartHeightForBar = 200;

    constructor(props: Props) {
        super(props);
        this.container = React.createRef();
    }

    static createFlameGraph = memoizeOne((width: number, height: number) => {
        return flamegraph()
            .selfValue(true)
            .minFrameSize(5)
            .width(width)
            .height(height)
            .transitionDuration(0); // disable animations due to repainting
    });

    static getDerivedStateFromProps(nextProps: Readonly<Props>, prevState: State) {
        const barHeight = nextProps.height > FlameGraphChart.minChartHeightForBar ? 40 : 0;
        return {
            flamegraph: FlameGraphChart.createFlameGraph(nextProps.width, nextProps.height - barHeight),
        };
    }

    render() {
        return (
            <div>
                {this.props.height > FlameGraphChart.minChartHeightForBar && <FlameGraphBar flamegraph={this.state.flamegraph} />}
                <div ref={this.container} />
            </div>
        );
    }

    componentDidMount() {
        select(this.container.current)
            .datum(this.props.stacks)
            .call(this.state.flamegraph);
    }

    redrawDebounced = _.debounce(() => {
        select(this.container.current).selectAll('svg').remove();
        select(this.container.current)
            .datum(this.props.stacks)
            .call(this.state.flamegraph);
    }, 1000);

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevState.flamegraph !== this.state.flamegraph) {
            this.redrawDebounced();
        }
        else if (prevProps.stacks !== this.props.stacks) {
            this.state.flamegraph.update(this.props.stacks);
        }
    }
}
