import { PanelProps, GraphSeriesXY } from '@grafana/data';
import React from 'react';
import memoizeOne from 'memoize-one';
import { generateGraphModel, outsideThresholdSeries } from './utils';
import { GraphWithLegend, withTheme, Themeable, InfoBox, IconButton } from '@grafana/ui';
import { GraphWithLegendProps } from '@grafana/ui/components/Graph/GraphWithLegend';
import { Options, ThresholdOptions } from './types';
import { graphWrapper, infoBox, infoBoxToggle } from './styles';

interface NotifyGraphPanelState {
    showWarning: boolean;
}

export class NotifyGraphPanel extends React.PureComponent<PanelProps<Options> & Themeable, NotifyGraphPanelState> {
    computeModel: typeof generateGraphModel = memoizeOne(generateGraphModel);
    outsideThresholdSeries: typeof outsideThresholdSeries = memoizeOne(outsideThresholdSeries);

    state: NotifyGraphPanelState = {
        showWarning: false,
    };

    constructor(props) {
        super(props);
        this.renderWarning = this.renderWarning.bind(this);
    }

    renderWarning(series: GraphSeriesXY[], threshold: ThresholdOptions | undefined) {
        const { theme } = this.props;

        if (!threshold) {
            return;
        }

        const outsideBounds = this.outsideThresholdSeries(series, threshold);

        if (outsideBounds.length === 0) {
            return;
        }

        return (
            <>
                <IconButton
                    surface="panel"
                    name="exclamation-triangle"
                    size="lg"
                    className={infoBoxToggle(theme)}
                    onClick={() => this.setState({ showWarning: true })}
                />
                {this.state.showWarning && (
                    <InfoBox
                        title={threshold.description}
                        url={threshold.urls.length > 0 ? threshold.urls[0] : undefined}
                        branded={false}
                        className={infoBox(theme)}
                        onDismiss={() => this.setState({ showWarning: false })}
                    >
                        {threshold.details}
                    </InfoBox>
                )}
            </>
        );
    }

    render() {
        const { width, height, timeRange, data, timeZone, options } = this.props;
        const series = this.computeModel(data, timeZone, options);

        const { legend, graph, threshold } = options;

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
                {this.renderWarning(series, threshold)}
                <GraphWithLegend {...graphProps} />
            </div>
        );
    }
}

export default withTheme(NotifyGraphPanel);
