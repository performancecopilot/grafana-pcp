local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import 'notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;
local notifyMeta = notifyGraph.meta;

local breadcrumbsPanel = import 'breadcrumbspanel/breadcrumbspanel.libsonnet';

local overview = import 'overview.libsonnet';
local dashboardNode = overview.getNodeByUid('pcp-network-overview');

dashboard.new(
  title=dashboardNode.title,
  uid=dashboardNode.uid,
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
  .addItems(
    overview.getNavigation(dashboardNode)
  ), gridPos={
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
      label='network tx bandwidth',
      metric='network_tx_bandwidth',
      operator='>',
      value=0.85
    ),
    meta=notifyMeta.new(
      name='Network TX',
      description='Amount of network trafic sent',
      metrics=['network.interface.out.bytes','network.interface.baudrate'],
      derived=['network_tx_bandwidth = rate(network.interface.out.bytes)/network.interface.baudrate'],
    ),
    time_from='5m'
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
      label='network rx bandwidth',
      metric='network_rx_bandwidth',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='Network RX',
      description='Amount of network trafic received',
      metrics=['network.interface.in.bytes', 'network.interface.baudrate'],
      derived=['network_rx_bandwidth = rate(network.interface.in.bytes)/network.interface.baudrate'],
    ),
    time_from='5m'
  ).addTargets([
    { name: 'network_tx_errors', expr: 'rate(network.interface.out.errors)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
