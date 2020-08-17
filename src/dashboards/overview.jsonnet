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
local dashboardNode = overview.getNodeByUid('pcp-overview');

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
    title='CPU',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      label='processors 85% busy',
      metric='kernel.percpu.cpu.util.all',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='CPU',
      description='The speed of the CPU is limiting performance',
      metrics=['kernel.percpu.cpu.idle'],
      derived=['kernel.percpu.cpu.util.all = 1 - rate(kernel.percpu.cpu.idle)'],
      urls=['https://access.redhat.com/articles/767563#cpu']
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
      label='disk 85% busy',
      metric='diskbusy',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='Storage',
      description='Excessive waiting for storage',
      metrics=['disk.dm.avactive'],
      derived=['diskbusy = rate(disk.dm.avactive)'],
      urls=['https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html-single/Performance_Tuning_Guide/index.html#chap-Red_Hat_Enterprise_Linux-Performance_Tuning_Guide-Storage_and_File_Systems'],
      details='Storage devices have queues for the IO requests for the device.  When the queue is empty the device is idle.  As the device utilization increases the amount of idle time drops and the avactive time increases. If the utilization is excessive and the device becomes saturated the time required to service IO request can become excessive.',
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
      label='< 10% available memory',
      metric='mem.ratio.available',
      operator='<',
      value=0.10,
    ),
    meta=notifyMeta.new(
      name='Memory',
      description='Running low on available memory',
      metrics=['mem.util.available', 'mem.physmem'],
      derived=['mem.ratio.available = mem.util.available/mem.physmem'],
      urls=['https://access.redhat.com/articles/781733'],
      details='When there is little memory available the system will need to free up space when addition memory is requested.  The memory can be freed by removed cached files, flushing files to disk, and paging sections of memory to swap on storage devices.',
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
      label='network TX bandwidth',
      metric='network_tx_bandwidth',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='Network TX',
      description='Ammount of network trafic sent',
      metrics=['network.interface.out.bytes', 'network.interface.baudrate'],
      derived=['network_tx_bandwidth = rate(network.interface.out.bytes)/network.interface.baudrate'],
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
      label='network RX bandwidth',
      metric='network_rx_bandwidth',
      operator='>',
      value=0.85,
    ),
    meta=notifyMeta.new(
      name='Network RX',
      description='Ammount of network trafic received',
      metrics=['network.interface.in.bytes', 'network.interface.baudrate'],
      derived=['network_rx_bandwidth = rate(network.interface.in.bytes)/network.interface.baudrate'],
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
