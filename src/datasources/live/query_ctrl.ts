import { QueryCtrl } from 'grafana/app/plugins/sdk';

export class GenericDatasourceQueryCtrl extends QueryCtrl {
  static templateUrl = 'datasources/live/partials/query.editor.html'

  scope: any;

  constructor($scope, $injector)  {
    super($scope, $injector);

    this.scope = $scope;
    this.target.target = this.target.target || 'select metric';
    this.target.displayName = this.target.displayName || this.target.target;
    this.target.type = this.target.type || 'timeserie';
  }

  getOptions(query) {
    return this.datasource.metricFindQuery(query || '');
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}
