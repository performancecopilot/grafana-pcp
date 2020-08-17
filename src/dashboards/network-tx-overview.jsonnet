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
local dashboardNode = overview.getNodeByUid('pcp-network-tx-overview');

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
    title='Network TX - Saturation',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='network tx drops',
      metric='network_tx_drops',
      operator='>',
      value=0.01
    ),
    meta=notifyMeta.new(
      name='Network TX - Saturation',
      description='Network packets being dropped',
      metrics=['network.interface.out.drops'],
      derived=['network_tx_drops = rate(network.interface.out.drops)'],
      urls=['https://access.redhat.com/solutions/21301'],
      details='Packets maybe dropped if there is not enough room in the ring buffers',
      issues=['The URL mentions comparing the current ring buffer size to the max allowed and increase the ring buffer size, but PCP doesn\'t have metrics to provide ring buffer info, a 1% packet drop threshold might be too high.'],
    ),
    time_from='5m'
  ).addTargets([
    { name: 'network_tx_drops', expr: 'rate(network.interface.out.drops)', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network TX - errors',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='network tx drops',
      metric='network_tx_errors',
      operator='>',
      value=0.01,
    ),
    meta=notifyMeta.new(
      name='Network TX - errors',
      description='Show network errors',
      metrics=['network.interface.out.errors'],
      derived=['network_tx_errors = rate(network.interface.out.errors)'],
      urls=['https://access.redhat.com/solutions/518893'],
      details='In general the the operation of the network devices should be error free.',
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
