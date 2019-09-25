import _ from "lodash";
import React, { PureComponent } from "react";
import { dateTime } from "@grafana/data";
import { Tooltip } from "@grafana/ui";
import { select, selectAll } from 'd3-selection';
import { flamegraph, FlameGraph, StackFrame } from 'd3-flame-graph';
import 'd3-flame-graph/dist/d3-flamegraph.css';
import './css/flamegraph.css';

interface Props {
    width: number;
    height: number;
    stacks: StackFrame;
    timestamp: number;
}

interface State {
    stacks: StackFrame;
    timestamp: number;
    zoomed: boolean;
    searchText: string;
}

export class FlameGraphChart extends PureComponent<Props, State> {
    static barHeight = 50; // width + margin-bottom of .flamegraph-bar

    container: React.RefObject<HTMLDivElement>;
    flamegraph: FlameGraph;

    constructor(props: Props) {
        super(props);
        this.container = React.createRef();
        this.flamegraph = this.createFlameGraph();
        this.state = {
            stacks: { name: "root", value: 0, children: [] },
            timestamp: 0,
            zoomed: false,
            searchText: ""
        };
    }

    onStackFrameClick = (node: { data: StackFrame }) => {
        const isRoot = node.data.name === "root";
        this.setState({ zoomed: !isRoot });
    }

    createFlameGraph() {
        return flamegraph()
            .selfValue(true)
            .minFrameSize(5)
            .width(this.props.width)
            .height(this.props.height - FlameGraphChart.barHeight)
            .transitionDuration(0) // disable animations due to repainting
            .onClick(this.onStackFrameClick);
    }

    handleResetZoom = () => {
        this.flamegraph.resetZoom();
        this.setState({ zoomed: false });
    }

    handleSearchChangeDebounced = _.debounce((searchText: string) => {
        if (searchText === "")
            this.flamegraph.clear();
        else
            this.flamegraph.search(searchText);
    }, 200);

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value;
        this.handleSearchChangeDebounced(searchText);
        if (searchText !== this.state.searchText)
            this.setState({ searchText });
    }

    static isPaused(state: Readonly<State>) {
        return state.zoomed || state.searchText.length > 0;
    }

    static getDerivedStateFromProps(nextProps: Readonly<Props>, prevState: State): Partial<State> | null {
        if (!FlameGraphChart.isPaused(prevState)) {
            // copy props over to state if we're not in paused mode
            return {
                timestamp: nextProps.timestamp,
                stacks: nextProps.stacks
            };
        }
        return null;
    }

    render() {
        const date = dateTime(this.state.timestamp).format("YYYY-MM-DD HH:mm:ss");
        return (
            <>
                <div className="flamegraph-bar gf-form">
                    <div className="left" />
                    <div className="center">
                        <span className="date">
                            {date}
                            {FlameGraphChart.isPaused(this.state) && (<span> (paused
                                <Tooltip content="Reset zoom and search text to sync with selected time range" placement="top">
                                    <i className="grafana-tip fa fa-question-circle" />
                                </Tooltip>)
                            </span>)}
                        </span>
                    </div>
                    <div className="right">
                        <button className="btn btn-inverse" onClick={this.handleResetZoom}>Reset zoom</button>
                        <label className="gf-form--has-input-icon">
                            <input type="text" className="gf-form-input width-15" placeholder="Search" onChange={this.handleSearchChange} />
                            <i className="gf-form-input-icon fa fa-search" />
                        </label>
                    </div>
                </div>
                <div ref={this.container} />
            </>
        );
    }

    drawFlameGraph() {
        select(this.container.current).selectAll('svg').remove();
        selectAll('.d3-flame-graph-tip').remove(); // if the flamegraph is redrawn, open tooltips don't close

        this.flamegraph = this.createFlameGraph();
        select(this.container.current)
            .datum(this.state.stacks)
            .call(this.flamegraph);
    }

    drawFlameGraphDebounced = _.debounce(this.drawFlameGraph, 100);

    componentDidMount() {
        this.drawFlameGraph();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height)
            this.drawFlameGraphDebounced();
        else if (prevState.stacks !== this.state.stacks)
            this.flamegraph.update(this.state.stacks);
    }

}
