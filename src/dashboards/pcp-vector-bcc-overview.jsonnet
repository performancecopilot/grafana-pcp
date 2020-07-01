local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector eBPF/BCC Overview',
  tags=['pcp-vector'],
  time_from='now-2m',
  time_to='now+2s',
  refresh='1s',
  timepicker=grafana.timepicker.new(
    refresh_intervals=['1s', '2s', '5s', '10s'],
  )
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'pcp-vector-datasource',
    'PCP Vector',
    hide='label',
  )
)
.addPanel(
  grafana.heatmapPanel.new(
    'run queue latency (us)',
    datasource='$datasource',
    dataFormat='tsbuckets',
    cards_cardPadding=0,
    hideZeroBuckets=true,
    yBucketBound='upper',
    yAxis_format='µs',
  )
  .addTarget({
      expr: 'bcc.runq.latency',
      format: 'heatmap',
  }), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.heatmapPanel.new(
    'disk latency (us)',
    datasource='$datasource',
    dataFormat='tsbuckets',
    cards_cardPadding=0,
    hideZeroBuckets=true,
    yBucketBound='upper',
    yAxis_format='µs',
  )
  .addTarget({
      expr: 'bcc.disk.all.latency',
      format: 'heatmap',
  }), gridPos={
    x: 0,
    y: 8,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'tcptop',
    datasource='$datasource',
  )
  .addTargets([
      { expr: 'bcc.proc.io.net.tcptop.pid', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcptop.comm', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcptop.laddr', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcptop.lport', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcptop.daddr', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcptop.dport', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcptop.rx', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcptop.tx', format: 'metrics_table' },
  ]), gridPos={
    x: 0,
    y: 16,
    w: 24,
    h: 8,
  }
)
