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
local dashboardNode = overview.getNodeByUid('pcp-memory-swap-overview');

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
    title='Memory - Low system memory',
    datasource='$vector_datasource',
    meta=notifyMeta.new(
      name='Memory - Low system memory',
      metrics=[
        notifyMetric.new(
          'mem.util.free',
          'free memory metric from /proc/meminfo',
        ),
        notifyMetric.new(
          'mem.physmem',
          'total system memory metric reported by /proc/meminfo',
        ),
      ],
      derived=['mem.ratio.free = mem.util.free/mem.physmem'],
      urls=['https://access.redhat.com/solutions/406253'],
      parents=parents,
    ),
  ).addTargets([
    { name: 'mem.ratio.free', expr: 'mem.util.free/mem.physmem', format: 'time_series' },
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
      name='Memory - Low NUMA node memory',
      metrics=[
        notifyMetric.new(
          'mem.numa.util.free',
          'per-node free memory',
        ),
        notifyMetric.new(
          'mem.numa.util.total',
          'per-node total memory',
        ),
      ],
      derived=['mem.numa.ratio.free = mem.numa.util.free/mem.numa.util.total'],
      urls=['https://access.redhat.com/solutions/465463'],
      parents=parents,
    ),
  ).addTargets([
    { name: 'mem.numa.ratio.free', expr: 'mem.numa.util.free/mem.numa.util.total', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
