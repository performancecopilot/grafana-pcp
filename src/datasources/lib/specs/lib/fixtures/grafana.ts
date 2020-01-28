import { MetricMetadata } from "../../../models/pmapi";
import { Query, QueryTarget, TargetFormat } from "../../../models/datasource";

export const metricMetadataSingle: MetricMetadata = {
    "name": "metric.single",
    "pmid": "1.0.1",
    "type": "u64",
    "sem": "instant",
    "units": "bytes",
    "labels": {},
    "text-oneline": "helptext single line",
    "text-help": "helptext"
};

export const metricMetadataIndom: MetricMetadata = {
    "name": "metric.indom",
    "pmid": "1.0.1",
    "indom": "1",
    "type": "u64",
    "sem": "instant",
    "units": "bytes",
    "labels": {},
    "text-oneline": "helptext single line",
    "text-help": "helptext"
};

export const query: Query = {
    dashboardId: 1,
    panelId: 1,
    timezone: "",
    interval: "20s",
    intervalMs: 20000,
    maxDataPoints: 100,
    range: {
        from: new Date(0),
        to: new Date(20000)
    },
    scopedVars: {},
    targets: []
};

export const queryTarget: QueryTarget = {
    refId: "A",
    expr: "",
    format: TargetFormat.TimeSeries
};
