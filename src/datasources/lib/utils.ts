import _ from "lodash";

// typescript decorator which makes sure that this function
// is called only once at a time
// subsequent calls return the promise of the first call
export function synchronized(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method = descriptor.value;

    descriptor.value = function () {
        if (!this.inflightCalls)
            this.inflightCalls = {};
        if (this.inflightCalls[propertyKey])
            return this.inflightCalls[propertyKey];

        this.inflightCalls[propertyKey] = method.apply(this, arguments);
        return this.inflightCalls[propertyKey].then((result: any) => {
            this.inflightCalls[propertyKey] = null;
            return result;
        }, (reason: any) => {
            this.inflightCalls[propertyKey] = null;
            throw reason;
        });
    }
}

export function isBlank(str: string) {
    return !(_.isString(str) && str.trim().length > 0);
}

export function getDashboardVariables(variableSrv: any): any {
    const variables = {};
    if (!variableSrv.variables) {
        // variables are not defined on the datasource settings page
        return {};
    }

    variableSrv.variables.forEach((variable) => {
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

export function getConnectionParams(variableSrv: any, target: any, instanceSettings: any): [string, string?] {
    const dashboardVariables = getDashboardVariables(variableSrv);
    let url: string = "";
    let container: string | undefined;

    if (!isBlank(target.url))
        url = target.url;
    else if (dashboardVariables.url && !isBlank(dashboardVariables.url.value))
        url = dashboardVariables.url.value;
    else if (!isBlank(instanceSettings.url))
        url = instanceSettings.url;
    else
        throw { message: "Cannot find any connection url." };

    if (!isBlank(target.container))
        container = target.container;
    else if (dashboardVariables.container && !isBlank(dashboardVariables.container.value))
        container = dashboardVariables.container.value;
    else if (!isBlank(instanceSettings.container))
        container = instanceSettings.container;

    return [url, container];
}
