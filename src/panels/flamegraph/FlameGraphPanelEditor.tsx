import React, { PureComponent } from "react";
import { PanelEditorProps, Switch, Input } from "@grafana/ui";
import { Options } from "./types";

export class FlameGraphPanelEditor extends PureComponent<PanelEditorProps<Options>> {

    onMinSamplesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onOptionsChange({ ...this.props.options, minSamples: parseInt(event.target.value, 10) });
    };

    onHideUnresolvedStackFramesToggle = () => {
        this.props.onOptionsChange({ ...this.props.options, hideUnresolvedStackFrames: !this.props.options.hideUnresolvedStackFrames });
    };

    render() {
        return (
            <>
                <div className="section gf-form-group">
                    <h5 className="section-heading">Draw Options</h5>
                    <div className="gf-form">
                        <div className="gf-form-label width-8">Min samples</div>
                        <Input
                            className="gf-form-input width-4"
                            type="number"
                            value={this.props.options.minSamples}
                            onChange={this.onMinSamplesChange}
                        />
                    </div>
                    <Switch label="Hide unresolved" labelClass="width-8" checked={this.props.options.hideUnresolvedStackFrames}
                        onChange={this.onHideUnresolvedStackFramesToggle} />
                </div>
            </>
        );
    }
}
