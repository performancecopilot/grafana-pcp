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
local dashboardNode = overview.getNodeByUid('pcp-cpu-overview');

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
    title='CPU - User Time',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='kernel.percpu.cpu.util.user',
      operator='>',
      value=0.8,
    ),
    meta=notifyMeta.new(
      name='CPU - User Time',
      warning='The CPU is executing application code.',
      metrics=[
        notifyMetric.new(
          'kernel.percpu.cpu.user',
          'percpu user CPU time metric from /proc/stat, including guest CPU time',
        ),
      ],
      derived=['kernel.percpu.cpu.util.user = rate(kernel.percpu.cpu.user)'],
      urls=['https://access.redhat.com/articles/767563#cpu'],
      children=[overview.getNodeByUid('pcp-cpu-user-overview', children)],
      parents=parents,
    ),
  ).addTargets([
    { name: 'kernel.percpu.cpu.util.user', expr: 'rate(kernel.percpu.cpu.user)', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='CPU - System Time',
    datasource='$vector_datasource',
    threshold=notifyThreshold.new(
      metric='kernel.percpu.cpu.util.sys',
      operator='>',
      value=0.2,
    ),
    meta=notifyMeta.new(
      name='CPU - System Time',
      warning='The CPU is executing system code.',
      metrics=[
        notifyMetric.new(
          'kernel.percpu.cpu.sys',
          'percpu sys CPU time metric from /proc/stat',
        ),
      ],
      derived=['kernel.percpu.cpu.util.sys = rate(kernel.percpu.cpu.sys)'],
      urls=['https://access.redhat.com/articles/767563#cpu'],
      children=[overview.getNodeByUid('pcp-cpu-sys-overview', children)],
      parents=parents,
    ),
  ).addTargets([
    { name: 'kernel.percpu.cpu.util.sys', expr: 'rate(kernel.percpu.cpu.sys)', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9
  },
)
.addPanel(
  notifyPanel.new(
    title='CPU - Kernel SamePage Merging Daemon (ksmd)',
    datasource='$vector_datasource',
    meta=notifyMeta.new(
      name='CPU - Kernel SamePage Merging Daemon (ksmd)',
      warning='Kernel SamePage Merging Daemon (ksmd) using too much time.',
      metrics=[
        notifyMetric.new(
          'hotproc.psinfo.utime',
          'time (in ms) spent executing user code since process started',
        ),
        notifyMetric.new(
          'hotproc.psinfo.stime',
          'time (in ms) spent executing system code (calls) since process started',
        ),
      ],
      derived=['hotproc.psinfo.ksmd.util = rate(hotproc.psinfo.utime)+rate(hotproc.psinfo.stime)'],
      urls=['https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html-single/Virtualization_Tuning_and_Optimization_Guide/index.html'],
      details='The goal of the Kernel SamePage Merging Daemon (ksmd) is to reduce memory use by merging separate identical pages in one page.  However, this process can require significant amounts of CPU resources to compare pages of memory.  If the system has ample memory but less CPU resources, disabling ksmd or changing its configuration to reduce CPU use might be better options.',
      issues=['There can only be one hotproc predicate at a time. For this to work hotproc.control.config needs to be set to \'(fname==\"ksmd\" && cpuburn > 0.10)\'. Can be set with <code>sudo pmstore hotproc.control.config \'(fname==\"ksmd\" && cpuburn > 0.10)\'</code>'],
      parents=parents,
    ),
  ).addTargets([
    { name: 'hotproc.psinfo.ksmd.util', expr: 'rate(hotproc.psinfo.utime)+rate(hotproc.psinfo.stime)', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 12,
    h: 9
  },
)
