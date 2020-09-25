export type Dict<K extends string, T> = {
    [P in K]?: T;
};
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalField<T, K extends keyof T> = T & Partial<Pick<T, K>>;
