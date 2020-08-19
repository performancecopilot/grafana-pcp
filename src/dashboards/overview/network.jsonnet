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
local dashboardNode = overview.getNodeByUid('pcp-network-overview');

local navigation = overview.getNavigation(dashboardNode);
local parents = overview.getParentNodes(dashboardNode);
local children = overview.getChildrenNodes(dashboardNode);

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
    title='Network TX',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='network_tx_bandwidth',
      operator='>',
      value=0.85
    ),
    meta=notifyMeta.new(
      name='Network TX',
      warning='Overly high ammount of network trafic sent.',
      metrics=[
        notifyMetric.new(
          'network.interface.out.bytes',
          'network send bytes from /proc/net/dev per network interface',
        ),
        notifyMetric.new(
          'network.interface.baudrate',
          'interface speed in bytes per second',
        ),
      ],
      derived=['network_tx_bandwidth = rate(network.interface.out.bytes)/network.interface.baudrate'],
      children=[overview.getNodeByUid('pcp-network-tx-overview', children)],
      parents=parents,
    ),
  ).addTargets([
    { name: 'network_tx_bandwidth', expr: 'rate(network.interface.out.bytes)/network.interface.baudrate', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network RX',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='network_rx_bandwidth',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='Network RX',
      warning='Overly high ammount of network trafic received.',
      metrics=[
        notifyMetric.new(
          'network.interface.in.bytes',
          'network recv read bytes from /proc/net/dev per network interface',
        ),
        notifyMetric.new(
          'network.interface.baudrate',
          'interface speed in bytes per second',
        ),
      ],
      derived=['network_rx_bandwidth = rate(network.interface.in.bytes)/network.interface.baudrate'],
      children=[overview.getNodeByUid('pcp-network-rx-overview', children)],
      parents=parents,
    ),
  ).addTargets([
    { name: 'network_tx_errors', expr: 'rate(network.interface.out.errors)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
