import { PanelProps, GraphSeriesXY } from '@grafana/data';
import React from 'react';
import memoizeOne from 'memoize-one';
import { generateGraphModel, outsideThresholdSeries } from './utils';
import { GraphWithLegend, withTheme, Themeable, IconButton, Modal, VerticalGroup, Icon, Button } from '@grafana/ui';
import { GraphWithLegendProps } from '@grafana/ui/components/Graph/GraphWithLegend';
import { Options, ThresholdOptions, MetaOptions, ThresholdsOperator } from './types';
import {
    graphWrapper,
    modalTypography,
    modalArticleIcon,
    modalTooltipContent,
    modalParentsLinks,
    modalChildrenLinks,
    modalRelativesLinksContainer,
    infoBoxIssueToggle,
    infoBoxTogglesContainer,
    infoBoxInfoToggle,
    infoBoxToggle,
} from './styles';
import { LocationSrv, getLocationSrv } from '@grafana/runtime';
import { cx } from 'emotion';

interface NotifyGraphPanelState {
    showInfoModal: boolean;
    showIssueModal: boolean;
}

type NotifyGraphPanelProps = PanelProps<Options> & Themeable;

export class NotifyGraphPanel extends React.PureComponent<NotifyGraphPanelProps, NotifyGraphPanelState> {
    locationSrv: LocationSrv;
    computeModel: typeof generateGraphModel = memoizeOne(generateGraphModel);
    outsideThresholdSeries: typeof outsideThresholdSeries = memoizeOne(outsideThresholdSeries);

    state: NotifyGraphPanelState = {
        showInfoModal: false,
        showIssueModal: false,
    };

    constructor(props: NotifyGraphPanelProps) {
        super(props);
        this.renderWarning = this.renderWarning.bind(this);
        this.renderModalNavigation = this.renderModalNavigation.bind(this);
        this.renderInfoModalContent = this.renderInfoModalContent.bind(this);
        this.renderIssueModalContent = this.renderIssueModalContent.bind(this);
        this.thresholdDescription = this.thresholdDescription.bind(this);
        this.navigateDashboard = this.navigateDashboard.bind(this);
        this.locationSrv = getLocationSrv();
    }

    navigateDashboard(dashboardUid: string) {
        const path = `/d/${dashboardUid}`;
        this.locationSrv.update({
            path,
        });
    }

    thresholdDescription(threshold: ThresholdOptions) {
        return (
            <p>
                Metric{' '}
                <strong>
                    {threshold.metric} has recently had a value{' '}
                    {threshold.operator === ThresholdsOperator.GreaterThan ? 'above' : 'below'} {threshold.value}
                </strong>
            </p>
        );
    }

    renderModalNavigation(meta: MetaOptions) {
        const { navigateDashboard, props } = this;
        const { theme } = props;
        const hasParents = meta.parents.length !== 0;
        const hasChildren = meta.children.length !== 0;
        if (!hasChildren && !hasParents) return;
        return (
            <VerticalGroup spacing="md">
                <h4>
                    <Icon name="chart-line" className={modalArticleIcon(theme)} />
                    Related dashboards
                </h4>
                <div className={modalRelativesLinksContainer}>
                    {hasParents && (
                        <div className={modalParentsLinks}>
                            <VerticalGroup spacing="md">
                                {meta.parents.map(parent => (
                                    <Button
                                        variant="link"
                                        title={parent.title}
                                        onClick={() => navigateDashboard(parent.uid)}
                                    >
                                        <Icon name="angle-left" />
                                        {parent.name}
                                    </Button>
                                ))}
                            </VerticalGroup>
                        </div>
                    )}
                    {hasChildren && (
                        <div className={modalChildrenLinks}>
                            <VerticalGroup spacing="md">
                                {meta.children.map(child => (
                                    <Button
                                        variant="link"
                                        title={child.title}
                                        onClick={() => navigateDashboard(child.uid)}
                                    >
                                        {child.name}
                                        <Icon name="angle-right" />
                                    </Button>
                                ))}
                            </VerticalGroup>
                        </div>
                    )}
                </div>
            </VerticalGroup>
        );
    }

