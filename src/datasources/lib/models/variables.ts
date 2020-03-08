export enum DashboardVariableType {
    Constant = 'constant',
    AdHoc = 'adhoc',
    Interval = 'interval',
    Query = 'query',
    Datasource = 'datasource',
    Custom = 'custom',
    TextBox = 'textbox',
}

export interface DashboardVariable {
    type: DashboardVariableType,
    [key: string]: any,
}

export interface AdHocFilter {
    condition: string,
    key: string,
    operator: DashboardVariableFilterOperator,
    value: string,
}

export interface AdHocDashboardVariable {
    $$haskey: string,
    datasource: string,
    defaults: any,
    filters: Array<AdHocFilter>,
    hide: boolean,
    label: string | null,
    name: string,
    skipUrlSync: boolean,
    type: DashboardVariableType,
}

export enum DashboardVariableFilterOperator {
    Equals = '=',
    NotEquals = '!=',
    LessThan = '<',
    GreaterThan = '>',
    RegexMatch = '=~',
    RegexNotMatch = '!~',
}
