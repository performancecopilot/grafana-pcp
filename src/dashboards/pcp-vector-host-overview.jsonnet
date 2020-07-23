local grafana = import 'vendor/grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Vector Host Overview',
  tags=['pcp-vector'],
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
    'pcp-vector-datasource',
    'PCP Vector',
    hide='value',
  )
)

.addRow(
  grafana.row.new(
    title='Overview',
  )
  .addPanel(
    grafana.graphPanel.new(
      'CPU%',
      datasource='$datasource',
      span=6,
      format='percent',
      min=0,
      stack=true,
    )
    .addTargets([
      { expr: 'kernel.cpu.util.user', format: 'time_series' },
      { expr: 'kernel.cpu.util.sys', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Load average',
      datasource='$datasource',
      span=6,
      decimals=2,
      legend_alignAsTable=true,
      legend_min=true,
      legend_max=true,
      legend_current=true,
      legend_values=true,
    )
    .addTargets([
      { expr: 'kernel.all.load', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Memory Utilization',
      datasource='$datasource',
      span=6,
      format='kbytes',
      min=0,
      stack=true,
    )
    .addTargets([
      { expr: 'mem.util.free', format: 'time_series' },
      { expr: 'mem.util.cached', format: 'time_series' },
      { expr: 'mem.physmem', format: 'time_series' },
    ])
    .addSeriesOverride({
      "alias": "/physmem/",
      "fill": 0,
      "linewidth": 2,
      "stack": false
    })
  )
  .addPanel(
    grafana.graphPanel.new(
      'Disk Utilization',
      datasource='$datasource',
      span=6,
      format='percent',
      min=0,
    )
    .addTargets([
      { expr: 'disk.dev.util', format: 'time_series' },
    ])
  )
)

.addRow(
  grafana.row.new(
    title='CPU',
  )
  .addPanel(
    grafana.graphPanel.new(
      'Per-CPU busy (User)',
      datasource='$datasource',
      span=6,
      format='percentunit',
      min=0,
      max=1,
    )
    .addTargets([
        { expr: 'kernel.percpu.cpu.user', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Per-CPU busy (Sys)',
      datasource='$datasource',
      span=6,
      format='percentunit',
      min=0,
      max=1,
    )
    .addTargets([
        { expr: 'kernel.percpu.cpu.sys', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'User %',
      datasource='$datasource',
      span=3,
      format='percent',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'kernel.cpu.util.user', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Sys %',
      datasource='$datasource',
      span=3,
      format='percent',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'kernel.cpu.util.sys', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Interrupt %',
      datasource='$datasource',
      span=3,
      format='percent',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'kernel.cpu.util.intr', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Wait %',
      datasource='$datasource',
      span=3,
      format='percent',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'kernel.cpu.util.wait', format: 'time_series' },
    ])
  )
)

.addRow(
  grafana.row.new(
    title='Scheduler',
  )
  .addPanel(
    grafana.graphPanel.new(
      'Context switches per second',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'kernel.all.pswitch', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Runnable',
      datasource='$datasource',
      span=6,
      min=0,
      decimals=0,
      legend_show=false,
      staircase=true,
    )
    .addTargets([
        { expr: 'kernel.all.runnable', format: 'time_series' },
    ])
  )
)

.addRow(
  grafana.row.new(
    title='Memory',
  )
  .addPanel(
    grafana.graphPanel.new(
      'Used',
      datasource='$datasource',
      span=4,
      format='kbytes',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'mem.util.used', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Cached',
      datasource='$datasource',
      span=4,
      format='kbytes',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'mem.util.cached', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Free',
      datasource='$datasource',
      span=4,
      format='kbytes',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'mem.util.free', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Page fault rate',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'mem.vmstat.pgfault', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Hard fault rate',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'mem.vmstat.pgmajfault', format: 'time_series' },
    ])
  )
)

.addRow(
  grafana.row.new(
    title='Network',
  )
  .addPanel(
    grafana.graphPanel.new(
      'Network Throughput (In)',
      datasource='$datasource',
      span=6,
      format='Bps',
    )
    .addTargets([
        { expr: 'network.interface.in.bytes', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Network Throughput (Out)',
      datasource='$datasource',
      span=6,
      format='Bps',
    )
    .addTargets([
        { expr: 'network.interface.out.bytes', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Network Drops (In)',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      decimals=0,
    )
    .addTargets([
        { expr: 'network.interface.in.drops', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Network Drops (Out)',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      decimals=0,
    )
    .addTargets([
        { expr: 'network.interface.out.drops', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Network Packets (In)',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      decimals=0,
    )
    .addTargets([
        { expr: 'network.interface.in.packets', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Network Packets (Out)',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      decimals=0,
    )
    .addTargets([
        { expr: 'network.interface.out.packets', format: 'time_series' },
    ])
  )
)

.addRow(
  grafana.row.new(
    title='TCP',
  )
  .addPanel(
    grafana.graphPanel.new(
      'TCP Connections',
      datasource='$datasource',
      span=12,
      min=0,
      decimals=0,
      stack=true,
    )
    .addTargets([
        { expr: 'network.tcpconn.time_wait', format: 'time_series' },
        { expr: 'network.tcpconn.established', format: 'time_series' },
        { expr: 'network.tcpconn.close_wait', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'TCP Timeouts',
      datasource='$datasource',
      span=3,
      min=0,
      decimals=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'network.tcp.timeouts', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'TCP Close-waits',
      datasource='$datasource',
      span=3,
      min=0,
      decimals=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'network.tcpconn.close_wait', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'TCP Time Wait',
      datasource='$datasource',
      span=3,
      min=0,
      decimals=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'network.tcpconn.time_wait', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'TCP Established',
      datasource='$datasource',
      span=3,
      min=0,
      decimals=0,
      legend_show=false,
    )
    .addTargets([
        { expr: 'network.tcpconn.established', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'TCP Listen Errors',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      decimals=0,
    )
    .addTargets([
        { expr: 'network.tcp.listendrops', format: 'time_series' },
        { expr: 'network.tcp.listenoverflows', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'TCP Retransmits',
      datasource='$datasource',
      span=6,
      format='ops',
      min=0,
      decimals=0,
    )
    .addTargets([
        { expr: 'network.tcp.retranssegs', format: 'time_series' },
        { expr: 'network.tcp.fastretrans', format: 'time_series' },
        { expr: 'network.tcp.slowstartretrans', format: 'time_series' },
        { expr: 'network.tcp.synretrans', format: 'time_series' },
    ])
  )
)

.addRow(
  grafana.row.new(
    title='Disk',
  )
  .addPanel(
    grafana.graphPanel.new(
      'Disk Latency',
      datasource='$datasource',
      span=6,
      format='percentunit',
      min=0,
    )
    .addTargets([
        { expr: 'disk.dev.read_rawactive', legendFormat: 'read $instance', format: 'time_series' },
        { expr: 'disk.dev.write_rawactive', legendFormat: 'write $instance', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Disk IOPS',
      datasource='$datasource',
      span=6,
      format='iops',
    )
    .addTargets([
        { expr: 'disk.dev.read', legendFormat: 'read $instance', format: 'time_series' },
        { expr: 'disk.dev.write', legendFormat: 'write $instance', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Disk Throughput',
      datasource='$datasource',
      span=6,
      format='KBs',
    )
    .addTargets([
        { expr: 'disk.dev.read_bytes', legendFormat: 'read $instance', format: 'time_series' },
        { expr: 'disk.dev.write_bytes', legendFormat: 'write $instance', format: 'time_series' },
    ])
  )
  .addPanel(
    grafana.graphPanel.new(
      'Disk Utilization',
      datasource='$datasource',
      span=6,
      format='percentunit',
      min=0,
      max=1,
    )
    .addTargets([
        { expr: 'disk.dev.avactive', format: 'time_series' },
    ])
  )
)
