local grafana = import 'grafonnet/grafana.libsonnet';
local notifyGraph = import '_notifygraphpanel.libsonnet';
local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-memory-swap');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  notifyGraph.panel.new(
    title='Memory - Low system memory',
    datasource='$datasource',
    meta=notifyGraph.meta.new(
      name='Memory - Low system memory',
      metrics=[
        notifyGraph.metric.new(
          'mem.util.free',
          'free memory metric from /proc/meminfo',
        ),
        notifyGraph.metric.new(
          'mem.physmem',
          'total system memory metric reported by /proc/meminfo',
        ),
      ],
      derived=['mem.ratio.free = mem.util.free / mem.physmem'],
      urls=['https://access.redhat.com/solutions/406253'],
      parents=parents,
    ),
  ).addTargets([
    { name: 'mem.ratio.free', expr: 'mem.util.free / mem.physmem', format: 'time_series', legendFormat: '$expr' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Memory - Low NUMA node memory',
    datasource='$datasource',
    meta=notifyGraph.meta.new(
      name='Memory - Low NUMA node memory',
      metrics=[
        notifyGraph.metric.new(
          'mem.numa.util.free',
          'per-node free memory',
        ),
        notifyGraph.metric.new(
          'mem.numa.util.total',
          'per-node total memory',
        ),
      ],
      derived=['mem.numa.ratio.free = mem.numa.util.free / mem.numa.util.total'],
      urls=['https://access.redhat.com/solutions/465463'],
      parents=parents,
    ),
  ).addTargets([
    { name: 'mem.numa.ratio.free', expr: 'mem.numa.util.free / mem.numa.util.total', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
