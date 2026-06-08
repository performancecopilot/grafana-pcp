export enum TargetFormat {
    TimeSeries = 'time_series',
    Heatmap = 'heatmap',
    Geomap = 'geomap',
    Gauge = 'gauge',
    /** vector only */
    MetricsTable = 'metrics_table',
    /** bpftrace only */
    CsvTable = 'csv_table',
    /** bpftrace only — deprecated, use FlameGraph instead */
    FlameGraphLegacy = 'flamegraph',
    /** bpftrace only — outputs nested set DataFrame for Grafana's built-in flamegraph visualization */
    FlameGraph = 'flamegraph_grafana',
}
