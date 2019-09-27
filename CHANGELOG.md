# Change Log

## 1.0.0 (unreleased)

- help texts for all datasources (visible with the **[ ? ]** button in the query editor)
- renamed PCP Live to PCP Vector

### Vector & bpftrace
- if the metric/script gets changed in the query editor, immeditately stop polling the old metric/deregister the old script
- improve pmwebd compatibility

### Vector

- table output: show instance name in left column
- table output: support non-matching instance names (cells of metrics which don't have the specific instance will be blank)

### bpftrace

- context-sensitive auto completion for bpftrace probes, builtin variables and functions incl. help texts
- parse output of bpftrace scripts (e.g. using `printf()`) as CSV and display it in the Grafana table panel
- include sample dashboard

## 0.0.7 (2019-08-16)

- Initial release of grafana-pcp

### Features

- retrieval of Performance Co-Pilot metrics from pmseries (PCP Redis), pmproxy and pmwebd (PCP Live)
- automatic rate conversation of counter metrics
- auto completion of metric names <sup>1,2</sup>, qualifier keys and values <sup>2</sup>
- display of semantics, units and help texts of metrics <sup>1</sup>
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
