local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import 'notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;

dashboard.new(
  title='Checklist CPU User Overview',
  uid='checklist-cpu-user',
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
    title='CPU - Tasks taking a lot time in user-space',
    datasource='$vector_datasource',
    time_from='5m'
  ).addTargets([
    { expr: "hotproc.psinfo.utime", format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 0,
    w: 12,
    h: 9
  },
)