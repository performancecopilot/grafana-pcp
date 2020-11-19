local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector: Host Overview',
  tags=['pcp-vector'],
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
  grafana.row.new(
    title='Overview'
  ), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'CPU%',
    datasource='$datasource',
    format='percent',
    min=0,
    stack=true,
  )
  .addTargets([
    { expr: 'kernel.cpu.util.user', format: 'time_series', legendFormat: '$metric' },
    { expr: 'kernel.cpu.util.sys', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 1,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Load average',
    datasource='$datasource',
    decimals=2,
    legend_alignAsTable=true,
    legend_min=true,
    legend_max=true,
    legend_current=true,
    legend_values=true,
  )
  .addTargets([
    { expr: 'kernel.all.load', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 1,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Memory Utilization',
    datasource='$datasource',
    format='kbytes',
    min=0,
    stack=true,
  )
  .addTargets([
    { expr: 'mem.util.free', format: 'time_series', legendFormat: '$metric' },
    { expr: 'mem.util.cached', format: 'time_series', legendFormat: '$metric' },
    { expr: 'mem.physmem', format: 'time_series', legendFormat: '$metric' },
  ])
  .addSeriesOverride({
    "alias": "/physmem/",
    "fill": 0,
    "linewidth": 2,
    "stack": false
  }), gridPos={
    x: 0,
    y: 8,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk Utilization',
    datasource='$datasource',
    format='percent',
    min=0,
  )
  .addTargets([
    { expr: 'disk.dev.util', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 8,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='CPU'
  ), gridPos={
    x: 0,
    y: 15,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Per-CPU busy (User)',
    datasource='$datasource',
    format='percentunit',
    min=0,
    max=1,
  )
  .addTargets([
      { expr: 'kernel.percpu.cpu.user', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 16,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Per-CPU busy (Sys)',
    datasource='$datasource',
    format='percentunit',
    min=0,
    max=1,
  )
  .addTargets([
      { expr: 'kernel.percpu.cpu.sys', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 16,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'User %',
    datasource='$datasource',
    format='percent',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'kernel.cpu.util.user', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 23,
    w: 6,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Sys %',
    datasource='$datasource',
    format='percent',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'kernel.cpu.util.sys', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 6,
    y: 23,
    w: 6,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Interrupt %',
    datasource='$datasource',
    format='percent',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'kernel.cpu.util.intr', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 23,
    w: 6,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Wait %',
    datasource='$datasource',
    format='percent',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'kernel.cpu.util.wait', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 18,
    y: 23,
    w: 6,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Scheduler'
  ), gridPos={
    x: 0,
    y: 30,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Context switches per second',
    datasource='$datasource',
    format='ops',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'kernel.all.pswitch', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 31,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Runnable',
    datasource='$datasource',
    min=0,
    decimals=0,
    legend_show=false,
    staircase=true,
  )
  .addTargets([
      { expr: 'kernel.all.runnable', format: 'time_series' , legendFormat: '$metric'},
  ]), gridPos={
    x: 12,
    y: 31,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Memory'
  ), gridPos={
    x: 0,
    y: 38,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Used',
    datasource='$datasource',
    format='kbytes',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'mem.util.used', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 39,
    w: 8,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Cached',
    datasource='$datasource',
    format='kbytes',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'mem.util.cached', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 8,
    y: 39,
    w: 8,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Free',
    datasource='$datasource',
    format='kbytes',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'mem.util.free', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 16,
    y: 39,
    w: 8,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Page fault rate',
    datasource='$datasource',
    format='ops',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'mem.vmstat.pgfault', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 46,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Hard fault rate',
    datasource='$datasource',
    format='ops',
    min=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'mem.vmstat.pgmajfault', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 46,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Network'
  ), gridPos={
    x: 0,
    y: 53,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Network Throughput (In)',
    datasource='$datasource',
    format='Bps',
  )
  .addTargets([
      { expr: 'network.interface.in.bytes', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 54,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Network Throughput (Out)',
    datasource='$datasource',
    format='Bps',
  )
  .addTargets([
      { expr: 'network.interface.out.bytes', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 54,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Network Drops (In)',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
      { expr: 'network.interface.in.drops', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 61,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Network Drops (Out)',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
      { expr: 'network.interface.out.drops', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 61,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Network Packets (In)',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
      { expr: 'network.interface.in.packets', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 68,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Network Packets (Out)',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
      { expr: 'network.interface.out.packets', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 68,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='TCP'
  ), gridPos={
    x: 0,
    y: 75,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'TCP Connections',
    datasource='$datasource',
    min=0,
    decimals=0,
    stack=true,
  )
  .addTargets([
      { expr: 'network.tcpconn.time_wait', format: 'time_series', legendFormat: '$metric' },
      { expr: 'network.tcpconn.established', format: 'time_series', legendFormat: '$metric' },
      { expr: 'network.tcpconn.close_wait', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 76,
    w: 24,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'TCP Timeouts',
    datasource='$datasource',
    min=0,
    decimals=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'network.tcp.timeouts', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 83,
    w: 6,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'TCP Close-waits',
    datasource='$datasource',
    min=0,
    decimals=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'network.tcpconn.close_wait', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 6,
    y: 83,
    w: 6,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'TCP Time Wait',
    datasource='$datasource',
    min=0,
    decimals=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'network.tcpconn.time_wait', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 12,
    y: 83,
    w: 6,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'TCP Established',
    datasource='$datasource',
    min=0,
    decimals=0,
    legend_show=false,
  )
  .addTargets([
      { expr: 'network.tcpconn.established', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 18,
    y: 83,
    w: 6,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'TCP Listen Errors',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
      { expr: 'network.tcp.listendrops', format: 'time_series', legendFormat: '$metric' },
      { expr: 'network.tcp.listenoverflows', format: 'time_series', legendFormat: '$metric' },
  ]), gridPos={
    x: 0,
    y: 90,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'TCP Retransmits',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
      { expr: 'network.tcp.retranssegs', format: 'time_series', legendFormat: '$metric0' },
      { expr: 'network.tcp.fastretrans', format: 'time_series', legendFormat: '$metric0' },
      { expr: 'network.tcp.slowstartretrans', format: 'time_series', legendFormat: '$metric0' },
      { expr: 'network.tcp.synretrans', format: 'time_series', legendFormat: '$metric0' },
  ]), gridPos={
    x: 12,
    y: 90,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Disk'
  ), gridPos={
    x: 0,
    y: 97,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk Latency',
    datasource='$datasource',
    format='percentunit',
    min=0,
  )
  .addTargets([
      { expr: 'disk.dev.read_rawactive', legendFormat: 'read $instance', format: 'time_series' },
      { expr: 'disk.dev.write_rawactive', legendFormat: 'write $instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 98,
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
  )
  .addTargets([
      { expr: 'disk.dev.read', legendFormat: 'read $instance', format: 'time_series' },
      { expr: 'disk.dev.write', legendFormat: 'write $instance', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 98,
    w: 12,
    h: 7,
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
      { expr: 'disk.dev.read_bytes', legendFormat: 'read $instance', format: 'time_series' },
      { expr: 'disk.dev.write_bytes', legendFormat: 'write $instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 105,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk Utilization',
    datasource='$datasource',
    format='percentunit',
    min=0,
    max=1,
  )
  .addTargets([
      { expr: 'disk.dev.avactive', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 105,
    w: 12,
    h: 7,
  }
)
