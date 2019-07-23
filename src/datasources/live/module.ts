import { PcpLiveDatasource } from './datasource';
import { PcpLiveDatasourceQueryCtrl } from './query_ctrl';
import { PcpLiveConfigCtrl } from './config_ctrl';

class PcpLiveAnnotationsQueryCtrl {
  static templateUrl = 'datasources/live/partials/annotations.editor.html'
}

export {
  PcpLiveDatasource as Datasource,
  PcpLiveDatasourceQueryCtrl as QueryCtrl,
  PcpLiveConfigCtrl as ConfigCtrl,
  PcpLiveAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
