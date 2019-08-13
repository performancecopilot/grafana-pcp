import _ from 'lodash';
import { isBlank } from '../utils';
import { MetricInstance, Metric, TargetResult } from '../models/metrics';
import { Query, QueryTarget, TimeSeriesData, TableData, PanelData, TargetFormat } from '../models/datasource';
import "core-js/stable/array/flat-map";

export type DefaultLegendFormatterFn = (metric: string, instance: MetricInstance<number | string> | undefined, labels: Record<string, any>) => string;

export default class PanelTransformationSrv {

    constructor(private templateSrv: any) {
    }

    getLabel(query: Query, target: QueryTarget, defaultLegendFormatter: DefaultLegendFormatterFn,
        metric: string, instance?: MetricInstance<number | string>, labels: Record<string, any> = {}) {
        if (isBlank(target.legendFormat)) {
            return defaultLegendFormatter(metric, instance, labels);
        }
        else {
            labels = _.mapValues(labels, (val: any) => ({ value: val }));
            const metricSpl = metric.split('.');
            const vars = {
                ...query.scopedVars,
                ...labels,
                metric: { value: metric },
                metric0: { value: metricSpl[metricSpl.length - 1] }
            };
            if (instance && instance.name !== "")
                vars["instance"] = { value: instance.name };
            return this.templateSrv.replace(target.legendFormat, vars);
        }
    }

    transformToTimeSeries(query: Query, target: QueryTarget, defaultLegendFormatter: DefaultLegendFormatterFn,
        metric: Metric<number>): TimeSeriesData[] {
        return metric.instances.map(instance => ({
            target: this.getLabel(query, target, defaultLegendFormatter, metric.name, instance, instance.labels),
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
        const table: TableData = { columns: [], rows: [], type: 'table' };
        const lines = tableText.split('\n');
        const columnSizes: [number, number | undefined][] = [];

        for (let line of lines) {
            line = line.trim();
            if (line.length === 0 || line.includes("Ctrl-C"))
                continue;

            if (table.columns.length === 0) {
                const tableHeaders = line.split(/\s\s+/);
                for (let i = 0; i < tableHeaders.length; i++) {
                    const colStartAt = line.indexOf(tableHeaders[i]);
                    const colEndAt = i + 1 < tableHeaders.length ? line.indexOf(tableHeaders[i + 1]) - 1 : undefined;
                    table.columns.push({ text: tableHeaders[i] });
                    columnSizes.push([colStartAt, colEndAt]);
                }
            }
            else {
                const row = columnSizes.map((colSize: any) => line.substring(colSize[0], colSize[1]).trim());
                table.rows.push(row);
            }
        }
        return table;
    }

    transformMultipleMetricsToTable(query: Query, results: TargetResult[], defaultLegendFormatter: DefaultLegendFormatterFn, ) {
        const table: TableData = { columns: [], rows: [], type: 'table' };
        table.columns = results.map(targetResult => ({
            text: this.getLabel(query, targetResult.target, defaultLegendFormatter, targetResult.metrics[0].name)
        }));
        const instanceNames = results[0].metrics[0].instances.map(instance => instance.name);
        if (instanceNames.length > 0 && _.isNumber(instanceNames[0]))
            instanceNames.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
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

    transformToTable(query: Query, results: TargetResult[], defaultLegendFormatter: DefaultLegendFormatterFn, ) {
        if (results.length === 1 && results[0].metrics.length === 1) {
            const firstMetric = results[0].metrics[0];
            if (firstMetric.instances.length === 1 &&
                firstMetric.instances[0].labels.agent === "bpftrace" &&
                firstMetric.instances[0].labels.metrictype === "output") {
                return this.transformStringToTable((firstMetric.instances[0] as MetricInstance<string>).values[0][0]);
            }
        }
        return this.transformMultipleMetricsToTable(query, results, defaultLegendFormatter);
    }

    transform(query: Query, results: TargetResult[], defaultLegendFormatter: DefaultLegendFormatterFn): PanelData[] {
        const format = results[0].target.format;
        if (format === TargetFormat.TimeSeries) {
            return results.flatMap(targetResult => targetResult.metrics.flatMap((metric: Metric<number>) =>
                this.transformToTimeSeries(query, targetResult.target, defaultLegendFormatter, metric)
            ));
        }
        else if (format === TargetFormat.Heatmap) {
            return results.flatMap(targetResult => targetResult.metrics.flatMap((metric: Metric<number>) =>
                this.transformToHeatmap(metric)
            ));
        }
        else if (format === TargetFormat.Table) {
            return [this.transformToTable(query, results, defaultLegendFormatter)];
        }
        else {
            throw {
                message: `Invalid target format '${format}', possible options: ` +
                    `${TargetFormat.TimeSeries}, ${TargetFormat.Heatmap}, ${TargetFormat.Table}`
            };
        }
    }

}
