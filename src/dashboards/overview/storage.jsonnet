local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import '../notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;
local notifyMeta = notifyGraph.meta;
local notifyMetric = notifyGraph.metric;

local breadcrumbsPanel = import '../breadcrumbspanel/breadcrumbspanel.libsonnet';

local overview = import 'shared.libsonnet';
local dashboardNode = overview.getNodeByUid('pcp-storage-overview');

local navigation = overview.getNavigation(dashboardNode);
local parents = overview.getParentNodes(dashboardNode);

dashboard.new(
  title=dashboardNode.title,
  uid=dashboardNode.uid,
  description=dashboardNode.name,
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
  .addItems(navigation), gridPos={
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
      metric='disk.dm.bw',
      operator='>',
      value=2500,
    ),
    meta=notifyMeta.new(
      name='Storage - bandwidth',
      warning='Overly high data saturation rate.',
      metrics=[
        notifyMetric.new(
          'disk.dm.total',
          'per-device-mapper device total (read+write) operations',
        ),
      ],
      derived=['disk.dm.bw = rate(disk.dm.total)'],
      details='There are maximum rates that data can be read from and written to a storage device which can present a bottleneck on performance',
      parents=parents,
    ),
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
      metric='disk.dm.avgsz',
      operator='<',
      value=0.5,
    ),
    meta=notifyMeta.new(
      name='Storage - small blocks',
      warning='Excessively small sized operations for storage.',
      metrics=[
        notifyMetric.new(
          'disk.dm.total_bytes',
          'per-device-mapper device count of total bytes read and written'
        ),
        notifyMetric.new(
          'disk.dm.total',
          'per-device-mapper device total (read+write) operations',
        ),
      ],
      derived=['disk.dm.avgsz = delta(disk.dm.total_bytes)/delta(disk.dm.total)'],
      details='Operations on storage devices provide higher bandwidth with larger operations.  For rotational media the cost of seek operation to access different data on device is much higher that the cost of streaming the same amount of data from single continous region.',
      parents=parents,
    ),
  ).addTargets([
    { name: 'disk.dm.avgsz', expr: 'delta(disk.dm.total_bytes)/delta(disk.dm.total)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
