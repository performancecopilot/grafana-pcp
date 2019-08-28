# Performance Co-Pilot App for Grafana

[![Build Status](https://travis-ci.org/performancecopilot/grafana-pcp.svg?branch=master)](https://travis-ci.org/performancecopilot/grafana-pcp)

[Performance Co-Pilot (PCP)](https://pcp.io) provides a framework and services to support system-level performance monitoring and management.
It presents a unifying abstraction for all of the performance data in a system, and many tools for interrogating, retrieving and processing that data.

[![Live Overview](docs/img/live-overview.png)](docs/img/live-overview.png)
[![live metrics autocompletion](docs/img/live-metric-autocompletion.png)](docs/img/live-metric-autocompletion.png)
[![bpftrace probe autocompletion](docs/img/bpftrace-probe-autocompletion.png)](docs/img/bpftrace-probe-autocompletion.png)
[more screenshots](docs/img)

## Features
* retrieval of Performance Co-Pilot metrics from pmseries (PCP Redis), pmproxy, pmwebd (PCP Live) and bpftrace PMDA (PCP bpftrace)
* automatic rate conversation
* heatmap and table support
* auto completion of metric names<sup>1,2</sup>, qualifier keys and values<sup>2</sup>, and bpftrace probes, builtin variables and functions<sup>3</sup>
* display of semantics, units and help texts of metrics<sup>1</sup> and bpftrace builtins<sup>3</sup>
* legend templating support with `$metric`, `$metric0`, `$instance`, `$some_label`, `$some_dashboard_variable`
* container support<sup>1,2</sup>
* support for custom endpoint URL<sup>1,2,3</sup> and container<sup>1</sup> setting per query
* support for repeated panels
* sample dashboards for all datasources

<sup>1</sup> PCP Live
<sup>2</sup> PCP Redis
<sup>3</sup> PCP bpftrace


# Datasources

## PCP Redis
This datasource queries the fast, scalable time series capabilities provided by the pmseries(1) functionality.
It is intended to query **historical** data across **multiple hosts** and supports filtering based on labels.

## PCP Live
The PCP Live datasource shows **instant metrics** from the pmproxy(1) or pmwebd(1) daemon.
It is intented for single host, on-demand performance monitoring and includes container support.

## PCP bpftrace
The PCP bpftrace datasource supports system introspection using bpftrace scripts.
It connects to the bpftrace PMDA and starts & stops bpftrace scripts on the host.

# Installation
Download a release tarball from https://github.com/performancecopilot/grafana-pcp/releases,
extract it to `/var/lib/grafana/plugins`, restart grafana, enable the Performance Co-Pilot
plugin and setup the datasources.

```
$ wget https://github.com/performancecopilot/grafana-pcp/archive/v0.0.7.tar.gz
$ sudo tar xfz v0.0.7.tar.gz -C /var/lib/grafana/plugins
$ sudo systemctl restart grafana-server 
```
