local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import 'notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;
local notifyMeta = notifyGraph.meta;

local breadcrumbsPanel = import 'breadcrumbspanel/breadcrumbspanel.libsonnet';

local overview = import 'overview.libsonnet';
local dashboardNode = overview.getNodeByUid('pcp-storage-overview');

dashboard.new(
  title=dashboardNode.title,
  uid=dashboardNode.uid,
  editable=false,
  tags=[overview.tag],
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
  breadcrumbsPanel.new()
  .addItems(
    overview.getNavigation(dashboardNode)
  ), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 2,
  },
)
.addPanel(
  notifyPanel.new(
    title='Storage - bandwidth',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='> 2.5GB/s',
      metric='disk.dm.bw',
      operator='>',
      value=2500,
    ),
    meta=notifyMeta.new(
      name='Storage - bandwidth',
      description='Saturating bandwidth of storage',
      metrics=['disk.dm.total'],
      derived=['disk.dm.bw = rate(disk.dm.total)'],
      details='There are maximum rates that data can be read from and written to a storage device which can present a bottleneck on performance',
      issues=['There does not seem to be a way to query storage devices for device\'s the max r/w bandwidthes, so there is not a way for checklist to have a predicate at the momement for this'],
    ),
    time_from='5m'
  ).addTargets([
    { name: 'disk.dm.bw', expr: 'rate(disk.dm.total)', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Storage - small blocks',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='< 0.5 Kbytes per iop',
      metric='disk.dm.avgsz',
      operator='<',
      value=0.5,
    ),
    meta=notifyMeta.new(
      name='Storage - small blocks',
      description='Excessively small sized operations for storage',
      metrics=['disk.dm.total_bytes', 'disk.dm.total'],
      derived=['disk.dm.avgsz = delta(disk.dm.total_bytes)/delta(disk.dm.total)'],
      details='Operations on storage devices provide higher bandwidth with larger operations.  For rotational media the cost of seek operation to access different data on device is much higher that the cost of streaming the same amount of data from single continous region.',
      issues=["The computation of avgiosz does not seem to be quite right and is dropped at times drom the display."],
    ),
    time_from='5m'
  ).addTargets([
    { name: 'disk.dm.avgsz', expr: 'delta(disk.dm.total_bytes)/delta(disk.dm.total)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
