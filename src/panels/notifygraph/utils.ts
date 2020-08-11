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
    FieldConfigSource,
    ThresholdsMode,
} from '@grafana/data';
import { colors } from '@grafana/ui';
import { Options } from './types';
import memoizeOne from 'memoize-one';

export function generateGraphModel(
    data: PanelData,
    timeZone: TimeZone,
    fieldConfig: FieldConfigSource,
    options: Options
): GraphSeriesXY[] {
    console.log(fieldConfig);
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
                        ...fieldConfig.defaults,
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

export function outsideThresholdSeries(series: GraphSeriesXY[]): GraphSeriesXY[] {
    return series.filter(seriesItem => {
        const { config } = seriesItem.valueField;
        console.log(config);
        // skip checking, if no thresholds are present or is non Absolute threshold mode
        if (!config.thresholds || config.thresholds.mode === ThresholdsMode.Percentage) {
            return false;
        }
        // TODO: make validator for thresholds
        const thresholdValidator = memoizeOne(y => config.thresholds!.steps.every(step => true));
        return seriesItem.data.some(([_, y]) => !thresholdValidator(y));
    });
}
