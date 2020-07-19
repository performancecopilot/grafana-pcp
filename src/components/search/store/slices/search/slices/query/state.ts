import { SearchQuery } from '../../shared/state';
import { SearchEntity } from '../../../../../models/endpoints/search';

export type QueryState = SearchQuery;

export const initialQuery = (): SearchQuery => ({
    pattern: '',
    entityFlags: SearchEntity.All,
    pageNum: 1,
});

export const initialState: SearchQuery = initialQuery();
