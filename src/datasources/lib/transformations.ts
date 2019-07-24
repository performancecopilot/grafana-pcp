import _ from 'lodash';
import { Datapoint, TargetFormat, TimeSeriesData, DatastoreQueryResult, PanelData, TableData, DatastoreQueryResultRow } from './types';
import { isBlank } from './utils';

export default class Transformations {

    constructor(private templateSrv: any) {
    }

    getLabel(target: string, legendFormat: string) {
        if (isBlank(legendFormat)) {
            return target;
        }
        else {
            const targetSpl = target.split('.');
            let vars = {
                instance: { value: target },
                metric0: { value: targetSpl[targetSpl.length - 1] }
            };
            return this.templateSrv.replace(legendFormat, vars);
        }
    }

    updateLabel(target: any, targetResult: TimeSeriesData) {
        return { target: this.getLabel(targetResult.target, target.legendFormat), datapoints: targetResult.datapoints }
    }

    transformToTimeSeries(queryResult: DatastoreQueryResult, target: any): TimeSeriesData[] {
        const targetResults: TimeSeriesData[] = _.flatten(queryResult.map((row: DatastoreQueryResultRow) => row.data));
        return targetResults.map(this.updateLabel.bind(this, target));
    }

    transformToHeatmap(queryResult: DatastoreQueryResult) {
        const targetResults: TimeSeriesData[] = queryResult[0].data;
        for (const target of targetResults) {
            // target name is the upper bound
            const match = target.target.match(/^(.+?)\-(.+?)$/);
            if (match) {
                target.target = match[2];
            }

            // round timestamps to one second - the heatmap panel calculates the x-axis size accordingly
            target.datapoints = target.datapoints.map(
                (dataPoint: Datapoint) => [dataPoint[0], Math.floor(dataPoint[1] / 1000) * 1000]
            );
        }
        return targetResults;
    }

    transformStringToTable(tableText: string) {
        let table: TableData = { columns: [], rows: [], type: 'table' };
        let lines = tableText.split('\n');
        let columnSizes: [number, number | undefined][] = [];

        for (let line of lines) {
            line = line.trim();
            if (line.length === 0 || line.includes("Ctrl-C"))
                continue;

            if (table.columns.length === 0) {
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
        return table;
    }

    transformMultipleMetricsToTable(queryResult: DatastoreQueryResult) {
        let table: TableData = { columns: [], rows: [], type: 'table' };
        table.columns = queryResult.map((queryResultRow) => ({ text: queryResultRow.metric }));
        const instances = Object.keys(queryResult[0].data).sort((a, b) => parseInt(a) - parseInt(b));
        for (const instance of instances) {
            const row: (string | number)[] = [];
            for (const queryResultRow of queryResult) {
                const target = queryResultRow.data.find((target: TimeSeriesData) => target.target === instance);
                if (target && target.datapoints.length > 0)
                    row.push(target.datapoints[target.datapoints.length - 1][0]);
                else
                    row.push('?');
            }
            table.rows.push(row);

        }
        return table;
    }

    transformToTable(queryResult: DatastoreQueryResult) {
        if (queryResult.length > 1) {
            return this.transformMultipleMetricsToTable(queryResult);
        }
        else if (queryResult.length === 1) {
            const targets = queryResult[0].data;
            if (targets.length > 0 && targets[0].datapoints.length > 0)
                return this.transformStringToTable(targets[0].datapoints[0][0] as string);
        }
        return { columns: [], rows: [], type: 'table' };
    }

    transform(queryResult: DatastoreQueryResult, target: any): PanelData[] {
        if (target.format === TargetFormat.TimeSeries)
            return this.transformToTimeSeries(queryResult, target);
        else if (target.format === TargetFormat.Heatmap)
            return this.transformToHeatmap(queryResult);
        else if (target.format == TargetFormat.Table)
            return [this.transformToTable(queryResult)];
        else
            throw { message: `Invalid target format '${target.format}', possible options: ${TargetFormat.TimeSeries}, ${TargetFormat.Heatmap}, ${TargetFormat.Table}` };
    }


}
