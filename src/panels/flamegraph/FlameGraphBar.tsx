import _ from "lodash";
import React, { PureComponent } from "react";
import './css/flamegraph_bar.css';
import { FlameGraph } from "d3-flame-graph";

interface Props {
    flamegraph: FlameGraph;
}

export class FlameGraphBar extends PureComponent<Props> {

    constructor(props: Props) {
        super(props);
        this.handleSearchChangeDebounced = _.debounce(this.handleSearchChangeDebounced, 1000);
    }

    handleResetZoom = () => {
        this.props.flamegraph.resetZoom();
    }

    handleSearchChangeDebounced(searchText: string) {
        if (searchText === "")
            this.props.flamegraph.clear();
        else
            this.props.flamegraph.search(searchText);
    }

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.handleSearchChangeDebounced(event.target.value);
    }

    render() {
        return (
            <div className="flamegraph-bar gf-form">
                <button className="btn btn-inverse" onClick={this.handleResetZoom}>Reset zoom</button>
                <label className="gf-form--has-input-icon">
                    <input type="text" className="gf-form-input width-15" placeholder="Filter" onChange={this.handleSearchChange} />
                    <i className="gf-form-input-icon fa fa-search" />
                </label>
            </div>
        );
    }
}
