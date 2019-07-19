import { QueryCtrl } from 'grafana/app/plugins/sdk';
import { TargetFormat } from '../lib/types';

export class GenericDatasourceQueryCtrl extends QueryCtrl {
    static templateUrl = 'datasources/live/partials/query.editor.html'

    formats: any = [];

    constructor($scope, $injector) {
        super($scope, $injector);

        // TODO: remove workaround
        this.target.expr = this.target.expr || this.target.target || "";
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

    getAllMetrics(query) {
        return this.datasource.metricFindQuery(query || '');
    }

    refreshMetricData() {
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
}
