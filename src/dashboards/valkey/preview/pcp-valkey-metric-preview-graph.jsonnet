local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Valkey: Metric Preview (Graph)',  // Gets converted to slug URL => /d/pcp-valkey-metric-preview-graph/pcp-valkey-metric-preview-graph
  uid='pcp-valkey-metric-preview-graph',
  tags=['pcp-valkey'],
  time_from='now-6h',
  time_to='now',
  refresh='10s',
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'performancecopilot-valkey-datasource',
    'PCP Valkey',
    hide='variable',
  )
)
.addTemplate(
  grafana.template.new(
    'metric',
    '$datasource',
    'metrics()',
    multi=true,
    sort=1,  // asc
    refresh='load',
  )
)
.addPanel(
  grafana.graphPanel
  .new(
    '$metric',
    datasource='$datasource',
    repeat='metric',
  )
  .addTarget({
    expr: '$metric',
    format: 'time_series',
  }),
  gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 20,
  }
) + {
  revision: 3,
}
