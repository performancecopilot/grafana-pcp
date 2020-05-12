import { isString } from 'lodash';


export function isBlank(str?: string) {
    return !(str && isString(str) && str.trim().length > 0);
}

// @grafana/runtime v7.0.0 will contain templateSrv
declare var angular: any;
export function getTemplateSrv() {
    return angular
        .element(document)
        .injector()
        .get('templateSrv');
}
