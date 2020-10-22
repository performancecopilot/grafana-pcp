local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector: eBPF/BCC Overview',
  tags=['pcp-vector', 'eBPF'],
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
.addPanel(
  grafana.heatmapPanel.new(
    'run queue latency (us)',
    datasource='$datasource',
    dataFormat='tsbuckets',
    yBucketBound='upper',
    yAxis_format='µs',
    hideZeroBuckets=true,
    cards_cardPadding=0,
  )
  .addTargets([
    { expr: 'bcc.runq.latency', format: 'heatmap' },
  ]), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 11,
  }
)
.addPanel(
  grafana.heatmapPanel.new(
    'disk latency (us)',
    datasource='$datasource',
    dataFormat='tsbuckets',
    yBucketBound='upper',
    yAxis_format='µs',
    hideZeroBuckets=true,
    cards_cardPadding=0,
  )
  .addTargets([
    { expr: 'bcc.disk.all.latency', format: 'heatmap' },
  ]), gridPos={
    x: 0,
    y: 11,
    w: 24,
    h: 11,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'active TCP sessions',
    datasource='$datasource',
    styles=null,
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
  ]) +
  {
    "transformations": [{
      "id": "organize",
      "options": {
        "excludeByName": {
          "instance": true
        },
        "indexByName": {},
        "renameByName": {}
      }
    }],
  }, gridPos={
    x: 0,
    y: 22,
    w: 24,
    h: 7,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'tcp lifespans',
    datasource='$datasource',
    styles=null,
  )
  .addTargets([
      { expr: 'bcc.proc.io.net.tcp.pid', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.comm', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.laddr', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.lport', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.daddr', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.dport', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.rx', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.tx', format: 'metrics_table' },
      { expr: 'bcc.proc.io.net.tcp.duration', format: 'metrics_table' },
  ]) +
  {
    "transformations": [{
      "id": "organize",
      "options": {
        "excludeByName": {
          "instance": true
        },
        "indexByName": {},
        "renameByName": {}
      }
    }],
  }, gridPos={
    x: 0,
    y: 29,
    w: 24,
    h: 7,
  }
)
