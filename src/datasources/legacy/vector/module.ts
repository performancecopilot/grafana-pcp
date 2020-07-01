import { PCPVectorDatasource } from './datasource';
import { PCPVectorDatasourceQueryCtrl } from './query_ctrl';

class PCPVectorConfigCtrl {
    static templateUrl = 'datasources/vector/partials/config.html';
}

class PCPVectorAnnotationsQueryCtrl {
    static templateUrl = 'datasources/vector/partials/annotations.editor.html';
}

export {
    PCPVectorDatasource as Datasource,
    PCPVectorDatasourceQueryCtrl as QueryCtrl,
    PCPVectorConfigCtrl as ConfigCtrl,
    PCPVectorAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
