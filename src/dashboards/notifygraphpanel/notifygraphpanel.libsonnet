{
  panel: {
    new(
      title,
      datasource,
      threshold=null,
      bars=false,
      lines=true,
      line_width=1,
      points=false,
      stack=false,
      null_value='null',
      is_legend_visible=true,
      display_mode='list',
      placement='under',
      time_from=null,
      time_shift=null,
    )::{
      title: title,
      type: 'pcp-notifygraph-panel',
      datasource: datasource,
      options: {
        graph: {
            showBars: bars,
            showLines: lines,
            lineWidth: line_width,
            showPoints: points,
            isStacked: stack,
            nullValue: null_value
        },
        legend: {
            isLegendVisible: is_legend_visible,
            displayMode: display_mode,
            placement: placement
        },
        [if threshold != null then 'threshold']: threshold,
      },
      timeFrom: time_from,
      timeShift: time_shift,
      _nextTarget:: 0,
      addTarget(target):: self {
        local nextTarget = super._nextTarget,
        _nextTarget: nextTarget + 1,
        targets+: [target { refId: std.char(std.codepoint('A') + nextTarget) }],
      },
      addTargets(targets):: std.foldl(function(p, t) p.addTarget(t), targets, self),
    },
  },
  threshold: {
    new(
      name='',
      description='',
      label='',
      operator='',
      value=0,
      urls=[],
      details=null,
      issues=[],
    )::{
      name: name,
      description: description,
      label: label,
      operator: operator,
      value: value,
      urls: urls,
      [if details != null then 'details']: details,
      issues: issues
    },
  }
}