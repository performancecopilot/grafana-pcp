import React from 'react';
import { connect } from 'react-redux';
import { Themeable, withTheme, VerticalGroup, HorizontalGroup, Button } from '@grafana/ui';
import {
    detailPageDescription,
    detailPageItem,
    detailPageHeader,
    detailPageTitle,
    detailPageBtn,
    detailPageActions,
    detailPageEntityType,
    detailPageProperties,
} from '../styles';
import { RootState } from '../../../store/reducer';
import { IndomDataState } from '../../../store/slices/search/slices/entity/state';
import { BookmarkItem } from '../../../store/slices/search/slices/bookmarks/state';
import { FetchStatus } from '../../../store/slices/search/shared/state';
import Card from '../../../components/Card/Card';
import Loader from '../../../components/Loader/Loader';
import Instances from './Instances/Instances';
import { EntityType } from 'common/services/pmsearch/types';

const mapStateToProps = (state: RootState) => ({
    bookmarks: state.search.bookmarks,
});

export interface InstanceDomainDetailPageBasicProps {
    indom: IndomDataState;
    onBookmark: (item: BookmarkItem) => void;
    onUnbookmark: (item: BookmarkItem) => void;
}

export type InstanceDomainDetailPageReduxStateProps = ReturnType<typeof mapStateToProps>;

export type InstanceDomainDetailPageReduxProps = InstanceDomainDetailPageReduxStateProps;

export type InstanceDomainDetailPageProps = InstanceDomainDetailPageReduxProps &
    InstanceDomainDetailPageBasicProps &
    Themeable;

export class InstanceDomainDetailPage extends React.Component<InstanceDomainDetailPageProps, {}> {
    constructor(props: InstanceDomainDetailPageProps) {
        super(props);
        this.renderDetail = this.renderDetail.bind(this);
        this.renderDesc = this.renderDesc.bind(this);
        this.renderBookmarkBtn = this.renderBookmarkBtn.bind(this);
        this.renderIndom = this.renderIndom.bind(this);
        this.onBookmark = this.onBookmark.bind(this);
        this.onUnbookmark = this.onUnbookmark.bind(this);
    }

    get isBookmarked() {
        const { indom, bookmarks } = this.props;
        return bookmarks.some(
            bookmark => indom.data?.indom.name === bookmark.id && bookmark.type === EntityType.InstanceDomain
        );
    }

    onBookmark() {
        const { indom } = this.props;
        const { data } = indom;
        if (!data?.indom.name) {
            return;
        }
        if (data) {
            this.props.onBookmark({ id: data.indom.name, type: EntityType.InstanceDomain });
        }
    }

    onUnbookmark() {
        const { indom } = this.props;
        const { data } = indom;
        if (!data?.indom.name) {
            return;
        }
        if (data) {
            this.props.onUnbookmark({ id: data.indom.name, type: EntityType.InstanceDomain });
        }
    }

    renderDetail() {
        const { props, renderIndom } = this;
        const { indom } = props;
        const { status, data } = indom;
        switch (status) {
            case FetchStatus.PENDING:
            case FetchStatus.SUCCESS: {
                if (status === FetchStatus.PENDING) {
                    return <p>Loading&hellip;</p>;
                }
                if (data === null) {
                    return <p>Incorrect response</p>;
                }
                return renderIndom();
            }
            case FetchStatus.ERROR: {
                return <p>Error fetching instance domain.</p>;
            }
        }
        return;
    }

    renderDesc() {
        const { indom } = this.props;
        const { data } = indom;
        if (!data) {
            return <p>Unable to render description.</p>;
        }
        let description = data.indom.oneline;
        if (data.indom.helptext) {
            description = data.indom.helptext;
        }
        return <p>{description}</p>;
    }

    renderBookmarkBtn() {
        const { isBookmarked, onBookmark, onUnbookmark } = this;
        if (!isBookmarked) {
            return (
                <Button
                    variant="link"
                    size="md"
                    icon="star"
                    className={detailPageBtn}
                    onClick={onBookmark}
                    data-test="bookmark-button"
                >
                    Bookmark This Result
                </Button>
            );
        } else {
            return (
                <Button
                    variant="destructive"
                    size="md"
                    icon="trash-alt"
                    onClick={onUnbookmark}
                    data-test="unbookmark-button"
                >
                    Unbookmark This Result
                </Button>
            );
        }
    }

    renderIndom() {
        const { props, renderBookmarkBtn, renderDesc } = this;
        const { indom } = props;
        const { data } = indom;
        if (!data) {
            return <p>No indom.</p>;
        }
        return (
            <VerticalGroup spacing="lg">
                <Card background="strong">
                    <article className={detailPageItem}>
                        <header className={detailPageHeader}>
                            <h2 className={detailPageTitle} data-test="title">
                                {data.indom.name}
                            </h2>
                            <Button
                                variant="link"
                                size="md"
                                icon="tag-alt"
                                className={detailPageEntityType(props.theme)}
                            >
                                Instance Domain
                            </Button>
                        </header>
                        <div className={detailPageDescription} data-test="description">
                            {renderDesc()}
                        </div>
                        <div className={detailPageActions}>
                            <HorizontalGroup spacing="lg" justify="space-between">
                                {renderBookmarkBtn()}
                            </HorizontalGroup>
                        </div>
                    </article>
                </Card>
                <div className={detailPageProperties}>
                    <VerticalGroup spacing="lg">
                        <Card background="weak">
                            <Instances instances={data.instances} data-test="instances" />
                        </Card>
                    </VerticalGroup>
                </div>
            </VerticalGroup>
        );
    }

    render() {
        const { renderDetail, props } = this;
        const { indom } = props;
        return (
            <Loader loaded={indom.status !== FetchStatus.PENDING} data-test="loader">
                {renderDetail()}
            </Loader>
        );
    }
}

export default withTheme(connect(mapStateToProps, {})(InstanceDomainDetailPage));
