local grafana = import 'grafonnet/grafana.libsonnet';

grafana.dashboard.new(
  'PCP Valkey: vLLM Overview',
  tags=['pcp-valkey'],
  time_from='now-6h',
  time_to='now',
  refresh='10s',
)
.addTemplate(
  grafana.template.datasource(
    'datasource',
    'performancecopilot-valkey-datasource',
    'PCP Valkey',
  )
)
.addTemplate(
  grafana.template.new(
    'host',
    '$datasource',
    'label_values(hostname)',
    refresh='load',
  )
)
.addPanel(
  grafana.row.new(
    title='Overview'
  ), gridPos={
    x: 0,
    y: 0,
    w: 24,
    h: 20,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'Request Success Rate %',
    datasource='$datasource',
    unit='percent',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { refID: 'A', expr: 'openmetrics.vllm.vllm.request_success_total{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: false},
    { refID: 'B', expr: 'openmetrics.vllm.http_requests_total{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: false},
    { refID: 'C', type: 'math', expression: '$A / $B * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ])
  + {
    transformations: [
      {
        id: 'calculateField',
        options: {
          mode: 'reduceRow',
          fields: {
            fieldName: '',
          },
          reduceField: 'sum', 
          replaceFields: true, 
          alias: 'Total Instances'
        }
      }
    ],
  }, gridPos={
    x: 0,
    y: 1,
    w: 12,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Time to First Token',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.time_to_first_token_seconds_bucket{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 1,
    w: 12,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Inter-token Latency',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.inter_token_latency_seconds_bucket{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 10,
    w: 12,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'End-to-end Latency',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.e2e_request_latency_seconds_bucket{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 12,
    y: 10,
    w: 12,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='Queue Management'
  ), gridPos={
    x: 0,
    y: 20,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Active vs Waiting Requests',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.num_requests_running{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
    { expr: 'openmetrics.vllm.vllm.num_requests_waiting{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 20,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Request Queue Time',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.request_queue_time_seconds_bucket{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 8,
    y: 20,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Preemptions',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.num_preemptions_total{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 16,
    y: 20,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='vLLM Engine & Cache Efficiency'
  ), gridPos={
    x: 0,
    y: 40,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'KV Cache usage %',
    datasource='$datasource',
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.kv_cache_usage_perc{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 40,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'Prefix Cache Hit Rate',
    datasource='$datasource',
    unit='percent',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { refID: 'A', expr: 'openmetrics.vllm.vllm.prefix_cache_hits_total{hostname == "$host"}', legendFormat: '$instance', format: 'gauge', hide: true },
    { refID: 'B', expr: 'openmetrics.vllm.vllm.prefix_cache_queries_total{hostname == "$host"}', legendFormat: '$instance', format: 'gauge', hide: true },
    { refID: 'C', type: 'math', expression: '$A / $B * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ]), gridPos={
    x: 8,
    y: 40,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Token Throughput',
    datasource='$datasource',
  )
  .addTargets([
        { expr: 'openmetrics.vllm.vllm.prompt_tokens_total{hostname == "$host"}', legendFormat: '$instance', format: 'time_series'},
  ]), gridPos={
    x: 16,
    y: 40,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='Infratructure Health'
  ), gridPos={
    x: 0,
    y: 50,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Process Memory Usage',
    datasource='$datasource',
  )
  .addTargets([
        { expr: 'openmetrics.vllm.process_resident_memory_bytes{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
        { expr: 'openmetrics.vllm.process_virtual_memory_bytes{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 50,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'CPU Utilization',
    datasource='$datasource',
  )
  .addTargets([
        { expr: 'openmetrics.vllm.process_cpu_seconds_total{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 8,
    y: 50,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'Open File Descriptors',
    datasource='$datasource',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
        { refID: 'A', expr: 'openmetrics.vllm.process_open_fds{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: true },
        { refID: 'B', expr: 'openmetrics.vllm.process_max_fds{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: true },
        { refID: 'C', type: 'math', expression: '$A / $B * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ]), gridPos={
    x: 16,
    y: 50,
    w: 8,
    h: 10,
  }
)