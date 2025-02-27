export enum TargetFormat {
    TimeSeries = 'time_series',
    Heatmap = 'heatmap',
    Geomap = 'geomap',
    /** vector only */
    MetricsTable = 'metrics_table',
    /** bpftrace only */
    CsvTable = 'csv_table',
    /** bpftrace only */
    FlameGraph = 'flamegraph',
}
