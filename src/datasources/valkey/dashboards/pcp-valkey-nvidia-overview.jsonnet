local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Valkey: Nvidia GPU Overview',
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
  grafana.statPanel.new(
    'Name',
    description='GPU card name',
    datasource='$datasource',
    unit='string',
  )
  .addTarget(
    { expr: 'nvidia.cardname{hostname == "$host"}',
    legendFormat: '$instance',
    format: 'time_series' },
  )
  {
    fieldConfig: {
      defaults: {
        color: {
          mode: 'fixed',
          fixedColor: 'green',
        },
      },
    },
  }
  {
    options: {
      reduceOptions: {
        value: 'allValues',
        calcs: ['lastNotNull'],
        fields: '/^gpu0$/',
        values: false,
      },
      textMode: 'value',
      colorMode: 'value',
    }
  }, gridPos={
    x: 0,
    y: 0,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.statPanel.new(
    'P-State',
    description='Performance state',
    datasource='$datasource',
    unit='string',
  )
  .addTarget(
    { expr: 'nvidia.perfstate{hostname == "$host"}',
    legendFormat: '$instance',
    format: 'time_series' },
  )
  {
    fieldConfig: {
      defaults: {
        color: {
          mode: 'fixed',
          fixedColor: 'green',
        },
      },
    },
  }
  {
    options: {
      reduceOptions: {
        value: 'allValues',
        calcs: ['lastNotNull'],
        fields: '/^gpu0$/',
        values: false,
      },
      textMode: 'value',
      colorMode: 'value',
    }
  }, gridPos={
    x: 3,
    y: 1,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'GPU % Active',
    datasource='$datasource',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { expr: 'nvidia.gpuactive{hostname == "$host"}', legendFormat: '$metric', format: 'gauge' },
  ]), gridPos={
    x: 6,
    y: 5,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'Temperature',
    datasource='$datasource',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { expr: 'nvidia.temperature{hostname == "$host"}', legendFormat: '$metric', format: 'gauge' },
  ]), gridPos={
    x: 9,
    y: 5,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'Power Draw %',
    datasource='$datasource',
    unit='si:mW',
    min=0,
    max=500000,
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 240000},
    {color: 'red', value: 280000}
  ])
  .addTargets([
    { expr: 'nvidia.power{hostname == "$host"}', legendFormat: '$metric', format: 'gauge' },
  ]), gridPos={
    x: 12,
    y: 5,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Energy',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.energy{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 15,
    y: 5,
    w: 9,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'GPU Active',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.gpuactive{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 6,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    '% Memory Used',
    datasource='$datasource',
    unit='percent',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { refID: 'A', expr: 'nvidia.memused{hostname == "$host"}', legendFormat: '$instance', format: 'gauge', hide: true },
    { refID: 'B', expr: 'nvidia.memtotal{hostname == "$host"}', legendFormat: '$instance', format: 'gauge', hide: true },
    { refID: 'C', type: 'math', expression: '$A / $B * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ]), gridPos={
    x: 6,
    y: 6,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    '% Memory Free',
    datasource='$datasource',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { expr: 'nvidia.memfree{hostname == "$host"}', legendFormat: '$instance', format: 'gauge', hide: true},
    { refID: 'B', expr: 'nvidia.memtotal{hostname == "$host"}', legendFormat: '$instance', format: 'gauge', hide: true },
    { refID: 'C', type: 'math', expression: '$A / $B * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ]), gridPos={
    x: 9,
    y: 6,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'Fan Speed %',
    datasource='$datasource',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { expr: 'nvidia.fanspeed{hostname == "$host"}', legendFormat: '$metric', format: 'gauge' },
  ]), gridPos={
    x: 12,
    y: 6,
    w: 3,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'GPU Utilization Accumulation',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.gpuutilaccum{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 15,
    y: 6,
    w: 9,
    h: 6,
  }
)
.addPanel(
  grafana.row.new(
    title='Memory'
  ), gridPos={
    x: 0,
    y: 12,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Memory Util Accumulation',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.memutilaccum{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 12,
    w: 8,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Memory Active',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.memactive{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 8,
    y: 12,
    w: 8,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Memory Used',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.memused{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 16,
    y: 12,
    w: 8,
    h: 6,
  }
)
.addPanel(
  grafana.row.new(
    title='Procs'
  ), gridPos={
    x: 0,
    y: 18,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Compute GPU Active',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.compute.gpuactive{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 18,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Compute Memory Active',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.compute.memactive{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 6,
    y: 18,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Compute Memory Used',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.compute.memused{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 18,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Compute Running',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.compute.running{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 18,
    y: 18,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.row.new(
    title='Graphics'
  ), gridPos={
    x: 0,
    y: 24,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Graphics GPU Active',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.graphics.gpuactive{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 24,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Graphics Memory Active',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.graphics.memactive{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 6,
    y: 24,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Graphics Memory Used',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.graphics.memused{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 24,
    w: 6,
    h: 6,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Proc Graphics Running',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'nvidia.proc.graphics.running{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 18,
    y: 24,
    w: 6,
    h: 6,
  }
)
