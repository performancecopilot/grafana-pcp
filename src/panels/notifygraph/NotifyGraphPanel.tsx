import { PanelProps, GraphSeriesXY } from '@grafana/data';
import React from 'react';
import memoizeOne from 'memoize-one';
import { generateGraphModel, outsideThresholdSeries } from './utils';
import { GraphWithLegend, withTheme, Themeable, IconButton, Modal, VerticalGroup, Icon } from '@grafana/ui';
import { GraphWithLegendProps } from '@grafana/ui/components/Graph/GraphWithLegend';
import { Options, ThresholdOptions, MetaOptions } from './types';
import { graphWrapper, infoBoxToggle } from './styles';

interface NotifyGraphPanelState {
    showModal: boolean;
}

type NotifyGraphPanelProps = PanelProps<Options> & Themeable;

export class NotifyGraphPanel extends React.PureComponent<NotifyGraphPanelProps, NotifyGraphPanelState> {
    computeModel: typeof generateGraphModel = memoizeOne(generateGraphModel);
    outsideThresholdSeries: typeof outsideThresholdSeries = memoizeOne(outsideThresholdSeries);

    state: NotifyGraphPanelState = {
        showModal: false,
    };

    constructor(props: NotifyGraphPanelProps) {
        super(props);
        this.renderWarning = this.renderWarning.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    renderContent(meta: MetaOptions) {
        return (
            <VerticalGroup spacing="lg">
                <VerticalGroup spacing="md">
                    <p>
                        <strong>{meta.description}</strong>
                    </p>
                    {meta.details && <p>{meta.details}</p>}
                </VerticalGroup>
                {meta.urls.length && (
                    <VerticalGroup spacing="md">
                        <h3>Troubleshooting:</h3>
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
                {meta.metrics.length && (
                    <VerticalGroup spacing="md">
                        <h3>Related PCP metrics:</h3>
                        <ul>
                            {meta.metrics.map(metric => (
                                <li>{metric}</li>
                            ))}
                        </ul>
                    </VerticalGroup>
                )}
                {meta.derived.length && (
                    <VerticalGroup spacing="md">
                        <h3>Derived PCP Metrics:</h3>
                        <ul>
                            {meta.derived.map(metric => (
                                <li>
                                    <strong>{metric}</strong>
                                </li>
                            ))}
                        </ul>
                    </VerticalGroup>
                )}
            </VerticalGroup>
        );
    }

    renderWarning(series: GraphSeriesXY[], threshold: ThresholdOptions | undefined, meta: MetaOptions) {
        const { state, props, renderContent } = this;
        const { theme } = props;

        if (!threshold) {
            return;
        }

        const outsideBounds = this.outsideThresholdSeries(series, threshold);

        if (outsideBounds.length === 0) {
            return;
        }

        const modalHeader = (
            <div className="modal-header-title">
                <Icon name="exclamation-triangle" size="lg" />
                <span className="p-l-1">{meta.name}</span>
            </div>
        );

        return (
            <>
                <IconButton
                    surface="panel"
                    name="exclamation-triangle"
                    size="lg"
                    className={infoBoxToggle(theme)}
                    onClick={() => this.setState({ showModal: true })}
                />
                <Modal
                    title={modalHeader}
                    isOpen={state.showModal}
                    onDismiss={() => this.setState({ showModal: false })}
                >
                    {renderContent(meta)}
                </Modal>
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
                {this.renderWarning(series, threshold, meta)}
                <GraphWithLegend {...graphProps} />
            </div>
        );
    }
}

export default withTheme(NotifyGraphPanel);
