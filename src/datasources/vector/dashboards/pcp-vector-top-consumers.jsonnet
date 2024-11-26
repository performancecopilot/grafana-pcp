local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
    'PCP Vector: Top Consumers',
    tags=['pcp-vector'],
    time_from='now-5m',
    time_to='now',
    refresh='5s',
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'performancecopilot-vector-datasource',
    'PCP Vector',
  )
)
.addPanel(
  grafana.text.new(
    'Configuration Instructions',
    mode='markdown',
    content='This dashboard requires [authentication](https://grafana-pcp.readthedocs.io/en/latest/datasources/authentication.html) to be set up for the PCP Vector datasource. The "Top Network Consumers" table requires the [bcc PMDA](https://man7.org/linux/man-pages/man1/pmdabcc.1.html) to be installed and configured with the netproc module.',
  ), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 2,
  }
)
.addPanel(
    grafana.tablePanel.new(
        'Top CPU consumers',
        datasource='$datasource',
        styles=null,
    ) 
    .addTargets([
        { expr: 'proc.hog.cpu', format: 'metrics_table', legendFormat: '$metric' },
    ])  + { options+: {sortBy: [{desc: true, displayName: 'proc.hog.cpu'}]}}, gridPos={
        x: 0,
        y: 2,
        w: 12,
        h: 8,
    }
) 
.addPanel(
    grafana.tablePanel.new(
        'Top Memory Consumers',
        datasource='$datasource',
        styles=null,
    )
    .addTargets([
        { expr: 'proc.hog.mem', format: 'metrics_table', legendFormat: '$metric' },
    ]) + { options+: {sortBy: [{desc: true, displayName: 'proc.hog.mem'}]}}, gridPos={
        x: 12,
        y: 2,
        w: 12,
        h: 8,
    }
)
.addPanel(
     grafana.tablePanel.new(
        'Top Disk Consumers',
        datasource='$datasource',
        styles=null,
    )
    .addTargets([
        { expr: 'proc.hog.disk', format: 'metrics_table', legendFormat: '$metric' },
    ]) + { options+: {sortBy: [{desc: true, displayName: 'proc.hog.disk'}]}}, gridPos={
        x: 0,
        y: 10,
        w: 12,
        h: 8,
    }
)
.addPanel(
     grafana.tablePanel.new(
        'Top Network Consumers',
        datasource='$datasource',
        styles=null,
    )
    .addTargets([
        { expr: 'proc.hog.net', format: 'metrics_table', legendFormat: '$metric' },
    ]) + { options+: {sortBy: [{desc: true, displayName: 'proc.hog.net'}]}}, gridPos={
        x: 12,
        y: 10,
        w: 12,
        h: 8,
    }
)