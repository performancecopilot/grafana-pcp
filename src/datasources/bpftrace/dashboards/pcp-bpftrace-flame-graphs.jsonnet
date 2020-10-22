local grafana = import 'grafonnet/grafana.libsonnet';

local flameGraph(
  title,
  datasource=null,
) = {
  title: title,
  type: 'pcp-flamegraph-panel',
  datasource: datasource,

  _nextTarget:: 0,
  addTarget(target):: self {
    local nextTarget = super._nextTarget,
    _nextTarget: nextTarget + 1,
    targets+: [target { refId: std.char(std.codepoint('A') + nextTarget) }],
  },
  addTargets(targets):: std.foldl(function(p, t) p.addTarget(t), targets, self),
};

grafana.dashboard.new(
  'PCP bpftrace: Flame Graphs',
  tags=['pcp-bpftrace', 'eBPF'],
  time_from='now-5s',
  time_to='now',
  refresh='1s',
  timepicker=grafana.timepicker.new(
    refresh_intervals=['1s', '2s', '5s', '10s'],
  ),
  editable=true,
)
.addTemplate(
  grafana.template.datasource(
    'bpftrace_datasource',
    'pcp-bpftrace-datasource',
    'PCP bpftrace',
    hide='value',
  )
)
.addTemplate(
  grafana.template.datasource(
    'vector_datasource',
    'pcp-vector-datasource',
    'PCP Vector',
    hide='value',
  )
)

.addPanel(
  grafana.graphPanel.new(
    'CPU Utilization',
    datasource='$vector_datasource',
    format='percent',
    min=0,
    stack=true,
    legend_show=false,
    time_from='5m',
  )
  .addTargets([
    { expr: 'kernel.cpu.util.user', format: 'time_series' },
    { expr: 'kernel.cpu.util.sys', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 4,
  }
)
.addPanel(
  flameGraph(
    'Kernel Stacks',
    datasource='$bpftrace_datasource',
  )
  .addTargets([
    { expr: importstr 'tools/kstacks.bt', format: 'flamegraph' },
  ]), gridPos={
    x: 0,
    y: 4,
    w: 24,
    h: 9,
  }
)
.addPanel(
  flameGraph(
    'User Stacks',
    datasource='$bpftrace_datasource',
  )
  .addTargets([
    { expr: importstr 'tools/ustacks.bt', format: 'flamegraph' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 24,
    h: 9,
  }
)
