# Performance Co-Pilot Grafana Plugin

[![Build Status](https://github.com/performancecopilot/grafana-pcp/workflows/CI/badge.svg)](https://github.com/performancecopilot/grafana-pcp/actions?query=workflow:CI)
[![Documentation Status](https://readthedocs.org/projects/grafana-pcp/badge/?version=latest)](https://grafana-pcp.readthedocs.io/en/latest/?badge=latest)

[Performance Co-Pilot (PCP)](https://pcp.io) provides a framework and services to support system-level performance monitoring and management.
It presents a unifying abstraction for all of the performance data in a system, and many tools for interrogating, retrieving and processing that data.

[![Vector Overview](docs/img/vector-overview.png)](docs/img/vector-overview.png)
[![bpftrace Flame Graph](docs/img/bpftrace-flame-graph.png)](docs/img/bpftrace-flame-graph.png)
[![Vector metrics autocompletion](docs/img/vector-metric-autocompletion.png)](docs/img/vector-metric-autocompletion.png)
[![bpftrace probe autocompletion](docs/img/bpftrace-probe-autocompletion.png)](docs/img/bpftrace-probe-autocompletion.png)
[more screenshots](docs/img)

## Features
* analysis of historical PCP metrics using [pmseries](https://www.mankier.com/1/pmseries) query language
* analysis of real-time PCP metrics using [pmwebapi](https://www.mankier.com/3/PMWEBAPI) live services
* enhanced Berkeley Packet Filter (eBPF) tracing using [bpftrace](https://www.mankier.com/8/bpftrace) scripts
* automatic rate conversation for counter metrics
* heatmap, table and flame graph [3] support
* auto completion of metric names [1,2], qualifier keys and values [1], and bpftrace probes, builtin variables and functions [3]
* display of semantics, units and help texts of metrics [2] and bpftrace builtins [3]
* legend templating support with `$metric`, `$metric0`, `$instance`, `$some_label`, `$some_dashboard_variable`
* container support [1,2]
* support for custom endpoint URL [1,2,3] and container [2] setting per query
* support for repeated panels
* sample dashboards for all data sources

[1] PCP Redis
[2] PCP Vector
[3] PCP bpftrace

## [Documentation](https://grafana-pcp.readthedocs.io)
