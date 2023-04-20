local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Prometheus Host Overview',
  tags=['prometheus'],
  time_from='now-6h',
  time_to='now',
  refresh='10s',
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'prometheus',
    'Prometheus',
  )
)
.addTemplate(
  grafana.template.new(
    'host',
    '$datasource',
    'label_values(hostname)',
    refresh='load',
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
    { expr: 'kernel_all_load{hostname="$host"}', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 0,
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
    { expr: 'mem_util_free{hostname="$host"}', legendFormat: '{{__name__}}' },
    { expr: 'mem_util_cached{hostname="$host"}', legendFormat: '{{__name__}}' },
    { expr: 'mem_physmem{hostname="$host"}', legendFormat: '{{__name__}}' },
  ])
  .addSeriesOverride({
    alias: '/physmem/',
    fill: 0,
    linewidth: 2,
    stack: false,
  }), gridPos={
    x: 12,
    y: 1,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='CPU'
  ), gridPos={
    x: 0,
    y: 8,
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
    { expr: 'rate(kernel_percpu_cpu_user{hostname="$host"}[$__rate_interval])/1000', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 0,
    y: 9,
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
    { expr: 'rate(kernel_percpu_cpu_sys{hostname="$host"}[$__rate_interval])/1000', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 12,
    y: 9,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Scheduler'
  ), gridPos={
    x: 0,
    y: 16,
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
    { expr: 'rate(kernel_all_pswitch{hostname="$host"}[$__rate_interval])', legendFormat: 'kernel_all_pswitch' },
  ]), gridPos={
    x: 0,
    y: 17,
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
    { expr: 'kernel_all_runnable{hostname="$host"}', legendFormat: '{{__name__}}' },
  ]), gridPos={
    x: 12,
    y: 17,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Memory'
  ), gridPos={
    x: 0,
    y: 24,
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
    { expr: 'mem_util_used{hostname="$host"}', legendFormat: '{{__name__}}' },
  ]), gridPos={
    x: 0,
    y: 25,
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
    { expr: 'mem_util_cached{hostname="$host"}', legendFormat: '{{__name__}}' },
  ]), gridPos={
    x: 8,
    y: 25,
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
    { expr: 'mem_util_free{hostname="$host"}', legendFormat: '{{__name__}}' },
  ]), gridPos={
    x: 16,
    y: 25,
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
    { expr: 'rate(mem_vmstat_pgfault{hostname="$host"}[$__rate_interval])', legendFormat: 'mem_vmstat_pgfault' },
  ]), gridPos={
    x: 0,
    y: 32,
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
    { expr: 'rate(mem_vmstat_pgmajfault{hostname="$host"}[$__rate_interval])', legendFormat: 'mem_vmstat_pgmajfault' },
  ]), gridPos={
    x: 12,
    y: 32,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Network'
  ), gridPos={
    x: 0,
    y: 39,
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
    { expr: 'rate(network_interface_in_bytes{hostname="$host"}[$__rate_interval])', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 0,
    y: 40,
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
    { expr: 'rate(network_interface_out_bytes{hostname="$host"}[$__rate_interval])', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 12,
    y: 40,
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
    { expr: 'rate(network_interface_in_drops{hostname="$host"}[$__rate_interval])', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 0,
    y: 47,
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
    { expr: 'rate(network_interface_out_drops{hostname="$host"}[$__rate_interval])', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 12,
    y: 47,
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
    { expr: 'rate(network_interface_in_packets{hostname="$host"}[$__rate_interval])', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 0,
    y: 54,
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
    { expr: 'rate(network_interface_out_packets{hostname="$host"}[$__rate_interval])', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 12,
    y: 54,
    w: 12,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='TCP'
  ), gridPos={
    x: 0,
    y: 61,
    w: 24,
    h: 1,
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
    { expr: 'rate(network_tcp_timeouts{hostname="$host"}[$__rate_interval])', legendFormat: 'network_tcp_timeouts' },
  ]), gridPos={
    x: 0,
    y: 62,
    w: 12,
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
    { expr: 'rate(network_tcp_listendrops{hostname="$host"}[$__rate_interval])', legendFormat: 'network_tcp_listendrops' },
    { expr: 'rate(network_tcp_listenoverflows{hostname="$host"}[$__rate_interval])', legendFormat: 'network_tcp_listenoverflows' },
  ]), gridPos={
    x: 12,
    y: 62,
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
    { expr: 'rate(network_tcp_retranssegs{hostname="$host"}[$__rate_interval])', legendFormat: 'network_tcp_retranssegs' },
    { expr: 'rate(network_tcp_fastretrans{hostname="$host"}[$__rate_interval])', legendFormat: 'network_tcp_fastretrans' },
    { expr: 'rate(network_tcp_slowstartretrans{hostname="$host"}[$__rate_interval])', legendFormat: 'network_tcp_slowstartretrans' },
    { expr: 'rate(network_tcp_synretrans{hostname="$host"}[$__rate_interval])', legendFormat: 'network_tcp_synretrans' },
  ]), gridPos={
    x: 0,
    y: 69,
    w: 24,
    h: 7,
  }
)

.addPanel(
  grafana.row.new(
    title='Disk'
  ), gridPos={
    x: 0,
    y: 76,
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
    { expr: 'rate(disk_dev_read_rawactive{hostname="$host"}[$__rate_interval])/1000', legendFormat: 'read {{instname}}' },
    { expr: 'rate(disk_dev_write_rawactive{hostname="$host"}[$__rate_interval])/1000', legendFormat: 'write {{instname}}' },
  ]), gridPos={
    x: 0,
    y: 77,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk IOPS',
    datasource='$datasource',
    format='iops',
  )
  .addTargets([
    { expr: 'rate(disk_dev_read{hostname="$host"}[$__rate_interval])', legendFormat: 'read {{instname}}' },
    { expr: 'rate(disk_dev_write{hostname="$host"}[$__rate_interval])', legendFormat: 'write {{instname}}' },
  ]), gridPos={
    x: 12,
    y: 77,
    w: 12,
    h: 7,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Disk Throughput',
    datasource='$datasource',
    format='KiBs',
  )
  .addTargets([
    { expr: 'rate(disk_dev_read_bytes{hostname="$host"}[$__rate_interval])', legendFormat: 'read {{instname}}' },
    { expr: 'rate(disk_dev_write_bytes{hostname="$host"}[$__rate_interval])', legendFormat: 'write {{instname}}' },
  ]), gridPos={
    x: 0,
    y: 84,
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
    { expr: 'rate(disk_dev_avactive{hostname="$host"}[$__rate_interval])/1000', legendFormat: '{{instname}}' },
  ]), gridPos={
    x: 12,
    y: 84,
    w: 12,
    h: 7,
  }
) + {
  revision: 3,
}
