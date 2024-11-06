local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Valkey: Metric Preview (Table)',  // Gets converted to slug URL => /d/pcp-valkey-metric-preview-table/pcp-valkey-metric-preview-table
  uid='pcp-valkey-metric-preview-table',
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
  grafana.tablePanel
  .new(
    '$metric',
    datasource='$datasource',
    styles=null,
  )
  .addTarget({
    expr: '$metric',
    format: 'time_series',
  }) + {
    repeat: 'metric',
  },
  gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 20,
  }
) + {
  revision: 3,
}
