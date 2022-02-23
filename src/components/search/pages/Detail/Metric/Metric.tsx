import React from 'react';
import { connect } from 'react-redux';
import { Button, HorizontalGroup, Themeable, VerticalGroup, withTheme } from '@grafana/ui';
import { EntityType } from '../../../../../common/services/pmsearch/types';
import Card from '../../../components/Card/Card';
import Loader from '../../../components/Loader/Loader';
import { RootState } from '../../../store/reducer';
import { FetchStatus } from '../../../store/slices/search/shared/state';
import { BookmarkItem } from '../../../store/slices/search/slices/bookmarks/state';
import { MetricDataState } from '../../../store/slices/search/slices/entity/state';
import {
    detailPageActions,
    detailPageBtn,
    detailPageDescription,
    detailPageEntityType,
    detailPageHeader,
    detailPageItem,
    detailPageProperties,
    detailPageTitle,
} from '../styles';
import Series from './Series/Series';

const mapStateToProps = (state: RootState) => ({
    bookmarks: state.search.bookmarks,
});

export interface MetricDetailPageBasicProps {
    metric: MetricDataState;
    onBookmark: (item: BookmarkItem) => void;
    onUnbookmark: (item: BookmarkItem) => void;
    onPreview: (item: MetricDetailPreview) => void;
}

export interface MetricDetailPreview {
    id: string;
    type: 'graph' | 'table';
}

export type MetricDetailPageReduxStateProps = ReturnType<typeof mapStateToProps>;

export type MetricDetailPageReduxProps = MetricDetailPageReduxStateProps;

export type MetricDetailPageProps = MetricDetailPageReduxProps & MetricDetailPageBasicProps & Themeable;

export class MetricDetailPage extends React.Component<MetricDetailPageProps, {}> {
    constructor(props: MetricDetailPageProps) {
        super(props);
        this.renderDetail = this.renderDetail.bind(this);
        this.renderDesc = this.renderDesc.bind(this);
        this.renderMetric = this.renderMetric.bind(this);
        this.renderBookmarkBtn = this.renderBookmarkBtn.bind(this);
        this.renderPreviewBtn = this.renderPreviewBtn.bind(this);
        this.onPreview = this.onPreview.bind(this);
        this.onBookmark = this.onBookmark.bind(this);
        this.onUnbookmark = this.onUnbookmark.bind(this);
    }

    get isBookmarked() {
        const { metric, bookmarks } = this.props;
        return bookmarks.some(bookmark => metric.data?.name === bookmark.id && bookmark.type === EntityType.Metric);
    }

    onBookmark() {
        const { metric } = this.props;
        const { data } = metric;
        if (data) {
            this.props.onBookmark({ id: data.name, type: EntityType.Metric });
        }
    }

    onUnbookmark() {
        const { metric } = this.props;
        const { data } = metric;
        if (data) {
            this.props.onUnbookmark({ id: data.name, type: EntityType.Metric });
        }
    }

    onPreview() {
        const { metric } = this.props;
        const { data } = metric;
        // either no data or no series
        if (!data || data.series.length === 0) {
            return;
        }
        // assume that all series have same type of value
        const { meta } = data.series[0];
        switch (meta.type) {
            case 'string':
                this.props.onPreview({ id: data.name, type: 'table' });
                return;
            default:
                this.props.onPreview({ id: data.name, type: 'graph' });
                return;
        }
    }

    renderDetail() {
        const { props, renderMetric } = this;
        const { metric } = props;
        const { status, data } = metric;
        switch (status) {
            case FetchStatus.PENDING:
            case FetchStatus.SUCCESS: {
                if (status === FetchStatus.PENDING) {
                    return <p>Loading&hellip;</p>;
                }
                if (data === null) {
                    return <p>Incorrect response</p>;
                }
                return renderMetric();
            }
            case FetchStatus.ERROR: {
                return <p>Error fetching metric.</p>;
            }
        }
        return;
    }

    renderDesc() {
        const { metric } = this.props;
        const { data } = metric;
        if (!data) {
            return <p>Unable to render description.</p>;
        }
        let description = data.oneline ?? 'No help available.';
        if (data.help) {
            description = data.help;
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
                    Bookmark
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
                    Unbookmark
                </Button>
            );
        }
    }

    renderPreviewBtn() {
        const { onPreview, props } = this;
        const { metric } = props;
        const { data } = metric;
        // either no data or no series
        if (!data || data.series.length === 0) {
            return;
        }
        return (
            <Button
                variant="link"
                size="md"
                icon="chart-line"
                className={detailPageBtn}
                onClick={onPreview}
                data-test="preview-button"
            >
                Preview
            </Button>
        );
    }

    renderMetric() {
        const { props, renderDesc, renderBookmarkBtn, renderPreviewBtn } = this;
        const { metric } = props;
        const { data } = metric;
        if (!data) {
            return <p>No metric.</p>;
        }
        return (
            <VerticalGroup spacing="lg">
                <Card background="strong">
                    <article className={detailPageItem}>
                        <header className={detailPageHeader}>
                            <h2 className={detailPageTitle} data-test="title">
                                {data.name}
                            </h2>
                            <Button
                                variant="link"
                                size="md"
                                icon="tag-alt"
                                className={detailPageEntityType(props.theme)}
                            >
                                Metric
                            </Button>
                        </header>
                        <div className={detailPageDescription} data-test="description">
                            {renderDesc()}
                        </div>
                        <div className={detailPageActions}>
                            <HorizontalGroup spacing="lg" justify="space-between">
                                {renderPreviewBtn()}
                                {renderBookmarkBtn()}
                            </HorizontalGroup>
                        </div>
                    </article>
                </Card>
                <div className={detailPageProperties}>
                    <VerticalGroup spacing="lg">
                        {data.series.map((series, i) => (
                            <Card background="weak" key={i}>
                                <Series series={series} data-test="series" />
                            </Card>
                        ))}
                    </VerticalGroup>
                </div>
            </VerticalGroup>
        );
    }

    render() {
        const { renderDetail, props } = this;
        const { metric } = props;
        return (
            <Loader loaded={metric.status !== FetchStatus.PENDING} data-test="loader">
                {renderDetail()}
            </Loader>
        );
    }
}

export default withTheme(connect(mapStateToProps, {})(MetricDetailPage));
