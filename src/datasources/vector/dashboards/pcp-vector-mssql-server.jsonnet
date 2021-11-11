local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector: Microsoft SQL Server',
  tags=['pcp-vector', 'mssql'],
  time_from='now-5m',
  time_to='now',
  refresh='5s',
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'pcp-vector-datasource',
    'PCP Vector',
  )
)
.addPanel(
  grafana.graphPanel.new(
    'Linux: Run Queue',
    datasource='$datasource',
    min=0,
    decimalsY1=0,
    staircase=true,
  )
  .addTargets([
    { expr: 'proc.runq.runnable', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'System: % CPU',
    datasource='$datasource',
    formatY1='percent',
    min=0,
    stack=true,
  )
  .addTargets([
    { expr: 'kernel.cpu.util.sys', format: 'time_series', legendFormat: '$metric0' },
    { expr: 'kernel.cpu.util.user', format: 'time_series', legendFormat: '$metric0' },
  ]), gridPos={
    x: 0,
    y: 8,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Per-CPU busy (User)',
    datasource='$datasource',
    formatY1='percentunit',
    min=0,
    max=1,
  )
  .addTargets([
    { expr: 'kernel.percpu.cpu.user', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 16,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Per-CPU busy (Sys)',
    datasource='$datasource',
    formatY1='percentunit',
    min=0,
    max=1,
  )
  .addTargets([
    { expr: 'kernel.percpu.cpu.sys', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 16,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk Utilization',
    datasource='$datasource',
    formatY1='percent',
    min=0,
  )
  .addTargets([
    { expr: 'disk.dev.util', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 24,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk Throughput',
    datasource='$datasource',
    format='KiBs',
    min=0,
  )
  .addTargets([
    { expr: 'disk.dev.read_bytes', format: 'time_series', legendFormat: 'read $instance' },
    { expr: 'disk.dev.write_bytes', format: 'time_series', legendFormat: 'write $instance' },
  ]), gridPos={
    x: 0,
    y: 32,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk IOPS',
    datasource='$datasource',
    formatY1='iops',
    min=0,
  )
  .addTargets([
    { expr: 'disk.dev.read', format: 'time_series', legendFormat: 'read $instance' },
    { expr: 'disk.dev.write', format: 'time_series', legendFormat: 'write $instance' },
  ]), gridPos={
    x: 12,
    y: 32,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: General Statistics – User Connections',
    datasource='$datasource',
    min=0,
    decimalsY1=0,
  )
  .addTargets([
    { expr: 'mssql.general.user_connections', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 40,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Memory Manager',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'mssql.memory_manager.total_server_memory', format: 'time_series', legendFormat: 'total server memory' },
    { expr: 'mssql.memory_manager.stolen_server_memory', format: 'time_series', legendFormat: 'stolen server memory' },
    { expr: 'mssql.memory_manager.reserved_server_memory', format: 'time_series', legendFormat: 'reserved server memory' },
  ]), gridPos={
    x: 0,
    y: 48,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Batch Requests',
    datasource='$datasource',
    formatY1='ops',
  )
  .addTargets([
    { expr: 'mssql.sql_statistics.batch_requests', format: 'time_series', legendFormat: 'batch requests' },
    { expr: 'mssql.sql_statistics.compilations', format: 'time_series', legendFormat: 'compilations' },
    { expr: 'mssql.sql_statistics.recompilations', format: 'time_series', legendFormat: 'recompilations' },
  ]), gridPos={
    x: 0,
    y: 56,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Network IO waits',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'mssql.wait_statistics.network_io_waits', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 64,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Access Methods Page Splits',
    datasource='$datasource',
    formatY1='ops',
  )
  .addTargets([
    { expr: 'mssql.access_methods.page_splits', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 64,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Statistics Compilations',
    datasource='$datasource',
    formatY1='ops',
  )
  .addTargets([
    { expr: 'mssql.sql_statistics.compilations', format: 'time_series', legendFormat: '$metric' },
    { expr: 'mssql.sql_statistics.recompilations', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 72,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Plan Cache (Cache Hit Ratio)',
    datasource='$datasource',
    formatY1='percentunit',
  )
  .addTargets([
    { expr: 'mssql.plan_cache.cache_hit_ratio', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 72,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL OS: Waiting Tasks',
    datasource='$datasource',
    decimalsY1=0,
  )
  .addTargets([
    { expr: 'mssql.os_wait_stats.waiting_tasks', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 80,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL OS: Maximum Wait Stats',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'mssql.os_wait_stats.max_wait_time', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 88,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL OS: Wait Times',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'mssql.os_wait_stats.wait_time', format: 'time_series', legendFormat: '$instance', options: { timeUtilizationConversion: false } },
  ]), gridPos={
    x: 12,
    y: 88,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Latch Waits',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'mssql.latches.latch_waits', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 96,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'SQL Server: Latch Wait Times',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'mssql.latches.total_latch_wait_time', format: 'time_series', legendFormat: '$metric' },
    { expr: 'mssql.latches.average_latch_wait_time', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 96,
    w: 12,
    h: 8,
  }
) + {
  revision: 2,
}
