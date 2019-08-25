import { TargetFormat } from '../lib/models/datasource';
import { PCPQueryCtrl } from '../lib/pcp_query_ctrl';
import PCPBPFtraceCompleter from './completer';
import './css/query-editor.css';
import './mode-bpftrace';

export class PCPBPFtraceDatasourceQueryCtrl extends PCPQueryCtrl {
    static templateUrl = 'datasources/bpftrace/partials/query.editor.html';

    formats: any = [];

    /* @ngInject */
    constructor($scope: any, $injector: any) {
        super($scope, $injector, 5000);

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

    getCompleter() {
        this.removeTextCompleter("bpftrace");
        return new PCPBPFtraceCompleter(this.datasource, this.target);
    }

}
