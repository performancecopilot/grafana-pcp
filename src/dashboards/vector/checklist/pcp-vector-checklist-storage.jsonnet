local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-storage');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='IOPS',
    datasource='$datasource',
    unit='iops',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Storage - IOPS',
      warning='Overly high data saturation rate.',
      description='There are maximum rates that data can be read from and written to a storage device which can present a bottleneck on performance',
      metrics=[
        troubleshootingPanel.metric.new(
          'disk.dev.total',
          'per-disk total (read+write) operations',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='disk.dev.total',
        operator='>',
        value=2500,
      ),
      parents=parents,
    ),
  ).addTargets([
    { expr: 'disk.dev.total', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Average block size',
    datasource='$datasource',
    unit='KiB',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Storage - Average block size',
      warning='Excessively small sized operations for storage.',
      description='Operations on storage devices provide higher bandwidth with larger operations.  For rotational media the cost of seek operation to access different data on device is much higher that the cost of streaming the same amount of data from single continous region.',
      metrics=[
        troubleshootingPanel.metric.new(
          'disk.dev.total_bytes',
          'per-disk count of total bytes read and written'
        ),
        troubleshootingPanel.metric.new(
          'disk.dev.total',
          'per-disk total (read+write) operations',
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'disk.dev.avgsz',
          'delta(disk.dev.total_bytes) / delta(disk.dev.total)'
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='disk.dev.avgsz',
        operator='<',
        value=0.5,
      ),
      parents=parents,
    ),
  ).addTargets([
    { expr: 'delta(disk.dev.total_bytes) / delta(disk.dev.total)', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9,
  },
) + {
  revision: 2,
}
