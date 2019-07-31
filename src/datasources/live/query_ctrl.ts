import { TargetFormat } from '../lib/types';
import PCPMetricCompleter from './completer';
import { PCPQueryCtrl } from "../lib/pcp_query_ctrl";
import './mode-pcp';
import { getDashboardVariables } from '../lib/utils';

export class PCPLiveDatasourceQueryCtrl extends PCPQueryCtrl {
    static templateUrl = 'datasources/live/partials/query.editor.html'

    formats: any = [];

    /** @ngInject **/
    constructor($scope: any, $injector: any, private variableSrv: any) {
        super($scope, $injector);

        this.target.expr = this.target.expr || "";
        this.target.format = this.target.format || this.getDefaultFormat();
        this.target.container = this.target.container || ""; // gf-form-dropdown won't open with null/undefined value and allow-custom=true

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
        const dashboardVariables = Object.keys(getDashboardVariables(this.variableSrv));
        let containers = await this.datasource.metricFindQuery('containers.name');

        const options: { text: string, value: string }[] = [];
        options.push({ text: '-', value: '' });
        options.push(...dashboardVariables.map((var_: string) => ({ text: '$' + var_, value: '$' + var_ })));
        options.push(...containers);
        return options;
    }

    getCompleter() {
        return new PCPMetricCompleter(this.datasource, this.target);
    }

}
