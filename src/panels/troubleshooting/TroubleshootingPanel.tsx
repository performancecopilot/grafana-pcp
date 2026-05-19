import React, { useMemo } from 'react';
import { AlignedData } from 'uplot';
import {
    DataFrame,
    FieldType,
    GrafanaTheme2,
    PanelProps,
    TimeRange,
    formattedValueToString,
    getFieldColorModeForField,
    getFieldSeriesColor,
    outerJoinDataFrames,
} from '@grafana/data';
import {
    AxisPlacement,
    GraphDrawStyle,
    ScaleDirection,
    ScaleOrientation,
    TimeZone,
    VisibilityMode,
} from '@grafana/schema';
import { PlotLegend, TooltipPlugin2, UPlotChart, UPlotConfigBuilder, VizLayout, useTheme2 } from '@grafana/ui';
import { TroubleshootingPane } from './TroubleshootingPane';
import { graphWrapper, notUsableContainer } from './styles';
import { Options } from './types';

interface Props extends PanelProps<Options> {}

function buildPlotConfig(
    frame: DataFrame,
    timeRange: TimeRange,
    timeZone: TimeZone,
    theme: GrafanaTheme2
): UPlotConfigBuilder {
    const builder = new UPlotConfigBuilder(timeZone);

    builder.addScale({
        scaleKey: 'x',
        orientation: ScaleOrientation.Horizontal,
        direction: ScaleDirection.Right,
        isTime: true,
        range: () => [timeRange.from.valueOf(), timeRange.to.valueOf()],
    });

    builder.addAxis({
        scaleKey: 'x',
        isTime: true,
        placement: AxisPlacement.Bottom,
        timeZone,
        theme,
    });

    builder.addScale({
        scaleKey: 'y',
        orientation: ScaleOrientation.Vertical,
        direction: ScaleDirection.Up,
    });

    const firstNumericField = frame.fields.find(f => f.type === FieldType.number);
    builder.addAxis({
        scaleKey: 'y',
        placement: AxisPlacement.Left,
        theme,
        formatValue: firstNumericField?.display
            ? (v, decimals) => formattedValueToString(firstNumericField.display!(v, decimals))
            : undefined,
    });

    for (let i = 0; i < frame.fields.length; i++) {
        const field = frame.fields[i];
        if (field.type !== FieldType.number) {
            continue;
        }

        const colorMode = getFieldColorModeForField(field);
        const seriesColor = getFieldSeriesColor(field, theme).color;

        builder.addSeries({
            scaleKey: 'y',
            drawStyle: GraphDrawStyle.Line,
            showPoints: VisibilityMode.Auto,
            lineColor: seriesColor,
            fillOpacity: 0,
            lineWidth: 1,
            colorMode,
            theme,
        });
    }

    builder.setCursor({ drag: { x: true, y: false } });

    return builder;
}

export const TroubleshootingPanel: React.FC<Props> = (props: Props) => {
    const { data, timeRange, timeZone, width, height, options, onChangeTimeRange } = props;
    const theme = useTheme2();

    const alignedFrame = useMemo(
        () => (data.series.length > 0 ? outerJoinDataFrames({ frames: data.series }) : undefined),
        [data.series]
    );

    const config = useMemo(
        () => (alignedFrame ? buildPlotConfig(alignedFrame, timeRange, timeZone, theme) : undefined),
        [alignedFrame, timeRange, timeZone, theme]
    );

    const alignedData = useMemo<AlignedData>(
        () =>
            alignedFrame
                ? (alignedFrame.fields.map(f => f.values) as unknown as AlignedData)
                : ([[], []] as unknown as AlignedData),
        [alignedFrame]
    );

    if (!options.troubleshooting) {
        return (
            <div className={notUsableContainer(width, height)}>
                <p>The PCP Troubleshooting panel is not intended for use in user defined dashboards.</p>
            </div>
        );
    }

    const dataAvailable = alignedFrame && config;

    const legendElement =
        options.legend?.showLegend && config ? (
            <VizLayout.Legend placement={options.legend.placement}>
                <PlotLegend data={data.series} config={config} {...options.legend} />
            </VizLayout.Legend>
        ) : null;

    return (
        <div className={graphWrapper}>
            <TroubleshootingPane data={data} troubleshooting={options.troubleshooting}></TroubleshootingPane>
            {dataAvailable ? (
                <VizLayout width={width} height={height} legend={legendElement}>
                    {(vizWidth, vizHeight) => (
                        <UPlotChart
                            config={config}
                            data={alignedData}
                            width={vizWidth}
                            height={vizHeight}
                        >
                            <TooltipPlugin2
                                config={config}
                                hoverMode={1 /* TooltipHoverMode.xAll */}
                                queryZoom={onChangeTimeRange}
                                render={() => null}
                            />
                        </UPlotChart>
                    )}
                </VizLayout>
            ) : (
                <div className="panel-empty">
                    <p>No data to display.</p>
                </div>
            )}
        </div>
    );
};
