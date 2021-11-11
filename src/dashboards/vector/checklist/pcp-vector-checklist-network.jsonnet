local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-network');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='TX Utilization',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network TX',
      warning='Overly high ammount of network trafic sent.',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.interface.out.bytes',
          'network send bytes from /proc/net/dev per network interface',
        ),
        troubleshootingPanel.metric.new(
          'network.interface.baudrate',
          'interface speed in bytes per second',
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'network_tx_bandwidth',
          'rate(network.interface.out.bytes) / network.interface.baudrate'
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network_tx_bandwidth',
        operator='>',
        value=0.85
      ),
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-network-tx')],
    ),
  ).addTargets([
    { expr: 'rate(network.interface.out.bytes) / network.interface.baudrate', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='RX Utilization',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network RX',
      warning='Overly high ammount of network trafic received.',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.interface.in.bytes',
          'network recv read bytes from /proc/net/dev per network interface',
        ),
        troubleshootingPanel.metric.new(
          'network.interface.baudrate',
          'interface speed in bytes per second',
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'network_rx_bandwidth',
          'rate(network.interface.in.bytes) / network.interface.baudrate'
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network_rx_bandwidth',
        operator='>',
        value=0.85,
      ),
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-network-rx')],
    ),
  ).addTargets([
    { expr: 'rate(network.interface.in.bytes) / network.interface.baudrate', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9,
  },
) + {
  revision: 2,
}
