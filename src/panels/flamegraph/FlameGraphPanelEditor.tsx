import React, { PureComponent } from "react";
import { PanelEditorProps } from "@grafana/ui";
import { Options } from "./types";

export class FlameGraphPanelEditor extends PureComponent<PanelEditorProps<Options>> {
    render() {
        return (
            <div>Panel editor</div>
        );
    }
}
