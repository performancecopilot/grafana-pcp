local grafana = import 'grafonnet/grafana.libsonnet';
local notifyGraph = import '_notifygraphpanel.libsonnet';
local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-storage');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  notifyGraph.panel.new(
    title='IOPS',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='disk.dev.total',
      operator='>',
      value=2500,
    ),
    meta=notifyGraph.meta.new(
      name='Storage - IOPS',
      warning='Overly high data saturation rate.',
      metrics=[
        notifyGraph.metric.new(
          'disk.dev.total',
          'per-disk total (read+write) operations',
        ),
      ],
      details='There are maximum rates that data can be read from and written to a storage device which can present a bottleneck on performance',
      parents=parents,
    ),
  ).addTargets([
    { expr: 'disk.dev.total', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Average block size [KiB]',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='disk.dev.avgsz',
      operator='<',
      value=0.5,
    ),
    meta=notifyGraph.meta.new(
      name='Storage - Average block size',
      warning='Excessively small sized operations for storage.',
      metrics=[
        notifyGraph.metric.new(
          'disk.dev.total_bytes',
          'per-disk count of total bytes read and written'
        ),
        notifyGraph.metric.new(
          'disk.dev.total',
          'per-disk total (read+write) operations',
        ),
      ],
      derived=['disk.dev.avgsz = delta(disk.dev.total_bytes) / delta(disk.dev.total)'],
      details='Operations on storage devices provide higher bandwidth with larger operations.  For rotational media the cost of seek operation to access different data on device is much higher that the cost of streaming the same amount of data from single continous region.',
      parents=parents,
    ),
  ).addTargets([
    { name: 'disk.dev.avgsz', expr: 'delta(disk.dev.total_bytes) / delta(disk.dev.total)', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
