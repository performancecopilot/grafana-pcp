// Based on Will Cohen's PCP checklist dashboard

local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='CPU Utilization',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='CPU',
      warning='The speed of the CPU is limiting performance.',
      metrics=[
        troubleshootingPanel.metric.new(
          'kernel.percpu.cpu.idle', 'percpu idle CPU time metric from /proc/stat'
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'kernel.percpu.cpu.util.all',
          '1 - rate(kernel.percpu.cpu.idle)'
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='kernel.percpu.cpu.util.all',
        operator='>',
        value=0.85,
      ),
      urls=['https://access.redhat.com/articles/767563#cpu'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-cpu')],
    ),
  ).addTargets([
    { expr: '1 - rate(kernel.percpu.cpu.idle)', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Storage Utilization',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Storage',
      warning='Excessive waiting for storage.',
      description='Storage devices have queues for the IO requests for the device.  When the queue is empty the device is idle.  As the device utilization increases the amount of idle time drops and the avactive time increases. If the utilization is excessive and the device becomes saturated the time required to service IO request can become excessive.',
      metrics=[
        troubleshootingPanel.metric.new(
          'disk.dev.avactive', 'per-disk count of active time'
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='disk.dev.avactive',
        operator='>',
        value=0.85,
      ),
      urls=['https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html-single/Performance_Tuning_Guide/index.html#chap-Red_Hat_Enterprise_Linux-Performance_Tuning_Guide-Storage_and_File_Systems'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-storage')],
    ),
  ).addTargets([
    { expr: 'disk.dev.avactive', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Memory Utilization',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Memory',
      warning='Running low on available memory.',
      description='When there is little memory available the system will need to free up space when additional memory is requested.  The memory can be freed by removing cached files, flushing files to disk, and paging sections of memory to swap on storage devices.',
      metrics=[
        troubleshootingPanel.metric.new(
          'mem.util.available',
          'available memory from /proc/meminfo',
        ),
        troubleshootingPanel.metric.new(
          'mem.physmem',
          'total system memory metric reported by /proc/meminfo',
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'mem.ratio.available',
          'mem.util.available / mem.physmem'
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='mem.ratio.available',
        operator='<',
        value=0.10,
      ),
      urls=['https://access.redhat.com/articles/781733'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-memory')],
    ),
  ).addTargets([
    { expr: 'mem.util.available / mem.physmem', format: 'time_series', legendFormat: '$expr', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 24,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Network TX Utilization',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network TX',
      warning='Overly high ammount of network traffic sent.',
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
        value=0.85,
      ),
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-network-tx')],
    ),
  ).addTargets([
    { expr: 'rate(network.interface.out.bytes) / network.interface.baudrate', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 23,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Network RX Utilization',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='Network RX',
      warning='Overly high ammount of network traffic received.',
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
    y: 23,
    w: 12,
    h: 9,
  },
) + {
  revision: 3,
}
