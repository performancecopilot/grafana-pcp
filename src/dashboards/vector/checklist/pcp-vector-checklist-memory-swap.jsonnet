local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-memory-swap');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Available system memory',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Memory - Low system memory',
      metrics=[
        troubleshootingPanel.metric.new(
          'mem.util.free',
          'free memory metric from /proc/meminfo',
        ),
        troubleshootingPanel.metric.new(
          'mem.physmem',
          'total system memory metric reported by /proc/meminfo',
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'mem.ratio.free',
          'mem.util.free / mem.physmem'
        ),
      ],
      urls=['https://access.redhat.com/solutions/406253'],
      parents=parents,
    ),
  ).addTargets([
    { expr: 'mem.util.free / mem.physmem', format: 'time_series', legendFormat: '$expr', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Available NUMA node memory',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Memory - Low NUMA node memory',
      metrics=[
        troubleshootingPanel.metric.new(
          'mem.numa.util.free',
          'per-node free memory',
        ),
        troubleshootingPanel.metric.new(
          'mem.numa.util.total',
          'per-node total memory',
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'mem.numa.ratio.free',
          'mem.numa.util.free / mem.numa.util.total'
        ),
      ],
      urls=['https://access.redhat.com/solutions/465463'],
      parents=parents,
    ),
  ).addTargets([
    { expr: 'mem.numa.util.free / mem.numa.util.total', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9,
  },
) + {
  revision: 3,
}
