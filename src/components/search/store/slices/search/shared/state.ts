import { SearchEntity } from '../../../../models/endpoints/search';

export enum FetchStatus {
    INIT,
    PENDING,
    SUCCESS,
    ERROR,
}

export interface SearchQuery {
    pattern: string;
    entityFlags: SearchEntity;
    pageNum: number;
}

export interface TrackableStatus {
    status: FetchStatus;
}
