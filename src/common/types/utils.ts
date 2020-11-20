export type Dict<K extends string, T> = {
    [P in K]?: T;
};
