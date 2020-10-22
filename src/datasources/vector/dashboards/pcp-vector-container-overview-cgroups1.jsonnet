local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector Container Overview (CGroups v1)',
  tags=['pcp-vector', 'container'],
  time_from='now-2m',
  time_to='now+2s',
  refresh='1s',
  timepicker=grafana.timepicker.new(
    refresh_intervals=['1s', '2s', '5s', '10s'],
  ),
  editable=true,
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'pcp-vector-datasource',
    'PCP Vector',
    hide='value',
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
    { expr: 'cgroup.cpuacct.usage', format: 'time_series', legendFormat: 'utilization', hostspec: 'pcp://127.0.0.1?container=$container' },
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
    { expr: 'cgroup.memory.usage', format: 'time_series', legendFormat: 'usage', hostspec: 'pcp://127.0.0.1?container=$container' },
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
    { expr: 'cgroup.blkio.all.throttle.io_serviced.read', format: 'time_series', legendFormat: 'read', hostspec: 'pcp://127.0.0.1?container=$container' },
    { expr: 'cgroup.blkio.all.throttle.io_serviced.write', format: 'time_series', legendFormat: 'write', hostspec: 'pcp://127.0.0.1?container=$container' },
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
    { expr: 'cgroup.blkio.all.throttle.io_service_bytes.read', format: 'time_series', legendFormat: 'read', hostspec: 'pcp://127.0.0.1?container=$container' },
    { expr: 'cgroup.blkio.all.throttle.io_service_bytes.write', format: 'time_series', legendFormat: 'write', hostspec: 'pcp://127.0.0.1?container=$container' },
  ]), gridPos={
    x: 0,
    y: 22,
    w: 12,
    h: 7,
  }
)
