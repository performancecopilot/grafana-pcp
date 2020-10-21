local grafana = import 'grafonnet/grafana.libsonnet';
local notifyGraph = import '_notifygraphpanel.libsonnet';
local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-network-tx');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  notifyGraph.panel.new(
    title='Network TX - Saturation',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='network_tx_drops',
      operator='>',
      value=0.01
    ),
    meta=notifyGraph.meta.new(
      name='Network TX - Saturation',
      warning='Network packets are being dropped.',
      metrics=[
        notifyGraph.metric.new(
          'network.interface.out.drops',
          'network send drops from /proc/net/dev per network interface',
        ),
      ],
      derived=['network_tx_drops = rate(network.interface.out.drops)'],
      urls=['https://access.redhat.com/solutions/21301'],
      details='Packets maybe dropped if there is not enough room in the ring buffers',
      issues=['The URL mentions comparing the current ring buffer size to the max allowed and increase the ring buffer size, but PCP doesn\'t have metrics to provide ring buffer info, a 1% packet drop threshold might be too high.'],
      parents=parents,
    ),
  ).addTargets([
    { name: 'network_tx_drops', expr: 'rate(network.interface.out.drops)', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Network TX - errors',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='network_tx_errors',
      operator='>',
      value=0.01,
    ),
    meta=notifyGraph.meta.new(
      name='Network TX - errors',
      warning='Network errors are present.',
      metrics=[
        notifyGraph.metric.new(
          'network.interface.out.errors',
          'network send errors from /proc/net/dev per network interface',
        ),
      ],
      derived=['network_tx_errors = rate(network.interface.out.errors)'],
      urls=['https://access.redhat.com/solutions/518893'],
      details='In general the the operation of the network devices should be error free.',
      parents=parents,
    ),
  ).addTargets([
    { name: 'network_tx_errors', expr: 'rate(network.interface.out.errors)', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
