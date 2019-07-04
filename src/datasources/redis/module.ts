import { PCPDatasource } from './datasource';
import { PCPDatasourceQueryCtrl } from './query_ctrl';

class PCPConfigCtrl {
  static templateUrl = 'datasources/redis/partials/config.html';
}

class PCPQueryOptionsCtrl {
  static templateUrl = 'datasources/redis/partials/query.options.html';
}

class PCPAnnotationsQueryCtrl {
  static templateUrl = 'datasources/redis/partials/annotations.editor.html';
}

export {
  PCPDatasource as Datasource,
  PCPDatasourceQueryCtrl as QueryCtrl,
  PCPConfigCtrl as ConfigCtrl,
  PCPQueryOptionsCtrl as QueryOptionsCtrl,
  PCPAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
