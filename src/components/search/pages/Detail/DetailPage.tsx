import { SelectableValue } from '@grafana/data';
import { getLocationSrv, LocationSrv } from '@grafana/runtime';
import React from 'react';
import { connect } from 'react-redux';

import { detailPageContainer } from './styles';
import MetricDetailPage, { MetricDetailPreview } from './Metric/Metric';
import InstanceDomainDetailPage from './InstanceDomain/InstanceDomain';
import { RootState } from '../../store/reducer';
import { BookmarkItem } from '../../store/slices/search/slices/bookmarks/state';
import { addBookmark, removeBookmark } from '../../store/slices/search/slices/bookmarks/actionCreators';
import { EntityType } from 'common/services/pmsearch/types';

const mapStateToProps = (state: RootState) => ({
    entity: state.search.entity,
});

const dispatchProps = {
    addBookmark,
    removeBookmark,
};

export type DetailPageReduxStateProps = ReturnType<typeof mapStateToProps>;

export type DetailPageReduxDispatchProps = typeof dispatchProps;

export type DetailPageReduxProps = DetailPageReduxStateProps & DetailPageReduxDispatchProps;

export type DetailPageProps = DetailPageReduxProps;

enum EntityTabOpt {
    InstanceDomains = 'instance-domains',
    Labels = 'labels',
    OtherMeta = 'other-meta',
}

interface DetailPageState {
    selectedOption: EntityTabOpt;
    options: Array<SelectableValue<EntityTabOpt>>;
}

export class DetailPage extends React.Component<DetailPageProps, DetailPageState> {
    locationSrv: LocationSrv;

    constructor(props: DetailPageProps) {
        super(props);
        this.renderDetail = this.renderDetail.bind(this);
        this.onMetricPreview = this.onMetricPreview.bind(this);
        this.onBookmark = this.onBookmark.bind(this);
        this.onUnbookmark = this.onUnbookmark.bind(this);
        this.locationSrv = getLocationSrv();
    }

    onBookmark(item: BookmarkItem) {
        this.props.addBookmark(item);
    }

    onUnbookmark(item: BookmarkItem) {
        this.props.removeBookmark(item);
    }

    onMetricPreview(item: MetricDetailPreview) {
        let path = '';
        switch (item.type) {
            case 'graph':
                path = '/d/pcp-redis-metric-preview-graph/pcp-redis-metric-preview-graph';
                break;
            case 'table':
                path = '/d/pcp-redis-metric-preview-table/pcp-redis-metric-preview-table';
                break;
            default:
                return;
        }

        this.locationSrv.update({
            path,
            query: {
                'var-metric': item.id,
                refresh: '5s',
            },
        });
    }

    renderDetail() {
        const { props, onBookmark, onUnbookmark, onMetricPreview } = this;
        if (!props.entity) {
            return <p>Entity state not initialized.</p>;
        }
        switch (props.entity.type) {
            case EntityType.Metric:
                return (
                    <MetricDetailPage
                        metric={props.entity.metric}
                        onBookmark={onBookmark}
                        onUnbookmark={onUnbookmark}
                        onPreview={onMetricPreview}
                        data-test="metric-detail"
                    />
                );
            case EntityType.InstanceDomain:
                return (
                    <InstanceDomainDetailPage
                        indom={props.entity.indom}
                        onBookmark={onBookmark}
                        onUnbookmark={onUnbookmark}
                        data-test="instance-domain-detail"
                    />
                );
            default:
                return <p>Error rendering entity.</p>;
        }
    }

    render() {
        const { renderDetail } = this;
        return <div className={detailPageContainer}>{renderDetail()}</div>;
    }
}

export default connect(mapStateToProps, dispatchProps)(DetailPage);
