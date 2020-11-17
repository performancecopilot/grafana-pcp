import { flamegraph, FlameGraph, StackFrame } from 'd3-flame-graph';
import 'd3-flame-graph/dist/d3-flamegraph.css';
import { select } from 'd3-selection';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import './css/flamegraph.css';

interface Props {
    width: number;
    height: number;
    stacks: StackFrame;
    title: string;
}

interface State {
    searchText: string;
}

declare var angular: any;

export class FlameGraphChart extends PureComponent<Props, State> {
    static barHeight = 50; // width + margin-bottom of .flamegraph-bar

    container: React.RefObject<HTMLDivElement>;
    flamegraph: FlameGraph;

    constructor(props: Props) {
        super(props);
        this.container = React.createRef();
        this.flamegraph = this.createFlameGraph();
        this.state = {
            searchText: '',
        };
    }

    disableAutoRefresh() {
        try {
            angular.element(document).injector().get('timeSrv').setAutoRefresh('');
        } catch (error) {
            // this API may be removed in a future version of Grafana
        }
    }

    onStackFrameClick = () => {
        this.disableAutoRefresh();
    };

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
    };

    handleSearchChangeDebounced = _.debounce((searchText: string) => {
        if (searchText === '') {
            this.flamegraph.clear();
        } else {
            this.flamegraph.search(searchText);
        }
    }, 200);

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.disableAutoRefresh();
        const searchText = event.target.value;
        this.handleSearchChangeDebounced(searchText);
        if (searchText !== this.state.searchText) {
            this.setState({ searchText });
        }
    };

    render() {
        return (
            <>
                <div className="flamegraph-bar gf-form">
                    <div className="left" />
                    <div className="center">
                        <span className="date">{this.props.title}</span>
                    </div>
                    <div className="right">
                        <button className="btn btn-inverse width-8" onClick={this.handleResetZoom}>
                            Reset zoom
                        </button>
                        <label className="gf-form--has-input-icon">
                            <input
                                type="text"
                                className="gf-form-input width-15"
                                placeholder="Search"
                                onChange={this.handleSearchChange}
                            />
                            <i className="gf-form-input-icon fa fa-search" />
                        </label>
                    </div>
                </div>
                <div ref={this.container} />
            </>
        );
    }

    drawFlameGraph() {
        this.flamegraph.destroy();

        this.flamegraph = this.createFlameGraph();
        select(this.container.current).datum(this.props.stacks).call(this.flamegraph);
    }

    drawFlameGraphDebounced = _.debounce(this.drawFlameGraph, 100);

    componentDidMount() {
        this.drawFlameGraph();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this.drawFlameGraphDebounced();
        } else {
            this.flamegraph.update(this.props.stacks);
        }
    }
}
