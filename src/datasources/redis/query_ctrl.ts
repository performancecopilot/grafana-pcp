import { TargetFormat } from '../lib/types';
import { PCPQueryCtrl } from '../lib/pcp_query_ctrl';
import PCPRedisMetricCompleter from './completer';
import './mode-pmseries';

export class PCPRedisDatasourceQueryCtrl extends PCPQueryCtrl {
    static templateUrl = 'datasources/redis/partials/query.editor.html';

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

    getCompleter() {
        return new PCPRedisMetricCompleter(this.datasource);
    }

}
