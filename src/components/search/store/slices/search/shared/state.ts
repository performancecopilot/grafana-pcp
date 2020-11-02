import { SearchEntity } from 'common/services/pmsearch/types';

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
