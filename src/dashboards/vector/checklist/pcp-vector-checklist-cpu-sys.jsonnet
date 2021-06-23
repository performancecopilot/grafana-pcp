local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local troubleshootingPanel = import '_troubleshootingpanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

local checklist = import 'checklist.libsonnet';
local node = checklist.getNodeByUid('pcp-vector-checklist-cpu-sys');
local parents = checklist.getParentNodes(node);

checklist.dashboard.new(node)
.addPanel(
  troubleshootingPanel.panel.new(
    title='Intensive tasks in kernel-space',
    datasource='$datasource',
    unit='percentunit',
    troubleshooting=troubleshootingPanel.troubleshooting.new(
      name='CPU - Intensive tasks in kernel-space',
      metrics=[
        troubleshootingPanel.metric.new(
          'hotproc.psinfo.stime',
          'time (in ms) spent executing system code (calls) since process started',
        ),
      ],
      urls=['https://access.redhat.com/articles/781993'],
      notes="To enable metric collection for this panel, please configure the hotproc.control.config setting. It can be set with: <code>sudo pmstore hotproc.control.config 'cpuburn > 0.05'</code>",
      parents=parents,
    ),
  ).addTargets([
    { expr: 'hotproc.psinfo.stime', format: 'time_series', legendFormat: '$instance', url: '$url', hostspec: '$hostspec' },
  ]), gridPos={
    x: 0,
    y: 3,
    w: 12,
    h: 9,
  },
)
