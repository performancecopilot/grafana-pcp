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
  title='Checklist Memory Swap Overview',
  uid='checklist-memory-swap',
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
    title='Memory - Low system memory',
    datasource='$vector_datasource',
    meta=notifyMeta.new(
      name='Memory - Low system memory',
      description='Not enough memory in the system resulting in data being moved between memory and storage',
      metrics=['mem.ratio.free', 'mem.physmem'],
      derived=['mem.ratio.free = mem.util.free/mem.physmem']
    ),
    time_from='5m',
  ).addTargets([
    { expr: 'mem.util.free/mem.physmem', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Memory - Low NUMA node memory',
    datasource='$vector_datasource',
    meta=notifyMeta.new(
      name='Memory - low NUMA node memory',
      description='Not enough memory on or more NUMA nodes resulting in data being moved between memory and storage',
      metrics=['mem.numa.util.free', 'mem.numa.util.total'],
      derived=['mem.numa.ratio.free = mem.numa.util.free/mem.numa.util.total'],
      urls=['https://access.redhat.com/solutions/406253', 'https://access.redhat.com/solutions/465463']
    ),
    time_from='5m'
  ).addTargets([
    { expr: 'mem.numa.util.free/mem.numa.util.total', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)