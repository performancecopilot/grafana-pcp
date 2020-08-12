import {
    GraphSeriesXY,
    PanelData,
    getTimeField,
    FieldType,
    getFlotPairs,
    getSeriesTimeStep,
    FieldColorMode,
    getDisplayProcessor,
    MS_DATE_TIME_FORMAT,
    DEFAULT_DATE_TIME_FORMAT,
    hasMsResolution,
    TimeZone,
} from '@grafana/data';
import { colors } from '@grafana/ui';
import { Options, ThresholdOptions, ThresholdsOperator } from './types';

export function generateGraphModel(data: PanelData, timeZone: TimeZone, options: Options): GraphSeriesXY[] {
    const series: GraphSeriesXY[] = [];
    data.series
        .map(item => ({ timeInfo: getTimeField(item), seriesItem: item }))
        .filter(item => item.timeInfo.timeField)
        .map(item => ({ timeField: item.timeInfo.timeField!, seriesItem: item.seriesItem }))
        .forEach(({ timeField, seriesItem }) => {
            seriesItem.fields
                .filter(field => field.type === FieldType.number)
                .forEach((field, fieldIndex) => {
                    const points = getFlotPairs({
                        xField: timeField,
                        yField: field,
                        nullValueMode: options.graph.nullValue,
                    });
                    if (points.length === 0) {
                        return;
                    }
                    field.config = {
                        color: {
                            mode: FieldColorMode.Thresholds,
                            fixedColor: colors[series.length % colors.length],
                        },
                    };
                    field.display = getDisplayProcessor({ field });
                    timeField.display = getDisplayProcessor({
                        timeZone,
                        field: {
                            ...timeField,
                            type: timeField.type,
                            config: {
                                unit: `time:${
                                    hasMsResolution(timeField) ? MS_DATE_TIME_FORMAT : DEFAULT_DATE_TIME_FORMAT
                                }`,
                            },
                        },
                    });
                    series.push({
                        label: field.name,
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
                });
        });
    return series;
}

export function outsideThresholdSeries(series: GraphSeriesXY[], threshold: ThresholdOptions): GraphSeriesXY[] {
    return series.filter(seriesItem => {
        const thresholdValidator = value => {
            // might be better to just use eval
            switch (threshold.operator) {
                case ThresholdsOperator.GreaterThan:
                    return threshold.value! > value;
                case ThresholdsOperator.GreaterThanOrEqual:
                    return threshold.value! >= value;
                case ThresholdsOperator.Lesser:
                    return threshold.value! < value;
                case ThresholdsOperator.LesserThanOrEqual:
                    return threshold.value! <= value;
                case ThresholdsOperator.Equal:
                    return value === threshold.value;
                default:
                    return true;
            }
        };
        return seriesItem.data.some(([_, y]) => !thresholdValidator(y));
    });
}
