import _ from "lodash";
import { PcpLiveDatasource } from "./datasource";

export class PcpLiveConfigCtrl {
    static templateUrl = 'datasources/live/partials/config.html'
    current: any;

    /** @ngInject **/
    constructor(private backendSrv: any, private templateSrv: any, private variableSrv: any) {
        this.current.jsonData.container = this.current.jsonData.container || null;
    }

    async getContainers() {
        const instanceSettings = _.cloneDeep(this.current);
        instanceSettings.jsonData.pollInterval = '0s'; // otherwise setInterval will be called in constructor
        let datasource = new PcpLiveDatasource(instanceSettings, this.backendSrv, this.templateSrv, this.variableSrv);

        let containers: any = [];
        try {
            containers = await datasource.metricFindQuery('containers.name');
        }
        catch (e) {
            // probably URL is not set up correctly, ignore
        }
        containers.unshift({ text: '-', value: null });
        return containers;
    }

}
