local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-network-tx');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Saturation [# packet drops]',
    datasource='$datasource',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network TX - Saturation',
      warning='Network packets are being dropped.',
      description='Packets maybe dropped if there is not enough room in the ring buffers',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.interface.out.drops',
          'network send drops from /proc/net/dev per network interface',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network.interface.out.drops',
        operator='>',
        value=0.01
      ),
      urls=['https://access.redhat.com/solutions/21301'],
      notes="The URL mentions comparing the current ring buffer size to the max allowed and increase the ring buffer size, but PCP doesn't have metrics to provide ring buffer info, a 1% packet drop threshold might be too high.",
      parents=parents,
    ),
  ).addTargets([
    { expr: 'network.interface.out.drops', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Errors',
    datasource='$datasource',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network TX - errors',
      warning='Network errors are present.',
      description='In general the the operation of the network devices should be error free.',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.interface.out.errors',
          'network send errors from /proc/net/dev per network interface',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network.interface.out.errors',
        operator='>',
        value=0.01,
      ),
      urls=['https://access.redhat.com/solutions/518893'],
      parents=parents,
    ),
  ).addTargets([
    { expr: 'network.interface.out.errors', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9,
  },
)
