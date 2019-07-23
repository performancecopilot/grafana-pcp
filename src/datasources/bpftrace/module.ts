import { PCPBPFtraceDatasource } from './datasource';
import { PCPBPFtraceDatasourceQueryCtrl } from './query_ctrl';

class PCPBPFtraceConfigCtrl {
    static templateUrl = 'datasources/bpftrace/partials/config.html';
}

class PCPBPFtraceAnnotationsQueryCtrl {
    static templateUrl = 'datasources/bpftrace/partials/annotations.editor.html';
}

export {
    PCPBPFtraceDatasource as Datasource,
    PCPBPFtraceDatasourceQueryCtrl as QueryCtrl,
    PCPBPFtraceConfigCtrl as ConfigCtrl,
    PCPBPFtraceAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
