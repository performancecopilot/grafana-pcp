import {
    FieldColorModeId,
    FieldType,
    getDisplayProcessor,
    getFieldDisplayName,
    getFlotPairs,
    getSeriesTimeStep,
    getTimeField,
    GraphSeriesValue,
    GraphSeriesXY,
    hasMsResolution,
    PanelData,
    systemDateFormats,
    TimeZone,
} from '@grafana/data';
import { colors } from '@grafana/ui';
import { Options, ThresholdOptions, ThresholdsOperator } from './types';

export function generateGraphModel(data: PanelData, timeZone: TimeZone, options: Options): GraphSeriesXY[] {
    const series: GraphSeriesXY[] = [];

    for (const frame of data.series) {
        const { timeField } = getTimeField(frame);
        if (!timeField) {
            continue;
        }

        for (let fieldIndex = 0; fieldIndex < frame.fields.length; fieldIndex++) {
            const field = frame.fields[fieldIndex];
            if (field.type !== FieldType.number) {
                continue;
            }

            const points = getFlotPairs({
                xField: timeField,
                yField: field,
                nullValueMode: options.graph.nullValue,
            });
            if (points.length === 0) {
                continue;
            }

            field.config = {
                ...field.config,
                color: {
                    mode: FieldColorModeId.Thresholds,
                    fixedColor: colors[series.length % colors.length],
                },
            };
            // looks like there is no way at the moment to display a custom unit
            // with the <Graph> React component:
            // we need to set the `tickFormatter` property on the yAxis, but there is no way
            // to do so (see @grafana/ui/components/Graph/Graph.tsx)
            // maybe we need the <GraphNG> component
            field.display = getDisplayProcessor({ field });
            timeField.display = getDisplayProcessor({
                timeZone,
                field: {
                    ...timeField,
                    type: timeField.type,
                    config: {
                        unit: systemDateFormats.getTimeFieldUnit(hasMsResolution(timeField)),
                    },
                },
            });
            series.push({
                label: getFieldDisplayName(field, frame),
                data: points,
                color: field.config.color?.fixedColor,
                isVisible: true,
                yAxis: {
                    index: 1,
                },
                seriesIndex: fieldIndex,
                timeField: timeField,
                valueField: field,
                timeStep: getSeriesTimeStep(timeField),
            });
        }
    }
    return series;
}

export function outsideThresholdSeries(series: GraphSeriesXY[], threshold: ThresholdOptions): GraphSeriesXY[] {
    return series.filter(seriesItem => {
        const thresholdValidator = (value: GraphSeriesValue) => {
            if (!value) {
                return true;
            }

            // might be better to just use eval
            switch (threshold.operator) {
                case ThresholdsOperator.GreaterThan:
                    return threshold.value > value;
                case ThresholdsOperator.LesserThan:
                    return threshold.value < value;
                default:
                    return true;
            }
        };
        return seriesItem.data.some(([_, y]) => !thresholdValidator(y));
    });
}
