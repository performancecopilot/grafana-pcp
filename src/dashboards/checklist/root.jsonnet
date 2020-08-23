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
local dashboardNode = overview.getNodeByUid('pcp-overview');

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
    title='CPU',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='kernel.percpu.cpu.util.all',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='CPU',
      warning='The speed of the CPU is limiting performance.',
      metrics=[
        notifyMetric.new(
          'kernel.percpu.cpu.idle', 'percpu idle CPU time metric from /proc/stat'
        )
      ],
      derived=['kernel.percpu.cpu.util.all = 1 - rate(kernel.percpu.cpu.idle)'],
      urls=['https://access.redhat.com/articles/767563#cpu'],
      children=[overview.getNodeByUid('pcp-cpu-overview', children)],
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
  notifyPanel.new(
    title='Storage',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='diskbusy',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='Storage',
      warning='Excessive waiting for storage.',
      metrics=[
        notifyMetric.new(
          'disk.dm.avactive', 'per-device-mapper device count of active time'
        )
      ],
      derived=['diskbusy = rate(disk.dm.avactive)'],
      urls=['https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html-single/Performance_Tuning_Guide/index.html#chap-Red_Hat_Enterprise_Linux-Performance_Tuning_Guide-Storage_and_File_Systems'],
      details='Storage devices have queues for the IO requests for the device.  When the queue is empty the device is idle.  As the device utilization increases the amount of idle time drops and the avactive time increases. If the utilization is excessive and the device becomes saturated the time required to service IO request can become excessive.',
      children=[overview.getNodeByUid('pcp-storage-overview', children)],
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
  notifyPanel.new(
    title='Memory',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='mem.ratio.available',
      operator='<',
      value=0.10,
    ),
    meta=notifyMeta.new(
      name='Memory',
      warning='Running low on available memory.',
      metrics=[
        notifyMetric.new(
          'mem.util.available',
          'available memory from /proc/meminfo',
        ),
        notifyMetric.new(
          'mem.physmem',
          'total system memory metric reported by /proc/meminfo',
        ),
      ],
      derived=['mem.ratio.available = mem.util.available/mem.physmem'],
      urls=['https://access.redhat.com/articles/781733'],
      details='When there is little memory available the system will need to free up space when additional memory is requested.  The memory can be freed by removing cached files, flushing files to disk, and paging sections of memory to swap on storage devices.',
      children=[overview.getNodeByUid('pcp-memory-overview', children)],
    ),
  ).addTargets([
    { name: 'mem.ratio.available', expr: 'mem.util.available/mem.physmem', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network TX',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='network_tx_bandwidth',
      operator='>',
      value=0.85,
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
      children=[overview.getNodeByUid('pcp-network-overview', children)],
    ),
  ).addTargets([
    { name: 'network_tx_bandwidth', expr: 'rate(network.interface.out.bytes)/network.interface.baudrate', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 13,
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
      children=[overview.getNodeByUid('pcp-network-overview', children)],
    ),
  ).addTargets([
    { name: 'network_rx_bandwidth', expr: 'rate(network.interface.in.bytes)/network.interface.baudrate', format: 'time_series' }
  ]), gridPos={
    x: 0,
    y: 23,
    w: 12,
    h: 9
  },
)
