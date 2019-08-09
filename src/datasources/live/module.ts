import { PCPLiveDatasource } from './datasource';
import { PCPLiveDatasourceQueryCtrl } from './query_ctrl';
import { PCPLiveConfigCtrl } from './config_ctrl';

class PCPLiveAnnotationsQueryCtrl {
  static templateUrl = 'datasources/live/partials/annotations.editor.html';
}

export {
  PCPLiveDatasource as Datasource,
  PCPLiveDatasourceQueryCtrl as QueryCtrl,
  PCPLiveConfigCtrl as ConfigCtrl,
  PCPLiveAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
