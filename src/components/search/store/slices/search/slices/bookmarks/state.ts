import { EntityType } from 'common/services/pmsearch/types';

export interface BookmarkItem {
    // Is also human readable name
    id: string;
    type: EntityType;
}

export type BookmarksState = BookmarkItem[];

export const initialBookmarks = (): BookmarksState => [];
