import { PCPRedisDatasource } from './datasource';
import { PCPRedisDatasourceQueryCtrl } from './query_ctrl';

class PCPRedisConfigCtrl {
    static templateUrl = 'datasources/legacy/redis/partials/config.html';
}

class PCPRedisAnnotationsQueryCtrl {
    static templateUrl = 'datasources/legacy/redis/partials/annotations.editor.html';
}

export {
    PCPRedisDatasource as Datasource,
    PCPRedisDatasourceQueryCtrl as QueryCtrl,
    PCPRedisConfigCtrl as ConfigCtrl,
    PCPRedisAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
