import { TargetFormat } from '../lib/types';
import { PcpQueryCtrl } from '../lib/pcp_query_ctrl';

export class PCPBPFtraceDatasourceQueryCtrl extends PcpQueryCtrl {
    static templateUrl = 'datasources/bpftrace/partials/query.editor.html';

    formats: any = [];

    /** @ngInject **/
    constructor($scope: any, $injector: any) {
        super($scope, $injector, 5000);

        this.target.code = this.target.code || "";
        this.target.format = this.target.format || this.getDefaultFormat();
        this.target.url = this.target.url || null;

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

}
