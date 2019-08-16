# Performance Co-Pilot App for Grafana

[![Build Status](https://travis-ci.org/performancecopilot/grafana-pcp.svg?branch=master)](https://travis-ci.org/performancecopilot/grafana-pcp)

[Performance Co-Pilot (PCP)](https://pcp.io) provides a framework and services
to support system-level performance monitoring and management. It presents a
unifying abstraction for all of the performance data in a system, and many
tools for interrogating, retrieving and processing that data.

Performance Co-Pilot App for Grafana integrates performance metrics from PCP to
Grafana by providing the following datasources:

## PCP Redis
This datasource queries the fast, scalable time series capabilities provided by
the pmseries(1) functionality. It is intended to query **historical** data
across **multiple hosts** and supports filtering based on labels.

## PCP Live
The PCP Live datasource shows **instant metrics** from the pmproxy(1) or
pmwebd(1) daemon. It is intented for single host, on-demand performance
monitoring and includes container support.

# Installation

Download the tarball, extract it to `/var/lib/grafana/plugins`, restart grafana,
enable the Performance Co-Pilot plugin and setup the datasources.
