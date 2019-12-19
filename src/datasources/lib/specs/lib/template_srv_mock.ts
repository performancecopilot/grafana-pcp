export const templateSrv = {
    replace: (str: string, vars: any) => {
        for (const var_ in vars)
            str = str.replace('$' + var_, vars[var_].value);
        return str;
    }
};
