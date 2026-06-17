# Performance Co-Pilot Grafana Plugin

[![Build Status](https://github.com/performancecopilot/grafana-pcp/workflows/CI/badge.svg)](https://github.com/performancecopilot/grafana-pcp/actions?query=workflow:CI)
[![Documentation Status](https://readthedocs.org/projects/grafana-pcp/badge/?version=latest)](https://grafana-pcp.readthedocs.io/en/latest/?badge=latest)


## Overview

[Performance Co-Pilot (PCP)](https://pcp.io) provides a framework and services to support system-level performance monitoring and management.
It presents a unifying abstraction for all of the performance data in a system, and many tools for interrogating, retrieving and processing that data.

This Grafana app plugin integrates PCP metrics into Grafana, bundling three datasources and premade dashboards for real-time monitoring, historical analysis, and eBPF tracing.

[![Vector Overview](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/vector-overview.png)](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/vector-overview.png)
[![Vector Containers](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/vector-containers.png)](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/vector-containers.png)
[![bpftrace Flame Graph](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/bpftrace-flame-graph.png)](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/bpftrace-flame-graph.png)
[![Vector metrics autocompletion](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/vector-metric-autocompletion.png)](https://raw.githubusercontent.com/performancecopilot/grafana-pcp/main/src/img/screenshots/vector-metric-autocompletion.png)

[More screenshots](https://github.com/performancecopilot/grafana-pcp/tree/main/src/img/screenshots)

## Requirements

- **Grafana** >= 12.4.3
- **Performance Co-Pilot (PCP)** with `pmcd` and `pmproxy` running on the monitored host(s)
  - PCP Vector and PCP bpftrace connect to `pmproxy` for real-time metrics
- **Valkey** (or Redis) with `pmlogger` archiving metrics and `pmproxy` configured to write to the key server for the PCP Valkey datasource
- **bpftrace** installed on the monitored host for the PCP bpftrace datasource

## Getting Started

1. **Install the plugin** from the [Grafana plugin catalog](https://grafana.com/grafana/plugins/performancecopilot-pcp-app/) or with the Grafana CLI:
   ```bash
   grafana cli plugins install performancecopilot-pcp-app
   ```

2. **Enable the app plugin** in Grafana under **Administration > Plugins > Performance Co-Pilot** and click **Enable**.

3. **Configure a datasource** under **Connections > Data sources > Add data source**:
   - **PCP Vector** — for real-time metrics from a single host. Set the URL to your `pmproxy` instance (default: `http://localhost:44322`).
   - **PCP Valkey** — for historical metrics stored in Valkey/Redis. Set the URL to your `pmproxy` instance.
   - **PCP bpftrace** — for eBPF tracing scripts. Set the URL to your `pmproxy` instance.

4. **Import bundled dashboards** from each datasource's settings page under the **Dashboards** tab. The PCP Vector Checklist dashboards use the [USE method](http://www.brendangregg.com/usemethod.html) to detect potential performance issues.

## Features

* Analysis of historical PCP metrics using [pmseries](https://man7.org/linux/man-pages/man1/pmseries.1.html) query language
* Analysis of real-time PCP metrics using [pmwebapi](https://man7.org/linux/man-pages/man3/pmwebapi.3.html) live services
* Enhanced Berkeley Packet Filter (eBPF) tracing using [bpftrace](https://github.com/iovisor/bpftrace/blob/master/README.md) scripts
* Dashboards for detecting potential performance issues using the Utilization Saturation and Errors (USE) method [2]
* Full-text search in metric names, descriptions, instances [1]
* Support for [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/) [1]
* Support for [derived metrics](https://man7.org/linux/man-pages/man3/pmregisterderived.3.html#DESCRIPTION) (arithmetic operators and statistical functions inside a query) [2]
* Automated configuration of metric units [1,2,3]
* Automatic rate and time utilization conversion
* Heatmap, table [2,3] and flame graph [3] support
* Auto completion of metric names [1,2], qualifier keys and values [1], and bpftrace probes, builtin variables and functions [3]
* Display of semantics, units and help texts of metrics [2] and bpftrace builtins [3]
* Legend templating support with `$metric`, `$metric0`, `$instance`, `$some_label`, `$some_dashboard_variable`
* Container support [1,2]
* Support for custom endpoint and hostspec per panel [2,3]
* Support for repeated panels
* Sample dashboards for all datasources

[1] PCP Valkey
[2] PCP Vector
[3] PCP bpftrace

## [Documentation](https://grafana-pcp.readthedocs.io)

## [Contributing](https://github.com/performancecopilot/grafana-pcp/blob/main/CONTRIBUTING.md)
