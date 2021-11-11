local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-network-rx');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Saturation [# packet drops]',
    datasource='$datasource',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network RX - Saturation',
      warning='Network errors are present.',
      description='Packets maybe dropped if there is not enough room in the ring buffers.',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.interface.in.drops',
          'network recv read drops from /proc/net/dev per network interface',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network.interface.in.drops',
        operator='>',
        value=0.01,
      ),
      urls=['https://access.redhat.com/solutions/21301'],
      notes="The URL mentions comparing the current ring buffer size to the max allowed and increase the ring buffer size, but PCP doesn't have metrics to provide ring buffer info. A 1% packet drop threshold might be too high.",
      parents=parents,
    ),
  ).addTargets([
    { expr: 'network.interface.in.drops', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
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
      name='Network RX - Errors',
      warning='Networks errors are present.',
      description='In general the the operation of the network devices should be error free.',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.interface.in.errors',
          'network recv read errors from /proc/net/dev per network interface',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network.interface.in.errors',
        operator='>',
        value=0.01,
      ),
      urls=['https://access.redhat.com/solutions/518893'],
      parents=parents,
    ),
  ).addTargets([
    { expr: 'network.interface.in.errors', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 12,
    y: 13,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Queue too small',
    datasource='$datasource',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network RX - Queue too small',
      warning='Per-CPU RX queues are filled to capacity and some RX packets are being dropped as a result.',
      description='Each processor in the machine has a queue that stores packets recieved by the Network Interface Card (NIC) but not yet processed by the Linux kernel network stack.  The size of each of the queues is specified by net.core.netdev_max_backlog.  If a queue has netdev_max_backlog entries in it, any additional packets received by the NIC are dropped rather than added to the already full queue.',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.softnet.dropped',
          'number of packets that were dropped because netdev_max_backlog was exceeded',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network.softnet.dropped',
        operator='>',
        value=0.01,
      ),
      urls=['https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf', 'https://access.redhat.com/solutions/1241943'],
      parents=parents,
    ),
  ).addTargets([
    { expr: 'network.softnet.dropped', format: 'time_series', legendFormat: '$metric', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='packet processing exceeding time quota',
    datasource='$datasource',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network RX - RX packet processing exceeding time quota',
      warning='The RX packet processing function had more work remaining when it ran out of time.',
      description='There may be multiple packets waiting to be moved out of the NIC receive ring buffer.  For efficiency the processor will attempt to process multiple packets and empty the ring buffer in a single operation.  However, to avoid monopolizing the processor and excluding other tasks from running, the amount of time that the net_rx_action function is allowed to run is limited.  The net.core.netdev_budget sets an upper limit on how long net_rx_action can run regardless whether there are addition packets to process.  Having to do multiple net_rx_action calls to clear out the receive ring buffer can be less efficient and increase the latency for a packet to get to an application program.  Increasing the net.core.netdev_budget could avoid some of the inefficiency and latency.',
      metrics=[
        troubleshootingPanel.metric.new(
          'network.softnet.time_squeeze',
          'number of times ksoftirq ran out of netdev_budget or time slice with work remaining',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='network.softnet.time_squeeze',
        operator='>',
        value=0.01,
      ),
      urls=['https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf', 'https://access.redhat.com/solutions/1241943'],
      parents=parents,
    ),
  ).addTargets([
    { expr: 'network.softnet.time_squeeze', format: 'time_series', legendFormat: '$metric', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 12,
    y: 23,
    w: 12,
    h: 9,
  },
) + {
  revision: 2,
}