    renderInfoModalContent(meta: MetaOptions) {
        const { props, renderModalNavigation } = this;
        const { theme } = props;
        const hasMetrics = meta.metrics.length !== 0;
        const hasDerived = meta.derived.length !== 0;
        const hasIssues = meta.issues.length !== 0;
        const hasUrls = meta.urls.length !== 0;
        return (
            <div className={modalTypography(theme)}>
                <VerticalGroup spacing="lg">
                    {hasMetrics && (
                        <VerticalGroup spacing="md">
                            <h4>
                                <Icon name="database" className={modalArticleIcon(theme)} />
                                PCP metrics
                            </h4>
                            <ul>
                                {meta.metrics.map(metric => (
                                    <li>
                                        {/* Rerender caused by prop change seem to force hide the Tooltip unfortunately */}
                                        {metric.title ? (
                                            // <Tooltip content={metric.title} theme="info">
                                            //     <span className={modalTooltipContent(theme)}>{metric.name}</span>
                                            // </Tooltip>
                                            <span className={modalTooltipContent(theme)} title={metric.title}>
                                                {metric.name}
                                            </span>
                                        ) : (
                                            metric.name
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </VerticalGroup>
                    )}
                    {hasDerived && (
                        <VerticalGroup spacing="md">
                            <h4>
                                <Icon name="database" className={modalArticleIcon(theme)} />
                                Derived PCP metrics
                            </h4>
                            <ul>
                                {meta.derived.map(metric => (
                                    <li>{metric}</li>
                                ))}
                            </ul>
                        </VerticalGroup>
                    )}
                    {hasUrls && (
                        <VerticalGroup spacing="md">
                            <h4>
                                <Icon name="file-alt" className={modalArticleIcon(theme)} />
                                Further reading
                            </h4>
                            <ul>
                                {meta.urls.map(url => (
                                    <li>
                                        <a href={url} target="_blank">
                                            {url}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </VerticalGroup>
                    )}
                    {hasIssues && (
                        <VerticalGroup spacing="md">
                            <h4>
                                <Icon name="question-circle" className={modalArticleIcon(theme)} />
                                Troubleshooting
                            </h4>
                            <ul>
                                {meta.issues.map(issue => (
                                    <li dangerouslySetInnerHTML={{ __html: issue }}></li>
                                ))}
                            </ul>
                        </VerticalGroup>
                    )}
                    {renderModalNavigation(meta)}
                </VerticalGroup>
            </div>
        );
    }

    renderIssueModalContent(meta: MetaOptions, threshold: ThresholdOptions) {
        const { thresholdDescription, renderModalNavigation, props } = this;
        const { theme } = props;
        const hasUrls = meta.urls.length !== 0;

        return (
            <div className={modalTypography(theme)}>
                <VerticalGroup spacing="lg">
                    <VerticalGroup spacing="md">
                        <h2>{meta.warning}</h2>
                        {meta.details && <p>{meta.details}</p>}
                    </VerticalGroup>
                    {threshold && (
                        <VerticalGroup spacing="md">
                            <h4>
                                <Icon name="question-circle" className={modalArticleIcon(theme)} />
                                Why is this warning shown?
                            </h4>
                            {thresholdDescription(threshold)}
                        </VerticalGroup>
                    )}
                    {hasUrls && (
                        <VerticalGroup spacing="md">
                            <h4>
                                <Icon name="search" className={modalArticleIcon(theme)} />
                                Troubleshooting
                            </h4>
                            <ul>
                                {meta.urls.map(url => (
                                    <li>
                                        <a href={url} target="_blank">
                                            {url}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </VerticalGroup>
                    )}
                    {renderModalNavigation(meta)}
                </VerticalGroup>
            </div>
        );
    }

    renderWarning(series: GraphSeriesXY[], meta: MetaOptions, threshold: ThresholdOptions | undefined) {
        const { state, props, renderIssueModalContent, renderInfoModalContent } = this;
        const { theme } = props;

        const hasThreshold = threshold !== undefined;
        const outsideBounds = hasThreshold ? this.outsideThresholdSeries(series, threshold!) : [];
        const hasPassedThreshold = outsideBounds.length !== 0;

        const modalHeader = subtitle => (
            <div className="modal-header-title">
                <Icon name="exclamation-triangle" size="lg" />
                <span className="p-l-1">
                    {meta.name} - {subtitle}
                </span>
            </div>
        );

        return (
            <>
                <div className={infoBoxTogglesContainer}>
                    <IconButton
                        surface="panel"
                        name="question-circle"
                        size="lg"
                        className={cx(infoBoxToggle(theme), infoBoxInfoToggle(theme))}
                        onClick={() => this.setState({ showInfoModal: true })}
                    />
                    {hasPassedThreshold && (
                        <IconButton
                            surface="panel"
                            name="exclamation-triangle"
                            size="lg"
                            className={cx(infoBoxToggle(theme), infoBoxIssueToggle(theme))}
                            onClick={() => this.setState({ showIssueModal: true })}
                        />
                    )}
                </div>
                <Modal
                    title={modalHeader('Information')}
                    isOpen={state.showInfoModal}
                    onDismiss={() => this.setState({ showInfoModal: false })}
                >
                    {renderInfoModalContent(meta)}
                </Modal>
                {hasThreshold && (
                    <Modal
                        title={modalHeader('Warning')}
                        isOpen={state.showIssueModal}
                        onDismiss={() => this.setState({ showIssueModal: false })}
                    >
                        {renderIssueModalContent(meta, threshold!)}
                    </Modal>
                )}
            </>
        );
    }

    render() {
        const { width, height, timeRange, data, timeZone, options } = this.props;
        const series = this.computeModel(data, timeZone, options);

        const { legend, graph, threshold, meta } = options;

        const { isLegendVisible, displayMode, placement } = legend;
        const { lineWidth, showBars, showLines, showPoints, isStacked } = graph;

        const graphProps: GraphWithLegendProps = {
            isLegendVisible,
            displayMode,
            lineWidth,
            showBars,
            showLines,
            showPoints,
            isStacked,
            width,
            height,
            timeRange,
            placement,
            series,
            onToggleSort: () => {},
        };
        return (
            <div className={graphWrapper}>
                {this.renderWarning(series, meta, threshold)}
                <GraphWithLegend {...graphProps} />
            </div>
        );
    }
}

export default withTheme(NotifyGraphPanel);
