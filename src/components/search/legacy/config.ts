import { PluginMeta } from '@grafana/data';

export class ExampleConfigCtrl {
    static templateUrl = 'legacy/config.html';

    appEditCtrl: any;
    appModel?: PluginMeta;

    /** @ngInject */
    constructor($scope: any, $injector: any) {
        if (!this.appModel) {
            this.appModel = {} as PluginMeta;
        }
        const appModel = this.appModel as any;
        if (!appModel.jsonData) {
            appModel.jsonData = {};
        }
    }

    postUpdate() {
        if (!this.appModel?.enabled) {
            return;
        }
    }
}
