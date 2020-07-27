import React from 'react';
import { VerticalGroup, withTheme, Themeable, Button } from '@grafana/ui';
import { bookmarkListBtnWithNoSpacing, bookmarkListContainer, bookmarkListContainerMultiCol } from './styles';
import { cx } from 'emotion';
import { BookmarkItem } from '../../store/slices/search/slices/bookmarks/state';
import { EntityType } from '../../models/endpoints/search';

export interface BookmarkListBasicProps {
    showClearBtn?: boolean;
    multiCol?: boolean;
    bookmarks: BookmarkItem[];
    onBookmarkClick: (item: string, type: EntityType) => void;
    onClearBookmarksClick: () => void;
}

export type BookmarkListProps = Themeable & BookmarkListBasicProps;

export class BookmarkList extends React.Component<BookmarkListProps, {}> {
    static defaultProps: Required<Pick<BookmarkListProps, 'showClearBtn' | 'multiCol'>> = {
        multiCol: true,
        showClearBtn: true,
    };

    constructor(props: BookmarkListProps) {
        super(props);
        this.onClearBookmarksClick = this.onClearBookmarksClick.bind(this);
        this.onBookmarkClick = this.onBookmarkClick.bind(this);
        this.bookmarkDesc = this.bookmarkDesc.bind(this);
    }

    onBookmarkClick(item: BookmarkItem) {
        this.props.onBookmarkClick(item.id, item.type);
    }

    onClearBookmarksClick() {
        this.props.onClearBookmarksClick();
    }

    bookmarkDesc(item: BookmarkItem): string {
        return `${item.id} (type: ${item.type})`;
    }

    render() {
        const { props, onBookmarkClick, onClearBookmarksClick, bookmarkDesc } = this;
        const { bookmarks } = props;

        if (bookmarks.length === 0) {
            return <p>No bookmarks saved.</p>;
        }

        return (
            <VerticalGroup spacing="md">
                <h4>Bookmarked Results:</h4>
                <VerticalGroup spacing="md">
                    <div
                        className={
                            props.multiCol
                                ? cx(bookmarkListContainer, bookmarkListContainerMultiCol)
                                : bookmarkListContainer
                        }
                        data-test={props.multiCol ? 'multicol' : 'singlecol'}
                    >
                        {bookmarks.map((item, index) => (
                            <Button
                                key={index}
                                variant="link"
                                size="md"
                                icon="star"
                                className={bookmarkListBtnWithNoSpacing}
                                onClick={() => onBookmarkClick(item)}
                                title={bookmarkDesc(item)}
                                data-test="bookmark-go"
                            >
                                {item.id}
                            </Button>
                        ))}
                    </div>
                    {props.showClearBtn && (
                        <Button
                            variant="destructive"
                            size="md"
                            icon="trash-alt"
                            onClick={onClearBookmarksClick}
                            data-test="bookmark-reset"
                        >
                            Clear Bookmarks
                        </Button>
                    )}
                </VerticalGroup>
            </VerticalGroup>
        );
    }
}

export default withTheme(BookmarkList);
