local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import 'notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;
local notifyMeta = notifyGraph.meta;

local breadcrumbsPanel = import 'breadcrumbspanel/breadcrumbspanel.libsonnet';
local breadcrumbs = breadcrumbsPanel.breadcrumbs;

dashboard.new(
  title='Checklist Network RX Overview',
  uid='checklist-network-rx',
  editable=false,
  tags=['pcp-checklist'],
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
  breadcrumbs.new(
    title='',
    datasource='$vector_datasource',
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
      value=0.01,
    ),
    meta=notifyMeta.new(
      name='Network TX - Saturation',
      description='Network packets being dropped',
      metrics=['network.interface.out.drops'],
      derived=['network_tx_drops = rate(network.interface.out.drops)'],
      urls=['https://access.redhat.com/solutions/21301'],
      details='Packets may be dropped if there is not enough room in the ring buffers',
      issues=['The URL mentions comparing the current ring buffer size to the max allowed and increase the ring buffer size, but PCP doesn\'t have metrics to provide ring buffer info, a 1% packet drop threshold might be too high.'],
    ),
    time_from='5m'
  ).addTargets([
    { expr: 'rate(network.interface.out.drops)', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network RX - Saturation',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='network rx drops',
      metric='network_rx_drops',
      operator='>',
      value=0.01,
    ),
    meta=notifyMeta.new(
      name='Network RX - Saturation',
      description='Show network errors',
      metrics=['network.interface.in.drops'],
      urls=['https://access.redhat.com/solutions/21301'],
      derived=['network_rx_drops = rate(network.interface.in.drops)'],
      details='Packets maybe dropped if there is not enough room in the ring buffers.',
      issues=['The URL mentions comparing the current ring buffer size to the max allowed and increase the ring buffer size, but PCP doesn\'t have metrics to provide ring buffer info, a 1% packet drop threshold might be too high.'],
    ),
    time_from='5m'
  ).addTargets([
    { expr: 'rate(network.interface.in.drops)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network RX - Errors',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='network rx errors',
      metric='network_rx_errors', 
      operator='>',
      value=0.01,
    ),
    meta=notifyMeta.new(
      name='Network RX - Errors',
      description='Show network errors',
      metrics=['network.interface.in.errors'],
      derived=['network_rx_errors = rate(network.interface.in.errors)'],
      urls=['https://access.redhat.com/solutions/518893'],
      details='In general the the operation of the network devices should be error free.',
    ),
    time_from='5m'
  ).addTargets([
    { expr: 'rate(network.interface.in.errors)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 13,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network RX - Queue too small',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='rx cpu queue drop',
      metric='rxcpuqdropped',
      operator='>',
      value=0.01,
    ),
    meta=notifyMeta.new(
      name='Network RX - Queue too small',
      description='Per-cpu RX queue are filled to capacity and some RX packet are being dropped as a result',
      metrics=['network.softnet.dropped'],
      derived=['rxcpuqdropped = rate(network.softnet.dropped)'],
      urls=['https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf', 'https://access.redhat.com/solutions/1241943'],
      details='Each processor in the machine has a queue that stores packets recieved by the Network Interface Card (NIC) but not yet processed by the Linux kernel network stack.  The size of each of the queues is specified by net.core.netdev_max_backlog.  If a queue has netdev_max_backlog entries in it, any additional packets received by the NIC are dropped rather than added to the already full queue.',
    ),
    time_from='5m'
  ).addTargets([
    { expr: 'rate(network.softnet.dropped)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 13,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network RX - RX packet processing exceeding time quota',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='exceeded rx time budget',
      metric='time_squeeze',
      operator='>',
      value=0.01,
    ),
    meta=notifyMeta.new(
      name='Network RX - RX packet processing exceeding time quota',
      description='The RX packet processing function had more work remaining when it ran out of time',
      metrics=['network.softnet.time_squeeze'],
      derived=['time_squeeze = rate(network.softnet.time_squeeze)'],
      urls=['https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf', 'https://access.redhat.com/solutions/1241943'],
      details='There may be multiple packets waiting to be moved out of the NIC receive ring buffer.  For efficiency the processor will attempt to process multiple packets and empty the ring buffer in a single operation.  However, to avoid monopolizing the processor and excluding other tasks from running, the amount of time that the net_rx_action function is allowed to run is limited.  The net.core.netdev_budget sets an upper limit on how long net_rx_action can run regardless whether there are addition packets to process.  Having to do multiple net_rx_action calls to clear out the receive ring buffer can be less efficient and increase the latency for a packet to get to an application program.  Increasing the net.core.netdev_budget could avoid some of the inefficiency and latency.',
    ),
    time_from='5m'
  ).addTargets([
    { expr: 'rate(network.softnet.time_squeeze)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 23,
    w: 12,
    h: 9
  },
)