local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP bpftrace: System Analysis',
  tags=['pcp-bpftrace', 'eBPF'],
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
    'performancecopilot-bpftrace-datasource',
    'PCP bpftrace',
  )
)
.addPanel(
  grafana.text.new(
    'Installation Instructions',
    mode='markdown',
    content='This dashboards requires the [bpftrace PMDA](https://man7.org/linux/man-pages/man1/pmdabpftrace.1.html) to be installed and configured with *dynamic_scripts* enabled.',
  ), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 2,
  }
)
.addPanel(
  grafana.row.new(
    title='CPU'
  ), gridPos={
    x: 0,
    y: 2,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.heatmapPanel.new(
    'CPU usage',
    datasource='$datasource',
    dataFormat='tsbuckets',
    yBucketBound='middle',
    cards_cardPadding=0,
  )
  .addTargets([
    { expr: importstr 'tools/cpuwalk.bt', format: 'heatmap' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'syscall count',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
    { expr: importstr 'tools/syscall_count.bt', format: 'time_series', legendFormat: '$metric0' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 8,
  }
)

.addPanel(
  grafana.row.new(
    title='Scheduler'
  ), gridPos={
    x: 0,
    y: 11,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.heatmapPanel.new(
    'run queue latency',
    datasource='$datasource',
    dataFormat='tsbuckets',
    yBucketBound='upper',
    yAxis_format='µs',
    cards_cardPadding=0,
  )
  .addTargets([
    { expr: importstr 'tools/runqlat.bt', format: 'heatmap' },
  ]), gridPos={
    x: 0,
    y: 12,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.heatmapPanel.new(
    'run queue length',
    datasource='$datasource',
    dataFormat='tsbuckets',
    yBucketBound='upper',
    cards_cardPadding=0,
  )
  .addTargets([
    { expr: importstr 'tools/runqlen.bt', format: 'heatmap' },
  ]), gridPos={
    x: 12,
    y: 12,
    w: 12,
    h: 8,
  }
)

.addPanel(
  grafana.row.new(
    title='Disk'
  ), gridPos={
    x: 0,
    y: 20,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.heatmapPanel.new(
    'block I/O latency',
    datasource='$datasource',
    dataFormat='tsbuckets',
    yBucketBound='upper',
    yAxis_format='µs',
    cards_cardPadding=0,
  )
  .addTargets([
    { expr: importstr 'tools/biolatency.bt', format: 'heatmap' },
  ]), gridPos={
    x: 0,
    y: 21,
    w: 24,
    h: 8,
  }
)

.addPanel(
  grafana.row.new(
    title='Filesystem'
  ), gridPos={
    x: 0,
    y: 29,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'virtual file system calls',
    datasource='$datasource',
    format='ops',
    min=0,
    decimals=0,
  )
  .addTargets([
    { expr: importstr 'tools/vfscount.bt', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 30,
    w: 24,
    h: 8,
  }
)

.addPanel(
  grafana.row.new(
    title='Network'
  ), gridPos={
    x: 0,
    y: 38,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'trace TCP sessions',
    datasource='$datasource',
    styles=null,
  )
  .addTargets([
    { expr: importstr 'tools/tcplife.bt', format: 'csv_table' },
  ]), gridPos={
    x: 0,
    y: 39,
    w: 24,
    h: 8,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'trace TCP accept()',
    datasource='$datasource',
    styles=null,
  )
  .addTargets([
    { expr: importstr 'tools/tcpaccept.bt', format: 'csv_table' },
  ]) + {
    options: {
      sortBy: [{
        desc: true,
        displayName: 'TIME',
      }],
    },
  }, gridPos={
    x: 0,
    y: 47,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'trace TCP connect()',
    datasource='$datasource',
    styles=null,
  )
  .addTargets([
    { expr: importstr 'tools/tcpconnect.bt', format: 'csv_table' },
  ]) + {
    options: {
      sortBy: [{
        desc: true,
        displayName: 'TIME',
      }],
    },
  }, gridPos={
    x: 12,
    y: 47,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'trace TCP drops',
    datasource='$datasource',
    styles=null,
  )
  .addTargets([
    { expr: importstr 'tools/tcpdrop.bt', format: 'csv_table' },
  ]) + {
    options: {
      sortBy: [{
        desc: true,
        displayName: 'TIME',
      }],
    },
  }, gridPos={
    x: 0,
    y: 55,
    w: 12,
    h: 8,
  }
)
.addPanel(
  grafana.tablePanel.new(
    'trace TCP retransmits',
    datasource='$datasource',
    styles=null,
  )
  .addTargets([
    { expr: importstr 'tools/tcpretrans.bt', format: 'csv_table' },
  ]) + {
    options: {
      sortBy: [{
        desc: true,
        displayName: 'TIME',
      }],
    },
  }, gridPos={
    x: 12,
    y: 55,
    w: 12,
    h: 8,
  }
) + {
  revision: 2,
}
