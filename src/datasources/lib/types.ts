export enum TargetFormat {
    TimeSeries = 'time_series',
    Heatmap = 'heatmap',
    Geomap = 'geomap',
    Gauge = 'gauge',
    /** vector only */
    MetricsTable = 'metrics_table',
    /** bpftrace only */
    CsvTable = 'csv_table',
    /** bpftrace only */
    FlameGraph = 'flamegraph',
}
