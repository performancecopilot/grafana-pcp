import _ from "lodash";
import { PCPLiveDatasource } from "./datasource";

export class PCPLiveConfigCtrl {
    static templateUrl = 'datasources/live/partials/config.html'
    current: any;

    /** @ngInject **/
    constructor(private backendSrv: any, private templateSrv: any, private variableSrv: any) {
        this.current.jsonData.container = this.current.jsonData.container || ""; // gf-form-dropdown won't open with null/undefined value and allow-custom=true
    }

    async getContainers() {
        const instanceSettings = _.cloneDeep(this.current);
        instanceSettings.jsonData.pollInterval = '0s'; // otherwise setInterval will be called in constructor
        let datasource = new PCPLiveDatasource(instanceSettings, this.backendSrv, this.templateSrv, this.variableSrv);

        let containers: any = [];
        try {
            containers = await datasource.metricFindQuery('containers.name');
        }
        catch (e) {
            // probably URL is not set up correctly, ignore
        }
        containers.unshift({ text: '-', value: '' });
        return containers;
    }

}
