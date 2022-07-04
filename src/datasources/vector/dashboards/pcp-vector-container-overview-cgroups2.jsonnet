local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector: Container Overview (CGroups v2)',
  tags=['pcp-vector', 'container'],
  time_from='now-2m',
  time_to='now+2s',
  refresh='1s',
  timepicker=grafana.timepicker.new(
    refresh_intervals=['1s', '2s', '5s', '10s'],
  ),
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'performancecopilot-vector-datasource',
    'PCP Vector',
  )
)
.addTemplate(
  grafana.template.new(
    'container',
    '$datasource',
    'containers.name',
    refresh='load',
    multi=true,
    includeAll=true,
  )
)
.addPanel(
  grafana.text.new(
    title='$container',
  ) + {
    repeat: 'container',
  }, gridPos={
    x: 0,
    y: 0,
    w: 12,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'CPU',
    datasource='$datasource',
    format='percentunit',
    min=0,
    legend_show=false,
    repeat='container',
  )
  .addTargets([
    { expr: 'cgroup.cpu.stat.usage', format: 'time_series', legendFormat: 'utilization', hostspec: 'pcp://127.0.0.1?container=$container' },
  ]), gridPos={
    x: 0,
    y: 1,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Memory',
    datasource='$datasource',
    format='bytes',
    min=0,
    legend_show=false,
    repeat='container',
  )
  .addTargets([
    { expr: 'cgroup.memory.current', format: 'time_series', legendFormat: 'usage', hostspec: 'pcp://127.0.0.1?container=$container' },
  ]), gridPos={
    x: 0,
    y: 8,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk IOPS',
    datasource='$datasource',
    format='iops',
    min=0,
    legend_show=false,
    repeat='container',
  )
  .addTargets([
    { expr: 'cgroup.io.stat.rios', format: 'time_series', legendFormat: 'read $instance', hostspec: 'pcp://127.0.0.1?container=$container' },
    { expr: 'cgroup.io.stat.wios', format: 'time_series', legendFormat: 'write $instance', hostspec: 'pcp://127.0.0.1?container=$container' },
  ]), gridPos={
    x: 0,
    y: 15,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk Throughput',
    datasource='$datasource',
    format='Bps',
    min=0,
    legend_show=false,
    repeat='container',
  )
  .addTargets([
    { expr: 'cgroup.io.stat.rbytes', format: 'time_series', legendFormat: 'read $instance', hostspec: 'pcp://127.0.0.1?container=$container' },
    { expr: 'cgroup.io.stat.wbytes', format: 'time_series', legendFormat: 'write $instance', hostspec: 'pcp://127.0.0.1?container=$container' },
  ]), gridPos={
    x: 0,
    y: 22,
    w: 12,
    h: 7,
  }
) + {
  revision: 3,
}
