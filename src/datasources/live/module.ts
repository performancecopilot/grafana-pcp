import {PcpLiveDatasource} from './datasource';
import {GenericDatasourceQueryCtrl} from './query_ctrl';

class GenericConfigCtrl {
  static templateUrl = 'datasources/live/partials/config.html'
}

class GenericQueryOptionsCtrl {
  static templateUrl = 'datasources/live/partials/query.options.html'
}

class GenericAnnotationsQueryCtrl {
  static templateUrl = 'datasources/live/partials/annotations.editor.html'
}

export {
  PcpLiveDatasource as Datasource,
  GenericDatasourceQueryCtrl as QueryCtrl,
  GenericConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
