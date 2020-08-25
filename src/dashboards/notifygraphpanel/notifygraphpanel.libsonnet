{
  /**
   * Returns a new notify graph panel that can be added in a row
   *
   * @name notifyGraph.panel.new
   *
   * @param title The title of the panel
   * @param datasource Datasource of graph
   * @param meta Metadata related to additional information provided to user - provided by notifyGraph.meta.new
   * @param threshold Threshold that is being watched by panel - provided by notifyGraph.threshold.new
   * @param bars Display bars, boolean
   * @param lines Display lines, boolean
   * @param line_width Width of graph lines
   * @param points Display points, boolean
   * @param stack Stack values, boolean
   * @param null_value Null value behavior
   * @param is_legend_visible Display legends, boolean
   * @param display_mode Legend display mode ('list' | 'table')
   * @param placement Legend placement ('under' | 'right' | 'over')
   * @param time_from
   * @param time_shift
   *
   * @func addTarget Same as with inbuild Grafana graph panel with an addition of optional 'name' field which allows to override legend label for given expr
   * @fund addTargets
   *
   * ---
   * Is not intended for use in user's dashboards
   */
  panel: {
    new(
      title,
      datasource,
      meta,
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
        meta: meta,
        // marks the dashboard as 'scripted', therefore, not user created
        scripted: true,
      },
      timeFrom: time_from,
      timeShift: time_shift,
      _nextTarget:: 0,
      addTarget(target):: self {
        local nextTarget = super._nextTarget,
        _nextTarget: nextTarget + 1,
        targets+: [
            {
                expr: target.expr,
                format: target.format,
                [if std.objectHas(target, 'name') then 'name']: target.name,
                refId: std.char(std.codepoint('A') + nextTarget)
            }],
      },
      addTargets(targets):: std.foldl(function(p, t) p.addTarget(t), targets, self),
    },
  },
  /**
   * Returns a new notify graph metrics that can be used within notify graph's meta (object produced by notifyGraph.meta.new)
   *
   * @name notifyGraph.metric.new
   *
   * @param name Metric name
   * @param title Metric title, gets shown on mouse hover in metrics listings
   */
  metric: {
    new(
      name,
      title='',
    )::{
      name: name,
      [if title != '' then 'title']: title,
    },
  },
  /**
   * Returns a new notify graph threshold that can be used within notify graph's object (produced by notifyGraph.meta.new)
   *
   * @name notifyGraph.threshold.new
   *
   * @param metric Metric that is being watched for changes
   * @param operator Operator used for comparison of present values ('>' | '<')
   * @param value Once "{value} {operator} {measured_value}" is invalid, threshold will be considered failing
   */
  threshold: {
    new(
      metric,
      operator,
      value,
    )::{
      metric: metric,
      operator: operator,
      value: value,
    },
  },
  /**
   * Returns a new notify graph meta that can be used within notify graph's object (produced by notifyGraph.panel.new), this object specifies various information rendered in either 'Warning' or 'Information' modal, with 'Warning' being available once threshold has been passed 
   *
   * @name notifyGraph.meta.new
   *
   * @param name Modal header title
   * @param warning Warning title
   * @param metrics List of metrics that are related to given notifyGraph.panel within which this meta resides. notifyGraph.meta[]
   * @param derived List of derived metric expressions that are related to given notifyGraph.panel within which this meta resides. string[],
   * @param urls List of urls that are offered as further reading on the topic related to metrics or for troubleshooting
   * @param issues List of helpful texts (may contain HTML) that offer hints that are always made available to the user 
   * @param details Detailed description of state that system may be in when threshold in notifyGraph.panel is failing
   * @param children List of tree nodes from 'nodes' field, located in DASHBOARD_DIR/overview/shared.libsonnet (preferably retrieved by *getNodeByUid* function from same file), representing dashboards, that are offered to the user for further inspection of metrics related to this meta, below logical hierarchy
   * @param parents List of tree nodes from 'nodes' field, located in DASHBOARD_DIR/overview/shared.libsonnet (preferably retrieved by *getNodeByUid* function from same file), representing dashboards, that are offered to the user for further inspection of metrics related to this meta, above logical hierarchy
   */
  meta: {
    new(
      name,
      warning='',
      metrics=[],
      derived=[],
      urls=[],
      issues=[],
      details='',
      children=[],
      parents=[],
    )::{
      name: name,
      [if warning != '' then 'warning']: warning,
      metrics: metrics,
      derived: derived,
      urls: urls,
      issues: issues,
      [if details != '' then 'details']: details,
      children: children,
      parents: parents,
    },
  },
}
