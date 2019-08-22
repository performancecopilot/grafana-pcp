import _ from "lodash";

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
