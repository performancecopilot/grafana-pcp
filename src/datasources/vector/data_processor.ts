import { DataQueryRequest, MutableDataFrame, FieldType, MutableField, DataQueryResponseData, MISSING_VALUE } from "@grafana/data";
import { VectorQuery, VectorQueryWithUrl, TargetFormat } from "./types";
import { MetricStore, Endpoint, PollerQueryResult } from "./poller";
import { InstanceId, pcpUnitToGrafanaUnit } from "./pcp";
import { mapValues, uniq } from "lodash";
import { getTemplateSrv } from "./utils";
import { applyTransformations } from "./field_transformations";

function getFieldName(request: DataQueryRequest<VectorQuery>, target: VectorQueryWithUrl,
    endpoint: Endpoint, metricStore: MetricStore, instanceId: InstanceId | null,
    defaultFormatFn: (metricStore: MetricStore, instanceId: InstanceId | null) => string) {
    if (target.legendFormat) {
        const metricName = metricStore.metadata.name;
        const metricSpl = metricName.split('.');

        const pcpLabels = {
            ...(endpoint.context ? endpoint.context.labels : {}),
            ...metricStore.metadata.labels,
            ...metricStore.instanceDomain.labels,
            ...(instanceId != null && instanceId in metricStore.instanceDomain.instances ? metricStore.instanceDomain.instances[instanceId].labels : {}),
        }
        const vars: any = {
            ...mapValues(pcpLabels, val => ({ value: val })),
            metric: { value: metricName },
            metric0: { value: metricSpl[metricSpl.length - 1] },
            ...request.scopedVars,
        };

        if (instanceId != null && instanceId in metricStore.instanceDomain.instances)
            vars["instance"] = { value: metricStore.instanceDomain.instances[instanceId].name };

        return getTemplateSrv().replace(target.legendFormat, vars);
    }
    else {
        return defaultFormatFn(metricStore, instanceId);
    }
}

function toDataFrame(request: DataQueryRequest<VectorQuery>, metricStore: MetricStore) {
    const requestRangeFromMs = request.range?.from.valueOf()!;
    const requestRangeToMs = request.range?.to.valueOf()!;

    const dataFrame = new MutableDataFrame();
    const timeField = dataFrame.addField({ name: 'Time', type: FieldType.time });
    const instanceIdToField = new Map<InstanceId | null, MutableField>();
    for (const snapshot of metricStore.values) {
        if (!(requestRangeFromMs <= snapshot.timestampMs && (!request.endTime || snapshot.timestampMs <= requestRangeToMs))) {
            continue;
        }

        // create all dataFrame fields in one go, because Grafana automatically matches
        // the vector length of newly created fields with already existing fields by adding empty data
        for (const instanceValue of snapshot.values) {
            if (!instanceIdToField.has(instanceValue.instance)) {
                instanceIdToField.set(instanceValue.instance, dataFrame.addField({
                    name: instanceValue.instance != null ? instanceValue.instance.toString() : "",
                    type: FieldType.number,
                    config: { unit: pcpUnitToGrafanaUnit(metricStore.metadata) }
                }));
            }
        }

        timeField.values.add(snapshot.timestampMs);
        for (const instanceValue of snapshot.values) {
            let field = instanceIdToField.get(instanceValue.instance)!;
            field.values.add(instanceValue.value);
        }
    }
    return dataFrame;
}

function defaultVectorLegend(metricStore: MetricStore, instanceId: InstanceId | null) {
    if (instanceId != null && instanceId in metricStore.instanceDomain.instances)
        return metricStore.instanceDomain.instances[instanceId].name;
    else
        return metricStore.metadata.name;
}

function toTimeSeries(request: DataQueryRequest<VectorQuery>, target: VectorQueryWithUrl,
    endpoint: Endpoint, metricStore: MetricStore, dataFrame: MutableDataFrame) {
    for (const field of dataFrame.fields) {
        if (field.type == FieldType.time)
            continue;

        const instanceId = field.name == "" ? null : parseInt(field.name, 10);
        field.name = getFieldName(request, target, endpoint, metricStore, instanceId, defaultVectorLegend);
    }
    return dataFrame;
}

function toHeatMap(dataFrame: MutableDataFrame) {
    for (const field of dataFrame.fields) {
        if (field.type == FieldType.time)
            continue;

        // target name is the upper bound
        const match = field.name.match(/^(.+?)\-(.+?)$/);
        if (match)
            field.name = match[2];
    }

    const timeVector = dataFrame.values["Time"];
    for (let i = 0; i < timeVector.length; i++) {
        // round timestamps to one second, the heatmap panel calculates the x-axis size accordingly
        timeVector.set(i, Math.floor(timeVector.get(i) / 1000) * 1000);
    }
    return dataFrame;
}

function defaultMetricsTableHeader(metricStore: MetricStore, instanceId: InstanceId | null) {
    const metricSpl = metricStore.metadata.name.split('.');
    return metricSpl[metricSpl.length - 1];
}

function toMetricsTable(request: DataQueryRequest<VectorQuery>, results: Required<PollerQueryResult>[]) {
    // can't use toDataFrame() - we want the instances of the *last* value only
    const tableDataFrame = new MutableDataFrame();
    let instances: (number | null)[] = [];
    for (const result of results) {
        const fieldName = getFieldName(request, result.target, result.endpoint, result.metricStore, null, defaultMetricsTableHeader);
        tableDataFrame.addField({ name: fieldName }).values.set(0, 5);

        if (result.metricStore.values.length > 0)
            instances.push(...result.metricStore.values[result.metricStore.values.length - 1].values.map(instanceValue => instanceValue.instance));
    }
    instances = uniq(instances);

    // every instance is a row
    for (const instance of instances) {
        // first result (target) == first tableDataFrame.field, etc.
        let fieldIdx = 0;
        for (const result of results) {
            if (result.metricStore.values.length == 0)
                continue;

            const lastSnapshot = result.metricStore.values[result.metricStore.values.length - 1].values;
            const instanceValue = lastSnapshot.find(instanceValue => instanceValue.instance == instance);
            if (instanceValue)
                tableDataFrame.fields[fieldIdx].values.add(instanceValue.value);
            else
                tableDataFrame.fields[fieldIdx].values.add(MISSING_VALUE);
            fieldIdx++;
        }
    }
    return tableDataFrame;
}

export function processTargets(request: DataQueryRequest<VectorQuery>, results: Required<PollerQueryResult>[]): DataQueryResponseData[] {
    if (results.length == 0)
        return [];

    const format = results[0].target.format;
    if (format == TargetFormat.TimeSeries) {
        return results.map(result => {
            const dataFrame = applyTransformations(result.metricStore.metadata, toDataFrame(request, result.metricStore));
            return toTimeSeries(request, result.target, result.endpoint, result.metricStore, dataFrame);
        });
    }
    else if (format == TargetFormat.Heatmap) {
        return results.map(
            result => toHeatMap(applyTransformations(result.metricStore.metadata, toDataFrame(request, result.metricStore)))
        );
    }
    else if (format == TargetFormat.MetricsTable) {
        return [toMetricsTable(request, results)];
    }
    else {
        throw { message: `Invalid target format '${format}'.` };
    }
}
