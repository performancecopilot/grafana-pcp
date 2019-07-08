import { QueryCtrl } from 'grafana/app/plugins/sdk';

export class PCPBPFtraceDatasourceQueryCtrl extends QueryCtrl {
  static templateUrl = 'datasources/bpftrace/partials/query.editor.html';

  /** @ngInject **/
  constructor($scope, $injector) {
    super($scope, $injector);

    this.target.script = this.target.script || "";
  }

  refreshMetricData() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}
