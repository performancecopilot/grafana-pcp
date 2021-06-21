export interface LinkItem {
    title: string;
    name: string;
    uid: string;
    active?: boolean;
    current?: boolean;
}

export interface Options {
    items: LinkItem[][];
}
