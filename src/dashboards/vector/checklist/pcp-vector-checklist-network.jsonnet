local grafana = import 'grafonnet/grafana.libsonnet';
local notifyGraph = import '_notifygraphpanel.libsonnet';
local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-network');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  notifyGraph.panel.new(
    title='TX Utilization [%]',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='network_tx_bandwidth',
      operator='>',
      value=0.85
    ),
    meta=notifyGraph.meta.new(
      name='Network TX',
      warning='Overly high ammount of network trafic sent.',
      metrics=[
        notifyGraph.metric.new(
          'network.interface.out.bytes',
          'network send bytes from /proc/net/dev per network interface',
        ),
        notifyGraph.metric.new(
          'network.interface.baudrate',
          'interface speed in bytes per second',
        ),
      ],
      derived=['network_tx_bandwidth = rate(network.interface.out.bytes) / network.interface.baudrate'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-network-tx')],
    ),
  ).addTargets([
    { name: 'network_tx_bandwidth', expr: 'rate(network.interface.out.bytes) / network.interface.baudrate', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='RX Utilization [%]',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='network_rx_bandwidth',
      operator='>',
      value=0.85,
    ),
    meta=notifyGraph.meta.new(
      name='Network RX',
      warning='Overly high ammount of network trafic received.',
      metrics=[
        notifyGraph.metric.new(
          'network.interface.in.bytes',
          'network recv read bytes from /proc/net/dev per network interface',
        ),
        notifyGraph.metric.new(
          'network.interface.baudrate',
          'interface speed in bytes per second',
        ),
      ],
      derived=['network_rx_bandwidth = rate(network.interface.in.bytes) / network.interface.baudrate'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-network-rx')],
    ),
  ).addTargets([
    { name: 'network_rx_bandwidth', expr: 'rate(network.interface.in.bytes) / network.interface.baudrate', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
