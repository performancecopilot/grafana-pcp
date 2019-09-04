import { PCPVectorDatasource } from './datasource';
import { PCPVectorDatasourceQueryCtrl } from './query_ctrl';
import { PCPVectorConfigCtrl } from './config_ctrl';

class PCPVectorAnnotationsQueryCtrl {
  static templateUrl = 'datasources/vector/partials/annotations.editor.html';
}

export {
  PCPVectorDatasource as Datasource,
  PCPVectorDatasourceQueryCtrl as QueryCtrl,
  PCPVectorConfigCtrl as ConfigCtrl,
  PCPVectorAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
