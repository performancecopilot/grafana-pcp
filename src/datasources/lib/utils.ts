import _ from "lodash";
import { 
    DashboardVariable,
    DashboardVariableType,
    AdHocDashboardVariable,
    AdHocFilter,
} from './models/variables';

// typescript decorator which makes sure that this function
// is called only once at a time
// subsequent calls return the promise of the first call
export function synchronized(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (!this.inflightCalls)
            this.inflightCalls = {};
        if (this.inflightCalls[methodName])
            return this.inflightCalls[methodName];

        this.inflightCalls[methodName] = method.apply(this, arguments);
        return this.inflightCalls[methodName].then((result: any) => {
            this.inflightCalls[methodName] = null;
            return result;
        }, (reason: any) => {
            this.inflightCalls[methodName] = null;
            throw reason;
        });
    };
}

export function isBlank(str?: string) {
    return !(str && _.isString(str) && str.trim().length > 0);
}

export function getDashboardVariables(variableSrv: any) {
    const variables: Record<string, { text: string, value: any }> = {};
    if (!variableSrv.variables) {
        // variables are not defined on the datasource settings page
        return {};
    }
    variableSrv.variables.forEach((variable: DashboardVariable) => {
        if (variable.type === DashboardVariableType.AdHoc) return;
        let variableValue = variable.current.value;
        if (variableValue === '$__all' || _.isEqual(variableValue, ['$__all'])) {
            if (variable.allValue === null) {
                variableValue = variable.options.slice(1).map((textValuePair: any) => textValuePair.value);
            } else {
                variableValue = variable.allValue;
            }
        }

        variables[variable.name] = {
            text: variable.current.text,
            value: variableValue,
        };
    });

    return variables;
}

export function getAdHocFilters(datasourceName: string | null, variables: Array<DashboardVariable>): Array<AdHocFilter> {
    let filters: Array<AdHocFilter> = [];
	if (variables) {
        variables.forEach(variable => {
            if (variable.type !== DashboardVariableType.AdHoc) {
                return;
            }
            const adHocVariable: AdHocDashboardVariable = variable as AdHocDashboardVariable;
            const isMatchingDatasource = adHocVariable.datasource === null || adHocVariable.datasource === datasourceName;            
            if (isMatchingDatasource) {
                const variableFilters = variable.filters;
                filters = filters.concat(variableFilters);
            }
        });
	}
	return filters;
}

export function versionCmp(v1: string, v2: string): number {
    const a = v1.split(".").map(s => parseInt(s, 10));
    const b = v2.split(".").map(s => parseInt(s, 10));
    const numParts = Math.min(a.length, b.length);

    for (let i = 0; i < numParts; i++) {
        if (a[i] > b[i])
            return 1;
        else if (a[i] < b[i])
            return -1;
    }

    if (a.length === b.length)
        return 0;
    else
        return a.length < b.length ? -1 : 1;
}
