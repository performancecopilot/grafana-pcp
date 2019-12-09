import { TargetFormat } from '../lib/models/datasource';
import PCPVectorCompleter from './completer';
import { PCPQueryCtrl } from "../lib/pcp_query_ctrl";
import { getDashboardVariables } from '../lib/utils';
import './mode-pcp';
import { PCPVectorDatasource } from './datasource';

export class PCPVectorDatasourceQueryCtrl extends PCPQueryCtrl {
    static templateUrl = 'datasources/vector/partials/query.editor.html';

    datasource: PCPVectorDatasource;
    formats: any = [];

    /* @ngInject */
    constructor($scope: any, $injector: any, private variableSrv: any) {
        super($scope, $injector);

        this.target.expr = this.target.expr || "";
        this.target.format = this.target.format || this.getDefaultFormat();
        this.target.container = this.target.container || ""; // gf-form-dropdown won't open with null/undefined value and allow-custom=true

        this.formats = [
            { text: "Time series", value: TargetFormat.TimeSeries },
            { text: "Table", value: TargetFormat.MetricsTable },
            { text: "Heatmap", value: TargetFormat.Heatmap },
        ];
    }

    getDefaultFormat() {
        if (this.panelCtrl.panel.type === 'table')
            return TargetFormat.MetricsTable;
        else if (this.panelCtrl.panel.type === 'heatmap')
            return TargetFormat.Heatmap;
        else
            return TargetFormat.TimeSeries;
    }

    async getContainers() {
        const dashboardVariables = Object.keys(getDashboardVariables(this.variableSrv));
        const [url,] = this.datasource.getConnectionParams(this.target, {});
        const endpoint = await this.datasource.getOrCreateEndpoint(url);

        const containersMetricsResponse = await endpoint.pmapiSrv.getMetricValues(['containers.name']);
        const containers = containersMetricsResponse.values[0].instances
            .map((instance: any) => ({ text: instance.value, value: instance.value }));

        const options: { text: string, value: string }[] = [];
        options.push({ text: '-', value: '' });
        options.push(...dashboardVariables.map((var_: string) => ({ text: '$' + var_, value: '$' + var_ })));
        options.push(...containers);
        return options;
    }

    getCompleter() {
        this.removeTextCompleter("pcp");
        return new PCPVectorCompleter(this.datasource, this.target);
    }

}
