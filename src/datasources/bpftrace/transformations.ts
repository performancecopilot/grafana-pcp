import _ from 'lodash';
import { Datapoint, TargetFormat, TimeSeriesResult, TableResult } from "./datasource";

export default class Transformations {

    constructor(private templateSrv: any) {
    }

    getLabel(target: string, legendFormat: string) {
        if (_.isEmpty(legendFormat)) {
            return target;
        }
        else {
            let vars = {
                instance: { value: target }
            };
            return this.templateSrv.replace(legendFormat, vars);
        }
    }

    updateLabels(targetResults: TimeSeriesResult[], target: any) {
        return targetResults.map((t: TimeSeriesResult) => {
            return { target: this.getLabel(t.target, target.legendFormat), datapoints: t.datapoints }
        });
    }

    transformToHistogram(targetResults: TimeSeriesResult[]) {
        for (const target of targetResults) {
            // target name is the upper bound
            target.target = target.target.split('-')[1];

            // round timestamps to one second - the heatmap panel calculates the x-axis size accordingly
            target.datapoints = target.datapoints.map(
                (dataPoint: Datapoint) => [dataPoint[0], Math.ceil(dataPoint[1] / 1000) * 1000, dataPoint[2]]
            );
        }
        return targetResults;
    }

    transformToTable(targetResults: TimeSeriesResult[]) {
        let tableText = "";
        if (targetResults.length > 0)
            tableText = targetResults[0].datapoints[0][0] as string;

        let table: TableResult = { columns: [], rows: [], type: 'table' };
        let lines = tableText.split('\n');
        let columnSizes: [number, number | undefined][] = [];

        for (let line of lines) {
            line = line.trim();
            if (line.length === 0 || line.includes("Ctrl-C"))
                continue;

            if (_.isEmpty(table.columns)) {
                let tableHeaders = line.split(/\s\s+/);
                for (let i = 0; i < tableHeaders.length; i++) {
                    const colStartAt = line.indexOf(tableHeaders[i]);
                    const colEndAt = i + 1 < tableHeaders.length ? line.indexOf(tableHeaders[i + 1]) - 1 : undefined;
                    table.columns.push({ text: tableHeaders[i] });
                    columnSizes.push([colStartAt, colEndAt]);
                }
            }
            else {
                let row = columnSizes.map((colSize: any) => line.substring(colSize[0], colSize[1]).trim());
                table.rows.push(row);
            }
        }
        return [table];
    }

    transform(targetResults: TimeSeriesResult[], target: any) {
        if (target.format === TargetFormat.TimeSeries)
            return this.updateLabels(targetResults, target);
        else if (target.format === TargetFormat.Heatmap)
            return this.transformToHistogram(targetResults);
        else if (target.format == TargetFormat.Table)
            return this.transformToTable(targetResults);
        else
            throw { message: "Invalid target format" };
    }


}
