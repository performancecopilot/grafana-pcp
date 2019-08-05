import _ from 'lodash';
import { TargetFormat, TimeSeriesData, PanelData, TableData, QueryTarget, TargetResult, MetricInstance, Metric, Query } from './types';
import { isBlank } from './utils';
import "core-js/stable/array/flat-map";

export default class PanelTransformations {

    constructor(private templateSrv: any) {
    }

    getLabel(query: Query, target: QueryTarget, metric: string, instance?: MetricInstance<number | string>, metadata: Record<string, any> = {}) {
        if (isBlank(target.legendFormat)) {
            if (instance && instance.name !== "")
                return instance.name;
            else
                return metric;
        }
        else {
            metadata = _.mapValues(metadata, (val: any) => ({ value: val }));
            const metricSpl = metric.split('.');
            const vars = {
                ...query.scopedVars,
                ...metadata,
                metric: { value: metric },
                metric0: { value: metricSpl[metricSpl.length - 1] }
            };
            if (instance && instance.name !== "")
                vars["instance"] = { value: instance.name };
            return this.templateSrv.replace(target.legendFormat, vars);
        }
    }

    transformToTimeSeries(query: Query, target: QueryTarget, metric: Metric<number>): TimeSeriesData[] {
        return metric.instances.map(instance => ({
            target: this.getLabel(query, target, metric.name, instance, metric.metadata),
            datapoints: instance.values
        }));
    }

    transformToHeatmap(metric: Metric<number>): TimeSeriesData[] {
        return metric.instances.map(instance => {
            // target name is the upper bound
            let targetName = instance.name;
            const match = instance.name.match(/^(.+?)\-(.+?)$/);
            if (match)
                targetName = match[2];

            // round timestamps to one second, the heatmap panel calculates the x-axis size accordingly
            return {
                target: targetName,
                datapoints: instance.values.map(dataPoint => [dataPoint[0], Math.floor(dataPoint[1] / 1000) * 1000])
            };
        });
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

    transformMultipleMetricsToTable(query: Query, results: TargetResult[]) {
        let table: TableData = { columns: [], rows: [], type: 'table' };
        table.columns = results.map(targetResult => ({ text: this.getLabel(query, targetResult.target, targetResult.metrics[0].name) }));
        const instanceNames = Object.keys(results[0].metrics[0].instances).sort((a, b) => parseInt(a) - parseInt(b));
        for (const instanceName of instanceNames) {
            const row: (number | string)[] = [];
            for (const targetResult of results) {
                const instance = (targetResult.metrics[0] as Metric<number | string>).instances.find(instance => instance.name === instanceName);
                if (instance && instance.values.length > 0)
                    row.push(instance.values[instance.values.length - 1][0]);
                else
                    row.push('?');
            }
            table.rows.push(row);

        }
        return table;
    }

    transformToTable(query: Query, results: TargetResult[]) {
        if (results.length > 1) {
            return this.transformMultipleMetricsToTable(query, results);
        }
        else if (results.length === 1 && results[0].metrics.length === 1) {
            const instances = results[0].metrics[0].instances as MetricInstance<string>[];
            if (instances.length > 0 && instances[0].values.length > 0)
                return this.transformStringToTable(instances[0].values[0][0]);
        }
        return { columns: [], rows: [], type: 'table' };
    }

    transform(query: Query, results: TargetResult[]): PanelData[] {
        const format = results[0].target.format;

        if (format === TargetFormat.TimeSeries)
            return results.flatMap(targetResult => targetResult.metrics.flatMap((metric: Metric<number>) => this.transformToTimeSeries(query, targetResult.target, metric)));
        else if (format === TargetFormat.Heatmap)
            return results.flatMap(targetResult => targetResult.metrics.flatMap((metric: Metric<number>) => this.transformToHeatmap(metric)));
        else if (format == TargetFormat.Table)
            return [this.transformToTable(query, results)];
        else
            throw { message: `Invalid target format '${format}', possible options: ${TargetFormat.TimeSeries}, ${TargetFormat.Heatmap}, ${TargetFormat.Table}` };
    }


}
