import {
    GraphSeriesXY,
    PanelData,
    getTimeField,
    FieldType,
    getFlotPairs,
    getSeriesTimeStep,
    FieldColorMode,
    getDisplayProcessor,
    hasMsResolution,
    TimeZone,
    GraphSeriesValue,
    systemDateFormats,
    getFieldDisplayName,
} from '@grafana/data';
import { colors } from '@grafana/ui';
import { Options, ThresholdOptions, ThresholdsOperator } from './types';

export function generateGraphModel(data: PanelData, timeZone: TimeZone, options: Options): GraphSeriesXY[] {
    const series: GraphSeriesXY[] = [];

    const exprName = new Map<string, string>();

    if (data?.request && data.request?.targets !== null) {
        data.request.targets.forEach((target: any) => {
            if (target.name !== undefined && target.expr !== undefined) {
                exprName.set(target.expr, target.name);
            }
        });
    }

    data.series
        .map(item => ({ timeInfo: getTimeField(item), seriesItem: item }))
        .filter(item => item.timeInfo.timeField)
        .map(item => ({ timeField: item.timeInfo.timeField!, seriesItem: item.seriesItem }))
        .forEach(({ timeField, seriesItem }, index) => {
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
                        ...field.config,
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
                                unit: systemDateFormats.getTimeFieldUnit(hasMsResolution(timeField)),
                            },
                        },
                    });
                    let label = getFieldDisplayName(field);
                    series.push({
                        label,
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
        const thresholdValidator = (value: GraphSeriesValue) => {
            if (!value) {
                return true;
            }

            // might be better to just use eval
            switch (threshold.operator) {
                case ThresholdsOperator.GreaterThan:
                    return threshold.value! > value;
                case ThresholdsOperator.LesserThan:
                    return threshold.value! < value;
                default:
                    return true;
            }
        };
        return seriesItem.data.some(([_, y]) => !thresholdValidator(y));
    });
}
