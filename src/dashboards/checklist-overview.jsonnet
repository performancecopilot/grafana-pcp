local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local template = grafana.template;
local graphPanel = grafana.graphPanel;

local notifyGraph = import 'notifygraphpanel/notifygraphpanel.libsonnet';
local notifyPanel = notifyGraph.panel;
local notifyThreshold = notifyGraph.threshold;


dashboard.new(
  title='Checklist Overview',
  uid='checklist',
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
  notifyPanel.new(
    title='CPU',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      name='CPU',
      label='processors 85% busy',
      description='The speed of the CPU is limiting performance',
      operator='>',
      value=0.85,
      urls=['https://access.redhat.com/articles/767563#cpu']
    ),
    time_from='5m'
  ).addTargets([
    { expr: "1-rate(kernel.percpu.cpu.idle)", format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 0,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Storage',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      name='Storage',
      label='disk 85% busy',
      description='Excessive waiting for storage',
      operator='>',
      value=0.85,
      urls=['https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html-single/Performance_Tuning_Guide/index.html#chap-Red_Hat_Enterprise_Linux-Performance_Tuning_Guide-Storage_and_File_Systems'],
      details='Storage devices have queues for the IO requests for the device.  When the queue is empty the device is idle.  As the device utilization increases the amount of idle time drops and the avactive time increases. If the utilization is excessive and the device becomes saturated the time required to service IO request can become excessive.',
    ),
    time_from='5m'
  ).addTargets([
    { expr: "rate(disk.dm.avactive)", format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 0,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Memory',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      name='Memory',
      label='< 10% available memory',
      description='Running low on available memory',
      operator='<',
      value=0.10,
      urls=['https://access.redhat.com/articles/781733'],
      details='When there is little memory available the system will need to free up space when addition memory is requested.  The memory can be freed by removed cached files, flushing files to disk, and paging sections of memory to swap on storage devices.',
    ),
    time_from='5m'
  ).addTargets([
    { expr: "mem.util.available/mem.physmem", format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 9,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network TX',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      name='Network TX',
      label='network TX bandwidth',
      description='Ammount of network trafic sent',
      operator='>',
      value=0.85,
    ),
    time_from='5m'
  ).addTargets([
    { expr: "rate(network.interface.out.bytes)/network.interface.baudrate", format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 9,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='Network RX',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      name='Network RX',
      label='network RX bandwidth',
      description='Ammount of network trafic received',
      operator='>',
      value=0.85,
    ),
    time_from='5m'
  ).addTargets([
    { expr: "rate(network.interface.in.bytes)/network.interface.baudrate", format: 'time_series' }
  ]), gridPos={
    x: 0,
    y: 18,
    w: 12,
    h: 9
  },
)