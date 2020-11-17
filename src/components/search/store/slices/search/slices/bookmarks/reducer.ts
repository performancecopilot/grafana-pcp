import { Reducer } from 'redux';
import { BookmarksAction } from './actions';
import { BookmarksState, initialBookmarks } from './state';
import { ADD_BOOKMARK, CLEAR_BOOKMARKS, REMOVE_BOOKMARK } from './types';

const bookmarksReducer: Reducer<BookmarksState, BookmarksAction> = (state, action) => {
    if (state === undefined) {
        return initialBookmarks();
    }
    switch (action.type) {
        case ADD_BOOKMARK:
            return [action.payload, ...state];
        case REMOVE_BOOKMARK:
            return state.filter(x => x.id !== action.payload.id && x.type !== action.payload.type);
        case CLEAR_BOOKMARKS:
            return [];
        default:
            return state;
    }
};

export { bookmarksReducer };
