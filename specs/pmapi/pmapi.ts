export interface PmApi {
    context(context: number);
    contextExpired(context: number, url: string);
    metric(context: number, metrics: { name: string, semantics: string }[], requestedMetrics?: string[]);
    indom(context: number, metric: string, instances: { instance: number, name: string, labels?: any }[]);
    fetchSingleMetric(context: number, timestamp: number, metrics: { name: string, value: number }[], requestedMetrics?: string[]);
    fetchIndomMetric(context: number, timestamp: number, metrics: { name: string, instances: { instance: number, value: number }[] }[]);
    kernelAllSysfork: any;
    kernelAllLoad: any;
}
