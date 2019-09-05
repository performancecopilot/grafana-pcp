### Query Formats

#### Time Series
Returns the data as time series.
For metrics with instance domains, each instance is shown as a separate target (i.e. line in a line graph).
If there are multiple queries defined, all values will be combined in the same graph.

#### Heatmap
Transforms the data for the heatmap panel.
Instance names have to be in the following format: `<lower_bound>-<upper_bound>`, for example `512-1023` (the bcc PMDA produces histograms in this format).

**The following settings have to be set in the heatmap panel options:**

| Setting        | Value                   |
| -------------- | ----------------------- |
| *Format*       | **Time Series Buckets** |
| *Bucket bound* | **Upper**               |

&nbsp;

#### Table
Transforms the data for the table panel.
Two or more queries are required, and it will transform every metric into a column, and every instance into a row.
The latest values of the current selected timeframe will be displayed.

&nbsp;
### Legend Format Templating
The following variables can be used in the legend format box:

| Variable      | Description              | Example         |
| ------------- |------------------------- | --------------- |
| `$metric`     | metric name              | `disk.dev.read` |
| `$metric0`    | last part of metric name | `read`          |
| `$instance`   | instance name            | `sda`           |
| `$some_label` | label value              | anything        |
