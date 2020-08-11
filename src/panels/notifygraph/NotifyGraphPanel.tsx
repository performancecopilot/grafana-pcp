import { PanelProps } from '@grafana/data';
import React, { PureComponent } from 'react';
import memoizeOne from 'memoize-one';
import { generateGraphModel, outsideThresholdSeries } from './utils';
import { GraphWithLegend } from '@grafana/ui';
import { GraphWithLegendProps } from '@grafana/ui/components/Graph/GraphWithLegend';
import { Options } from './types';

export class NotifyGraphPanel extends PureComponent<PanelProps<Options>> {
    computeModel = memoizeOne(generateGraphModel);
    outsideThresholdSeries = memoizeOne(outsideThresholdSeries);

    render() {
        const { width, height, timeRange, data, timeZone, options, fieldConfig } = this.props;
        const series = this.computeModel(data, timeZone, fieldConfig, options);

        const outsideBounds = this.outsideThresholdSeries(series);
        console.log(outsideBounds);

        const { isLegendVisible, displayMode, placement } = options.legend;
        const { lineWidth, showBars, showLines, showPoints, isStacked } = options.graph;

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

        return <GraphWithLegend {...graphProps} />;
    }
}
