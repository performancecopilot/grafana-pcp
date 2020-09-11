# Change Log

## 3.0.0 (unreleased)

### New features
- **redis**: support for [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/create-alerts/)
- **redis**: full-text search in metric names, descriptions, instances
- **vector**: support derived metrics, which allows the usage of arithmetic operators and statistical functions inside a query, [see pmRegisterDerived(3)](https://www.mankier.com/3/pmRegisterDerived#Description)
- **vector**: checklist dashboard: detects potential performance issues and shows possible solutions to resolve them
- **vector**: set background metric poll interval according to current dashboard refresh interval, do not stop polling while in background
- **vector**: automatically configure the unit of the panel
- **vector**: redis backfilling: if redis is available, initialize the graph with historical data
- **vector**: configurable hostspec (access remote PMCDs through a central pmproxy)
- **vector**: access context, metric, instancedomain and instance labels
- **dashboards**: container overview dashboard with CGroups v2

### Enhancements / Bug Fixes
- **build**: convert dashboards to jsonnet/grafonnet
- **all**: use latest Grafana UI components based on React (Grafana previously used Angular)

### Redis datasource installation

Unfortunately it is [not possible to sign community plugins at the moment](https://grafana.com/docs/grafana/latest/developers/plugins/sign-a-plugin/). Therefore the PCP Redis datasource plugin needs to be allowed explicitely in the Grafana configuration file:

```
allow_loading_unsigned_plugins = pcp-redis-datasource
```

Restart Grafana server, and check the logs if the plugin loaded successfully.

## 2.0.2 (2020-02-25)

- **vector, redis**: remove autocompletion cache (PCP metrics can be added and removed dynamically)

## 2.0.1 (2020-02-17)

- **build**: fix production build (implement workaround for [systemjs/systemjs#2117](https://github.com/systemjs/systemjs/issues/2117), [grafana/grafana#21785](https://github.com/grafana/grafana/issues/21785))

## 2.0.0 (2020-02-17)

- **vector, bpftrace**: fix version checks on dashboard load (prevent multiple pmcd.version checks on dashboard load)
- **vector, bpftrace**: change datasource check box to red if URL is inaccessible
- **redis:** add tests
- **flame graphs:** support multidimensional eBPF maps (required to display e.g. the process name)
- **dashboards**: remove BCC metrics from Vector host overview (because the BCC PMDA isn't installed by default)
- **misc**: update dependencies

## 1.0.7 (2020-01-29)

- **redis:** fix timespec (fixes empty graphs for large time ranges)

## 1.0.6 (2020-01-07)

- **redis:** support wildcards in metric names (e.g. `disk.dev.*`)
- **redis:** fix label support
- **redis:** fix legends

## 1.0.5 (2019-12-16)

- **redis:** set default sample interval to `60s` (fixes empty graph borders)
- **build:** upgrade `copy-webpack-plugin` to mitigate XSS vulnerability in the `serialize-javascript` transitive dependency
- **build:** remove deprecated `uglify-webpack-plugin`

## 2.0.0-beta1 (2019-12-12)

- support Grafana 6.5+, drop support for Grafana < 6.5

## 1.0.4 (2019-12-11)

### Enhancements
- **flame graphs:** clean flame graph stacks every 5s (reduces CPU load)
- **general:** implement PCP version checks

### Bug Fixes
- **build:** remove `weak` dependency (doesn't work with Node.js 12)
- **build:** upgrade `terser-webpack-plugin` to mitigate XSS vulnerability in the `serialize-javascript` transitive dependency

## 1.0.3 (2019-11-22)

- fix flame graph dependency (`flamegraph.destroy` error in javascript console)

## 1.0.2 (2019-11-12)

- handle counter wraps (overflows)
- convert time based counters to time utilization

## 1.0.1 (2019-10-24)

### Flame Graphs

- aggregate stack counts by selected time range in the Grafana UI
- add an option to hide idle stacks

### Vector

- fix container dropdown in the query editor
- remove container setting from the datasource settings page

### Redis

- fix value transformations (e.g., rate conversation of counters)

### All

- request more datapoints from the datasource to fill the borders of the graph panel

## 1.0.0 (2019-10-11)

### bpftrace

- support for Flame Graphs
- context-sensitive auto-completion for bpftrace probes, builtin variables, and functions incl. help texts
- parse the output of bpftrace scripts (e.g., using `printf()`) as CSV and display it in the Grafana table panel
- sample dashboards (BPFtrace System Analysis, BPFtrace Flame Graphs)

### Vector

- table output: show instance name in the left column
- table output: support non-matching instance names (cells of metrics which don't have the specific instance will be blank)

### Vector & bpftrace
- if the metric/script gets changed in the query editor, immediately stop polling the old metric/deregister the old script
- improve pmwebd compatibility

### miscellaneous

- help texts for all datasources (visible with the **[ ? ]** button in the query editor)
- renamed PCP Live to PCP Vector
- logos for all datasources
- improved error handling

## 0.0.7 (2019-08-16)

- The initial release of grafana-pcp

### Features

- retrieval of Performance Co-Pilot metrics from pmseries (PCP Redis), pmproxy, and pmwebd (PCP Live)
- automatic rate conversation of counter metrics
- auto-completion of metric names <sup>1,2</sup>, qualifier keys, and values <sup>2</sup>
- display of semantics, units, and help texts of metrics <sup>1</sup>
- legend templating support with `$metric`, `$metric0`, `$instance`, `$some_label`
- container support
- support for repeating panels
- support for custom endpoint URL and container setting per query, with templating support <sup>1</sup>
- heatmap and table support <sup>1</sup>
- sample dashboards for PCP Redis and PCP Live

<sup>1</sup> PCP Live
<sup>2</sup> PCP Redis

### Known Bugs

- the bpftrace datasource is work-in-progress and will be ready with the next release (approx. 1-2 weeks)

Thanks to Jason Koch for the initial pcp-live datasource implementation and the host overview dashboard.
