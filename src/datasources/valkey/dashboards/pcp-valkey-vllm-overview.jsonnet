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
    h: 1,
  }
)
.addPanel(
  grafana.statPanel.new(
    'Number Requests Waiting',
    description='',
    datasource='$datasource',
  )
  .addTarget(
    { expr: 'openmetrics.vllm.vllm.num_requests_waiting{hostname == "$host"}',
    legendFormat: '$instance',
    format: 'time_series' },
  )
  {
    fieldConfig: {
      defaults: {
        color: {
          mode: 'fixed',
          fixedColor: 'green',
        },
      },
    },
  }
  {
    options: {
      reduceOptions: {
        value: 'calculate',
        calcs: ['last'],
        values: false,
      },
      textMode: 'value',
      colorMode: 'value',
    }
  }, gridPos={
    x: 0,
    y: 1,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'KV Cache Usage %',
    datasource='$datasource',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 80},
    {color: 'red', value: 90}
  ])
  .addTargets([
    { refId: 'A', expr: 'openmetrics.vllm.vllm.kv_cache_usage_perc{hostname == "$host"}', legendFormat: '$metric', format: 'gauge', hide: true},
    { refId: 'B', type: 'math', expression: '$A * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ]), gridPos={
    x: 8,
    y: 1,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.statPanel.new(
    'Number Requests Running',
    description='',
    datasource='$datasource',
  )
  .addTarget(
    { expr: 'openmetrics.vllm.vllm.num_requests_running{hostname == "$host"}',
    legendFormat: '$instance',
    format: 'time_series' },
  )
  {
    fieldConfig: {
      defaults: {
        color: {
          mode: 'fixed',
          fixedColor: 'green',
        },
      },
    },
  }
  {
    options: {
      reduceOptions: {
        value: 'calculate',
        calcs: ['last'],
        values: false,
      },
      textMode: 'value',
      colorMode: 'value',
    }
  }, gridPos={
    x: 16,
    y: 1,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'End 2 End Latency',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.e2e_request_latency_seconds_bucket{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 11,
    w: 24,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='Prefill'
  ), gridPos={
    x: 0,
    y: 21,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Prefill Prompt Tokens',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.prompt_tokens_total{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 22,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Time To First Token ',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.time_to_first_token_seconds_bucket{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 8,
    y: 22,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Request Prefill Time',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
        { expr: 'openmetrics.vllm.vllm.request_prefill_time_seconds_bucket{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 16,
    y: 22,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='Decode'
  ), gridPos={
    x: 0,
    y: 32,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Inter-Token Latency',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.inter_token_latency_seconds_bucket{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 0,
    y: 33,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Decode Generation Throughput',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    { expr: 'openmetrics.vllm.vllm.generation_tokens_total{hostname == "$host"}', legendFormat: '$instance', format: 'time_series' },
  ]), gridPos={
    x: 8,
    y: 33,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Request Decode Time',
    datasource='$datasource',
    decimals=2,
  )
  .addTargets([
    {expr: 'openmetrics.vllm.vllm.request_decode_time_seconds_bucket{hostname == "$host"}', legendFormat: '$instance', format: 'time_series',},
  ]), gridPos={
    x: 16,
    y: 33,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='Queue Management'
  ), gridPos={
    x: 0,
    y: 43,
    w: 24,
    h: 1,
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
    x: 0,
    y: 44,
    w: 12,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'Number Requests Waiting',
    datasource='$datasource',
  )
  .addTargets([
        { refId: 'A', expr: 'openmetrics.vllm.vllm.num_requests_waiting{hostname == "$host"}', legendFormat: '$metric', format: 'time_series'},
  ]), gridPos={
    x: 12,
    y: 44,
    w: 12,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='Cache Efficiency'
  ), gridPos={
    x: 0,
    y: 54,
    w: 24,
    h: 1,
  }
)
.addPanel(
  grafana.gaugePanel.new(
    'Prefix Cache Hits %',
    datasource='$datasource',
  )
  .addThresholds([
    {color: 'green', value: 0},
    {color: 'yellow', value: 0.8},
    {color: 'red', value: 0.9}
  ])
  .addTargets([
        { refId: 'A', expr: 'openmetrics.vllm.vllm.prefix_cache_queries_total{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: true },
        { refId: 'B', expr: 'openmetrics.vllm.vllm.prefix_cache_hits_total{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: true },
        { refId: 'C', type: 'math', expression: '$B / $A * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ])
   {
    fieldConfig: {
      defaults: {
        unit: 'percentunit',
        min: 0,
        max: 1,
      },
    },
  }
  {
    options: {
      reduceOptions: {
        value: 'calculate',
        calcs: ['mean'],
        values: false,
      },
      textMode: 'value',
      colorMode: 'value',
    }
  }, gridPos={
    x: 0,
    y: 55,
    w: 12,
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
    x: 12,
    y: 55,
    w: 12,
    h: 10,
  }
)
.addPanel(
  grafana.row.new(
    title='Infrastructure Health'
  ), gridPos={
    x: 0,
    y: 65,
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
    y: 66,
    w: 8,
    h: 10,
  }
)
.addPanel(
  grafana.graphPanel.new(
    'CPU Utilization % ',
    datasource='$datasource',
  )
  .addTargets([
        { expr: 'openmetrics.vllm.process_cpu_seconds_total{hostname == "$host"}', legendFormat: '$metric', format: 'time_series' },
  ]), gridPos={
    x: 8,
    y: 66,
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
    {color: 'yellow', value: 0.8},
    {color: 'red', value: 0.9}
  ])
  .addTargets([
        { refId: 'A', expr: 'openmetrics.vllm.process_open_fds{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: true },
        { refId: 'B', expr: 'openmetrics.vllm.process_max_fds{hostname == "$host"}', legendFormat: '$instance', format: 'time_series', hide: true },
        { refId: 'C', type: 'math', expression: '$A / $B * 100', datasource: { type: '__expr__', uid: '__expr__'} },
  ])
    {
    fieldConfig: {
      defaults: {
        unit: 'percentunit',
        min: 0,
        max: 1,
      },
    },
  }
  {
    options: {
      reduceOptions: {
        value: 'calculate',
        calcs: ['last'],
        values: false,
      },
      textMode: 'value',
      colorMode: 'value',
    }
  }, gridPos={
    x: 16,
    y: 66,
    w: 8,
    h: 10,
  }
)