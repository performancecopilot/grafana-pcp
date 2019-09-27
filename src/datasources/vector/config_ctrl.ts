import _ from "lodash";
import { PCPVectorDatasource } from "./datasource";

export class PCPVectorConfigCtrl {
    static templateUrl = 'datasources/vector/partials/config.html';
    current: any;

    /* @ngInject */
    constructor(private backendSrv: any, private templateSrv: any) {
        // gf-form-dropdown won't open with null/undefined value and allow-custom=true
        this.current.jsonData.container = this.current.jsonData.container || "";
    }

    async getContainers() {
        const instanceSettings = _.cloneDeep(this.current);
        instanceSettings.jsonData.pollInterval = '0s'; // otherwise setInterval will be called in constructor
        const datasource = new PCPVectorDatasource(instanceSettings, this.backendSrv, this.templateSrv);

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
