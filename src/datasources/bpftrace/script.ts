import Context from "../lib/context";
import { TargetFormat } from "../lib/types";
import DataStore from "../lib/datastore";

export default class BPFtraceScript {
    // additional properties by ScriptRegistry
    lastRequested: number;

    constructor(readonly name: string, readonly vars: string[], readonly status: string,
        readonly exit_code: number | null, readonly output: string, readonly code: string) {
        this.lastRequested = new Date().getTime();
    }

    hasFailed() {
        return this.status === "stopped" && this.exit_code !== 0;
    }

    getControlMetrics() {
        return [
            `bpftrace.scripts.${this.name}.status`,
            `bpftrace.scripts.${this.name}.exit_code`,
            `bpftrace.scripts.${this.name}.output`
        ];
    }

    private async getMetricForMetricType(context: Context, metrictype: string) {
        for (const var_ of this.vars) {
            const metric = `bpftrace.scripts.${this.name}.data.${var_}`;
            const metricMetadata = await context.metricMetadata(metric);
            if (metricMetadata && metricMetadata.labels && metricMetadata.labels.metrictype === metrictype)
                return metric;
        }
        return null;
    }

    async getDataMetrics(context: Context, format: TargetFormat) {
        if (format === TargetFormat.TimeSeries) {
            return this.vars.map(var_ => `bpftrace.scripts.${this.name}.data.${var_}`);
        }
        else if (format === TargetFormat.Heatmap) {
            const metric = await this.getMetricForMetricType(context, "histogram");
            if (metric)
                return [metric];
            else
                throw { message: "Cannot find any histogram in this BPFtrace script." };
        }
        else if (format === TargetFormat.Table) {
            const metric = await this.getMetricForMetricType(context, "output");
            if (metric)
                return [metric];
            else
                throw { message: "Table format is only supported with printf() BPFtrace scripts." };
        }
        throw { message: "Unsupported panel format." };
    }

    update(datastore: DataStore) {
        const queryResult = datastore.queryMetrics(null, this.getControlMetrics(), 0, Infinity);
        for (const metric of queryResult.metrics) {
            if (metric.instances.length > 0 && metric.instances[0].values.length > 0) {
                const metric_field = metric.name.substring(metric.name.lastIndexOf('.') + 1);
                this[metric_field] = metric.instances[0].values[0][0];
            }
        }
    }
}