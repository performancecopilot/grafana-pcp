local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import 'notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;

dashboard.new(
  title='Checklist CPU Overview',
  uid='checklist-cpu',
  editable=false,
  tags=['pcp-checklist'],
  time_from='now-5m',
  time_to='now',
  refresh='1s',
  timepicker=grafana.timepicker.new(
    refresh_intervals=['1s', '2s', '5s', '10s'],
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
  notifyPanel.new(
    title='CPU - User Time',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      name='CPU - User Time',
      label='processors 80% in application code',
      description='The CPU is executing application code',
      operator='>',
      value=0.8,
      urls=['https://access.redhat.com/articles/767563#cpu']
    ),
    time_from='5m'
  ).addTargets([
    { expr: "rate(kernel.percpu.cpu.user)", format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 0,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='CPU - System Time',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      name='CPU - System Time',
      label='processors 20% in kernel',
      description='The CPU is executing system code',
      operator='>',
      value=0.2,
      urls=['https://access.redhat.com/articles/767563#cpu'],
    ),
    time_from='5m'
  ).addTargets([
    { expr: "rate(kernel.percpu.cpu.sys)", format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 0,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='CPU - Kernel SamePage Merging Daemon (ksmd)',
    datasource='$vector_datasource',
    time_from='5m'
  ).addTargets([
    { expr: "rate(hotproc.psinfo.utime)+rate(hotproc.psinfo.stime)", format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 9,
    w: 12,
    h: 9
  },
)
