local grafana = import 'grafonnet/grafana.libsonnet';
local notifyGraph = import '_notifygraphpanel.libsonnet';
local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  notifyGraph.panel.new(
    title='CPU',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='kernel.percpu.cpu.util.all',
      operator='>',
      value=0.85,
    ),
    meta=notifyGraph.meta.new(
      name='CPU',
      warning='The speed of the CPU is limiting performance.',
      metrics=[
        notifyGraph.metric.new(
          'kernel.percpu.cpu.idle', 'percpu idle CPU time metric from /proc/stat'
        )
      ],
      derived=['kernel.percpu.cpu.util.all = 1 - rate(kernel.percpu.cpu.idle)'],
      urls=['https://access.redhat.com/articles/767563#cpu'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-cpu')],
    ),
  ).addTargets([
    { name: 'kernel.percpu.cpu.util.all', expr: '1 - rate(kernel.percpu.cpu.idle)', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Storage',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='diskbusy',
      operator='>',
      value=0.85,
    ),
    meta=notifyGraph.meta.new(
      name='Storage',
      warning='Excessive waiting for storage.',
      metrics=[
        notifyGraph.metric.new(
          'disk.dm.avactive', 'per-device-mapper device count of active time'
        )
      ],
      derived=['diskbusy = rate(disk.dm.avactive)'],
      urls=['https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html-single/Performance_Tuning_Guide/index.html#chap-Red_Hat_Enterprise_Linux-Performance_Tuning_Guide-Storage_and_File_Systems'],
      details='Storage devices have queues for the IO requests for the device.  When the queue is empty the device is idle.  As the device utilization increases the amount of idle time drops and the avactive time increases. If the utilization is excessive and the device becomes saturated the time required to service IO request can become excessive.',
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-storage')],
    ),
  ).addTargets([
    { name: 'diskbusy', expr: 'rate(disk.dm.avactive)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Memory',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='mem.ratio.available',
      operator='<',
      value=0.10,
    ),
    meta=notifyGraph.meta.new(
      name='Memory',
      warning='Running low on available memory.',
      metrics=[
        notifyGraph.metric.new(
          'mem.util.available',
          'available memory from /proc/meminfo',
        ),
        notifyGraph.metric.new(
          'mem.physmem',
          'total system memory metric reported by /proc/meminfo',
        ),
      ],
      derived=['mem.ratio.available = mem.util.available / mem.physmem'],
      urls=['https://access.redhat.com/articles/781733'],
      details='When there is little memory available the system will need to free up space when additional memory is requested.  The memory can be freed by removing cached files, flushing files to disk, and paging sections of memory to swap on storage devices.',
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-memory')],
    ),
  ).addTargets([
    { name: 'mem.ratio.available', expr: 'mem.util.available / mem.physmem', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Network TX',
    datasource='$datasource',
    threshold=notifyGraph.threshold.new(
      metric='network_tx_bandwidth',
      operator='>',
      value=0.85,
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
      children=[checklist.getNodeByUid('pcp-vector-checklist-network')],
    ),
  ).addTargets([
    { name: 'network_tx_bandwidth', expr: 'rate(network.interface.out.bytes) / network.interface.baudrate', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 13,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyGraph.panel.new(
    title='Network RX',
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
      children=[checklist.getNodeByUid('pcp-vector-checklist-network')],
    ),
  ).addTargets([
    { name: 'network_rx_bandwidth', expr: 'rate(network.interface.in.bytes) / network.interface.baudrate', format: 'time_series' }
  ]), gridPos={
    x: 0,
    y: 23,
    w: 12,
    h: 9
  },
)
