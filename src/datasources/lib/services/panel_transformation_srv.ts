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

    private *parseCsvLine(line: string) {
        let quote = "";
        let record = "";
        for (const char of line) {
            // no quotation
            if (quote.length === 0) {
                if (char === '"' || char === "'") { // start quotation
                    quote = char;
                }
                else if (char === ',') {
                    yield record;
                    record = "";
                }
                else {
                    record += char;
                }
            }
            // inside quotation
            else {
                if (char === quote) { // end quotation
                    quote = "";
                }
                else {
                    record += char;
                }
            }
        }
        if (record.length > 0)
            yield record;
    }

    transformCsvToTable(tableText: string) {
        const table: TableData = { columns: [], rows: [], type: 'table' };
        const lines = tableText.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (line.length === 0)
                continue;

            if (table.columns.length === 0) {
                const header = Array.from(this.parseCsvLine(line));
                table.columns = header.map(title => ({ text: title }));
            }
            else {
                const row = Array.from(this.parseCsvLine(line));
                table.rows.push(row);
            }
        }
        return table;
    }

    transformMultipleMetricsToTable(query: Query, results: TargetResult[], defaultLegendFormatter: DefaultLegendFormatterFn) {
        const table: TableData = { columns: [], rows: [], type: 'table' };
        table.columns = results.flatMap(targetResult => targetResult.metrics.map(metric => ({
            text: this.getLabel(query, targetResult.target, defaultLegendFormatter, metric.name)
        })));
        table.columns.unshift({ text: "instance" });

        const instanceNames = _.uniq(results.flatMap(targetResult => targetResult.metrics.flatMap(metric =>
            metric.instances.map(instance => instance.name))));
        for (const instanceName of instanceNames) {
            const row: (number | string)[] = [instanceName];
            for (const targetResult of results) {
                for (const metric of targetResult.metrics) {
                    const instance = metric.instances.find(instance => instance.name === instanceName);
                    if (instance && instance.values.length > 0)
                        row.push(instance.values[instance.values.length - 1][0]);
                    else
                        row.push('');
                }
            }
            table.rows.push(row);
        }
        return table;
    }

    transformToTable(query: Query, results: TargetResult[], defaultLegendFormatter: DefaultLegendFormatterFn): TableData {
        if (results.length === 1 &&
            results[0].metrics.length === 1 &&
            results[0].metrics[0].instances.length === 1 &&
            results[0].metrics[0].instances[0].values.length > 0) {
            const instance = results[0].metrics[0].instances[0];
            const lastValue = instance.values[instance.values.length - 1][0];
            if (_.isString(lastValue) && lastValue.includes(',')) {
                return this.transformCsvToTable(lastValue);
            }
        }
        return this.transformMultipleMetricsToTable(query, results, defaultLegendFormatter);
    }

    transformToFlameGraph(metric: Metric<number>): TimeSeriesData[] {
        return metric.instances.map(instance => ({
            target: instance.name,
            datapoints: instance.values.slice(-1) // truncate array to last element, also works fine with empty array
        }));
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
        else if (format === TargetFormat.FlameGraph) {
            return results.flatMap(targetResult => targetResult.metrics.flatMap((metric: Metric<number>) =>
                this.transformToFlameGraph(metric)
            ));
        }
        else {
            throw { message: `Invalid target format '${format}'.` };
        }
    }

}
