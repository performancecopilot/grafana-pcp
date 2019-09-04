# Change Log

## 1.0.0 (unreleased)

- Renamed PCP Live to PCP Vector

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
