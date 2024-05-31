local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector: UWSGI Overview',
  tags=['pcp-vector', 'uwsgi'],
  time_from='now-5m',
  time_to='now',
  refresh='5s',
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'performancecopilot-vector-datasource',
    'PCP Vector',
  )
)
.addPanel(
  grafana.graphPanel.new(
    'Total Worker Count',
    datasource='$datasource',
    decimals=0,
    min=0
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_workers', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 0,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Pause Worker Count',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_pause_worker_count', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 0,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Idle Worker Count',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_idle_worker_count', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 8,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Busy Worker Count',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_busy_worker_count', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 8,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Harakiri Count',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_harakiri_count', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 16,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Total Exceptions',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_exceptions', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 16,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Total Workers Acceptions Requests',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_workers_accepting_requests', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 24,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Total Requests Served',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.total_requests_served', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 24,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Average Response Time (msec)',
    datasource='$datasource',
    decimals=0,
    min=0,
  )
  .addTargets([
    { expr: 'uwsgi.summary.avg_response_time_msec', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 32,
    w: 12,
    h: 8,
  }
)