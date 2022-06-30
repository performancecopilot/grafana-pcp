{
  /**
   * Returns a new troubleshooting panel that can be added in a row
   *
   * @name troubleshootingPanel.panel.new
   *
   * @param title The title of the panel
   * @param datasource Datasource of graph
   * @param troubleshooting Metadata related to troubleshooting
   * @param unit The unit of the metrics
   */
  panel: {
    new(
      title,
      datasource,
      troubleshooting,
      unit=null
    ):: {
      title: title,
      type: 'performancecopilot-troubleshooting-panel',
      datasource: datasource,
      options: {
        troubleshooting: troubleshooting,
      },
      fieldConfig: {
        defaults: {
          [if unit != null then 'unit']: unit,
        },
      },

      _nextTarget:: 0,
      addTarget(target):: self {
        // automatically ref id in added targets.
        // https://github.com/kausalco/public/blob/master/klumps/grafana.libsonnet
        local nextTarget = super._nextTarget,
        _nextTarget: nextTarget + 1,
        targets+: [target { refId: std.char(std.codepoint('A') + nextTarget) }],
      },
      addTargets(targets):: std.foldl(function(p, t) p.addTarget(t), targets, self),
    },
  },
  /**
   * Returns a new troubleshooting panel metrics object
   *
   * @name troubleshootingPanel.metric.new
   *
   * @param name Metric name
   * @param helptext Metric helptext, gets shown on mouse hover in metrics listings
   */
  metric: {
    new(
      name,
      helptext='',
    ):: {
      name: name,
      [if helptext != '' then 'helptext']: helptext,
    },
  },
  /**
   * Returns a new troubleshooting panel derivedMetric object
   *
   * @name troubleshootingPanel.derivedMetric.new
   *
   * @param name Metric name
   * @param expr Derived metrics expression
   */
  derivedMetric: {
    new(
      name,
      expr,
    ):: {
      name: name,
      expr: expr,
    },
  },
  /**
   * Returns a new troubleshooting panel predicate
   *
   * @name troubleshootingPanel.predicate.new
   *
   * @param metric Metric that is being watched for changes
   * @param operator Operator used for comparison of present values ('>' | '<')
   * @param value Once "{value} {operator} {measured_value}" is invalid, threshold will be considered failing
   */
  predicate: {
    new(
      metric,
      operator,
      value,
    ):: {
      metric: metric,
      operator: operator,
      value: value,
    },
  },
  /**
   * Returns a new troubleshooting object; this object specifies various information rendered in either 'Warning' or 'Information' modal, with 'Warning' being available once threshold has been passed
   *
   * @name troubleshootingPanel.troubleshooting.new
   *
   * @param name Modal header title
   * @param warning Warning title
   * @param description Detailed description of state that system may be in when threshold in troubleshootingPanel.panel is failing
   * @param metrics List of metrics that are related to given troubleshootingPanel.panel within which this meta resides. troubleshootingPanel.meta[]
   * @param derivedMetrics List of derived metric expressions that are related to given troubleshootingPanel.panel within which this meta resides. string[],
   * @param urls List of urls that are offered as further reading on the topic related to metrics or for troubleshooting
   * @param notes Notes (may contain HTML) that offer hints that are always made available to the user (e.g. setup instructions)
   * @param children List of tree nodes from 'nodes' field, located in DASHBOARD_DIR/overview/shared.libsonnet (preferably retrieved by *getNodeByUid* function from same file), representing dashboards, that are offered to the user for further inspection of metrics related to this meta, below logical hierarchy
   * @param parents List of tree nodes from 'nodes' field, located in DASHBOARD_DIR/overview/shared.libsonnet (preferably retrieved by *getNodeByUid* function from same file), representing dashboards, that are offered to the user for further inspection of metrics related to this meta, above logical hierarchy
   */
  troubleshooting: {
    new(
      name,
      warning=null,
      description=null,
      metrics=[],
      derivedMetrics=null,
      predicate=null,
      urls=null,
      notes=null,
      children=null,
      parents=null,
    ):: {
      name: name,
      [if warning != null then 'warning']: warning,
      [if description != null then 'description']: description,
      metrics: metrics,
      [if derivedMetrics != null then 'derivedMetrics']: derivedMetrics,
      [if predicate != null then 'predicate']: predicate,
      [if urls != null then 'urls']: urls,
      [if notes != null then 'notes']: notes,
      [if children != null then 'children']: children,
      [if parents != null then 'parents']: parents,
    },
  },
}
