export interface LinkItem {
    title: string;
    uid: string;
    active?: boolean;
}

export interface Options {
    items: Array<Array<LinkItem>>;
}
