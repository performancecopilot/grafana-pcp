### Query Formats

#### Time Series
Returns the data as time series.
If there are multiple series for a metric, all series will be shown as separate targets (i.e. a line in a line graph).
For metrics with instance domains, each instance is shown as a separate target.
If there are multiple queries defined, all values will be combined in the same graph.

#### Table
Transforms the data for the table panel.
Two or more queries are required, and it will transform every metric into a column, and every instance into a row.
The latest values of the current selected timeframe will be displayed.

### Legend Format Templating
The following variables can be used in the legend format box:

| Variable      | Description              | Example         |
| ------------- |------------------------- | --------------- |
| `$metric`     | metric name              | `disk.dev.read` |
| `$metric0`    | last part of metric name | `read`          |
| `$instance`   | instance name            | `sda`           |
| `$some_label` | label value              | anything        |
&nbsp;

### Query Functions
The following functions are available for dashboard variables of type *Query*:

| Function | Description | Example |
| -------- | ----------- | ------- |
| `metrics([pattern])` | returns all metrics matching a glob pattern (if no pattern is defined, all metrics are returned) | `metrics(disk.*)` |
| `label_values(metric, label)` | returns all label values for the specified label of the specified metric | `label_values(kernel.all.uptime, hostname)` |
&nbsp;

### More Information
[PCP Redis README](https://github.com/performancecopilot/grafana-pcp/blob/master/docs/pcp-redis.md)
