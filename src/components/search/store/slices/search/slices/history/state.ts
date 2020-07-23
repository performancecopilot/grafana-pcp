import { SearchQuery } from '../../shared/state';

export type HistoryState = SearchQuery[];

export const initialHistory = (): HistoryState => [];
