import { BookmarkItem } from './state';
import { AddBookmarkAction, ClearBookmarksAction, RemoveBookmarkAction } from './actions';
import { ADD_BOOKMARK, CLEAR_BOOKMARKS, REMOVE_BOOKMARK } from './types';

export const addBookmark = (item: BookmarkItem): AddBookmarkAction => {
    return {
        type: ADD_BOOKMARK,
        payload: item,
    };
};

export const removeBookmark = (item: BookmarkItem): RemoveBookmarkAction => {
    return {
        type: REMOVE_BOOKMARK,
        payload: item,
    };
};

export type ClearBookmarksActionCreator = () => ClearBookmarksAction;

export const clearBookmarks: ClearBookmarksActionCreator = () => {
    return { type: CLEAR_BOOKMARKS };
};
