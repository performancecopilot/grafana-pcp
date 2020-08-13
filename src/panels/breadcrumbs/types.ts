export interface NavOptsItem {
    title: string;
    dashboardId: string;
}

export interface BreadcrumbsItem {
    title: string;
    dashboardId: string;
    opts: NavOptsItem[];
}

export interface Options {
    items: BreadcrumbsItem[];
}
