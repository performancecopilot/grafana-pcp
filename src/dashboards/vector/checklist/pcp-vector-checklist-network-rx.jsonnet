local grafana = import 'grafonnet/grafana.libsonnet';
local notifyGraph = import '_notifygraphpanel.libsonnet';
local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-network-rx');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  notifyGraph.panel.new(
    title='Network RX - Saturation',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='network_rx_drops',
      operator='>',
      value=0.01,
    ),
    meta=notifyGraph.meta.new(
      name='Network RX - Saturation',
      warning='Network errors are present.',
      metrics=[
        notifyGraph.metric.new(
          'network.interface.in.drops',
          'network recv read drops from /proc/net/dev per network interface',
        ),
      ],
      urls=['https://access.redhat.com/solutions/21301'],
      derived=['network_rx_drops = rate(network.interface.in.drops)'],
      details='Packets maybe dropped if there is not enough room in the ring buffers.',
      issues=['The URL mentions comparing the current ring buffer size to the max allowed and increase the ring buffer size, but PCP doesn\'t have metrics to provide ring buffer info, a 1% packet drop threshold might be too high.'],
      parents=parents,
    ),
  ).addTargets([
    { name: 'network_rx_drops', expr: 'rate(network.interface.in.drops)', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Network RX - Errors',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='network_rx_errors',
      operator='>',
      value=0.01,
    ),
    meta=notifyGraph.meta.new(
      name='Network RX - Errors',
      warning='Networks rrrors are present.',
      metrics=[
        notifyGraph.metric.new(
          'network.interface.in.errors',
          'network recv read errors from /proc/net/dev per network interface',
        ),
      ],
      derived=['network_rx_errors = rate(network.interface.in.errors)'],
      urls=['https://access.redhat.com/solutions/518893'],
      details='In general the the operation of the network devices should be error free.',
      parents=parents,
    ),
  ).addTargets([
    { name: 'network_rx_errors', expr: 'rate(network.interface.in.errors)', format: 'time_series', legendFormat: '$instance' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Network RX - Queue too small',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='rxcpuqdropped',
      operator='>',
      value=0.01,
    ),
    meta=notifyGraph.meta.new(
      name='Network RX - Queue too small',
      warning='Per-cpu RX queue are filled to capacity and some RX packet are being dropped as a result.',
      metrics=[
        notifyGraph.metric.new(
          'network.softnet.dropped',
          'number of packets that were dropped because netdev_max_backlog was exceeded',
        ),
      ],
      derived=['rxcpuqdropped = rate(network.softnet.dropped)'],
      urls=['https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf', 'https://access.redhat.com/solutions/1241943'],
      details='Each processor in the machine has a queue that stores packets recieved by the Network Interface Card (NIC) but not yet processed by the Linux kernel network stack.  The size of each of the queues is specified by net.core.netdev_max_backlog.  If a queue has netdev_max_backlog entries in it, any additional packets received by the NIC are dropped rather than added to the already full queue.',
      parents=parents,
    ),
  ).addTargets([
    { name: 'rxcpudropped', expr: 'rate(network.softnet.dropped)', format: 'time_series', legendFormat: '$expr' },
  ]), gridPos={
    x: 12,
    y: 13,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Network RX - RX packet processing exceeding time quota',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='time_squeeze',
      operator='>',
      value=0.01,
    ),
    meta=notifyGraph.meta.new(
      name='Network RX - RX packet processing exceeding time quota',
      warning='The RX packet processing function had more work remaining when it ran out of time.',
      metrics=[
        notifyGraph.metric.new(
          'network.softnet.time_squeeze',
          'number of times ksoftirq ran out of netdev_budget or time slice with work remaining',
        ),
      ],
      derived=['time_squeeze = rate(network.softnet.time_squeeze)'],
      urls=['https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf', 'https://access.redhat.com/solutions/1241943'],
      details='There may be multiple packets waiting to be moved out of the NIC receive ring buffer.  For efficiency the processor will attempt to process multiple packets and empty the ring buffer in a single operation.  However, to avoid monopolizing the processor and excluding other tasks from running, the amount of time that the net_rx_action function is allowed to run is limited.  The net.core.netdev_budget sets an upper limit on how long net_rx_action can run regardless whether there are addition packets to process.  Having to do multiple net_rx_action calls to clear out the receive ring buffer can be less efficient and increase the latency for a packet to get to an application program.  Increasing the net.core.netdev_budget could avoid some of the inefficiency and latency.',
      parents=parents,
    ),
  ).addTargets([
    { name: 'time_squeeze', expr: 'rate(network.softnet.time_squeeze)', format: 'time_series', legendFormat: '$expr' },
  ]), gridPos={
    x: 0,
    y: 23,
    w: 12,
    h: 9
  },
)
