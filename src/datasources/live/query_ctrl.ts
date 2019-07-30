import { TargetFormat } from '../lib/types';
import PCPMetricCompleter from './completer';
import { PcpQueryCtrl } from "../lib/pcp_query_ctrl";
import './mode-pcp';

export class PcpLiveDatasourceQueryCtrl extends PcpQueryCtrl {
    static templateUrl = 'datasources/live/partials/query.editor.html'

    formats: any = [];

    /** @ngInject **/
    constructor($scope: any, $injector: any) {
        super($scope, $injector);

        this.target.expr = this.target.expr || "";
        this.target.format = this.target.format || this.getDefaultFormat();

        this.formats = [
            { text: "Time series", value: TargetFormat.TimeSeries },
            { text: "Table", value: TargetFormat.Table },
            { text: "Heatmap", value: TargetFormat.Heatmap },
        ];
    }

    getDefaultFormat() {
        if (this.panelCtrl.panel.type === 'table') {
            return TargetFormat.Table;
        } else if (this.panelCtrl.panel.type === 'heatmap') {
            return TargetFormat.Heatmap;
        }
        return TargetFormat.TimeSeries;
    }

    async getContainers() {
        let containers = await this.datasource.metricFindQuery('containers.name');
        containers.unshift({ text: '-', value: null });
        return containers;
    }

    getCompleter() {
        return new PCPMetricCompleter(this.datasource, this.target);
    }

}
