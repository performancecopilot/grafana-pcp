import { QueryCtrl } from 'grafana/app/plugins/sdk';
import { TargetFormat } from '../lib/types';

export class PCPBPFtraceDatasourceQueryCtrl extends QueryCtrl {
    static templateUrl = 'datasources/bpftrace/partials/query.editor.html';

    formats: any = [];

    /** @ngInject **/
    constructor($scope, $injector) {
        super($scope, $injector);

        this.target.code = this.target.code || "";
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

    refreshMetricData() {
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
}
