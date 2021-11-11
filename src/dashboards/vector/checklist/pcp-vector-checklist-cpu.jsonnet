local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-cpu');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Per-CPU busy (User)',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='CPU - User Time',
      warning='The CPU is executing application code more than 80% of the time.',
      metrics=[
        troubleshootingPanel.metric.new(
          'kernel.percpu.cpu.user',
          'percpu user CPU time metric from /proc/stat, including guest CPU time',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='kernel.percpu.cpu.user',
        operator='>',
        value=0.8,
      ),
      urls=['https://access.redhat.com/articles/767563#cpu'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-cpu-user')],
    ),
  ).addTargets([
    { expr: 'kernel.percpu.cpu.user', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Per-CPU busy (System)',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='CPU - System Time',
      warning='The CPU is executing system code more than 20% of the time.',
      metrics=[
        troubleshootingPanel.metric.new(
          'kernel.percpu.cpu.sys',
          'percpu sys CPU time metric from /proc/stat',
        ),
      ],
      predicate=troubleshootingPanel.predicate.new(
        metric='kernel.percpu.cpu.sys',
        operator='>',
        value=0.2,
      ),
      urls=['https://access.redhat.com/articles/767563#cpu'],
      parents=parents,
      children=[checklist.getNodeByUid('pcp-vector-checklist-cpu-sys')],
    ),
  ).addTargets([
    { expr: 'kernel.percpu.cpu.sys', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 12,
    y: 3,
    w: 12,
    h: 9,
  },
)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Kernel SamePage Merging Daemon (ksmd)',
    datasource='$datasource',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='CPU - Kernel SamePage Merging Daemon (ksmd)',
      warning='Kernel SamePage Merging Daemon (ksmd) using too much time.',
      description='The goal of the Kernel SamePage Merging Daemon (ksmd) is to reduce memory use by merging separate identical pages in one page.  However, this process can require significant amounts of CPU resources to compare pages of memory.  If the system has ample memory but less CPU resources, disabling ksmd or changing its configuration to reduce CPU use might be better options.',
      metrics=[
        troubleshootingPanel.metric.new(
          'hotproc.psinfo.utime',
          'time (in ms) spent executing user code since process started',
        ),
        troubleshootingPanel.metric.new(
          'hotproc.psinfo.stime',
          'time (in ms) spent executing system code (calls) since process started',
        ),
      ],
      derivedMetrics=[
        troubleshootingPanel.derivedMetric.new(
          'hotproc.psinfo.ksmd.util',
          'rate(hotproc.psinfo.utime) + rate(hotproc.psinfo.stime)'
        ),
      ],
      urls=['https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html-single/Virtualization_Tuning_and_Optimization_Guide/index.html'],
      notes="To enable metric collection for this panel, please configure the hotproc.control.config setting. It can be set with: <code>sudo pmstore hotproc.control.config '(fname==\"ksmd\" && cpuburn > 0.10)'</code> Note: There can only be one hotproc predicate at a time.",
      parents=parents,
    ),
  ).addTargets([
    { expr: 'rate(hotproc.psinfo.utime) + rate(hotproc.psinfo.stime)', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 13,
    w: 12,
    h: 9,
  },
) + {
  revision: 2,
}
