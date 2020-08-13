local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import 'notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;
local notifyMeta = notifyGraph.meta;

local breadcrumbsPanel = import 'breadcrumbspanel/breadcrumbspanel.libsonnet';
local breadcrumbs = breadcrumbsPanel.breadcrumbs;

dashboard.new(
  title='Checklist CPU System Overview',
  uid='checklist-cpu-sys',
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
  breadcrumbs.new(
    title='',
    datasource='$vector_datasource',
  ), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 2,
  },
)
.addPanel(
  notifyPanel.new(
    title='CPU - Tasks taking a lot time in kernel-space',
    datasource='$vector_datasource',
    meta=notifyMeta.new(
      name='CPU - Tasks taking a lot time in kernel-space',
      description='CPU intensive tasks (kernel-space)',
      metrics=['hotproc.psinfo.stime'],
      urls=['https://access.redhat.com/articles/781993'],
      issues=['The hotproc.control.config does not have default setting and need to be root to set it. Can set it with: sudo pmstore hotproc.control.config \'cpuburn > 0.05\''],
    ),
    time_from='5m'
  ).addTargets([
    { expr: 'hotproc.psinfo.stime', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)