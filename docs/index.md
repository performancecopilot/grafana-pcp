---
layout: markdown
title: GSOC 2019
---
# Integrating bpftrace with Performance Co-Pilot and Grafana
The goal of this project was to integrate [bpftrace](https://github.com/iovisor/bpftrace) into [Performance Co-Pilot (PCP)](https://pcp.io) and [Vector](http://getvector.io). In the community bonding phase my mentors told me that there are no plans to continue [Vector](http://getvector.io) development, and that these efforts will be moved towards a [Grafana](http://grafana.com) plugin for Performance Co-Pilot.

The integration of bpftrace into the PCP framework provides a number of benefits: 24/7 monitoring, archiving and exporting of the collected metrics to another system and much more. Furthermore, Grafana can consume the metrics in near real-time and display them in the browser with meaningful visualizations, e.g. heat maps and tables. Adequate visualization of collected performance metrics eases the identification and resolution of performance issues.

# bpftrace PMDA
A new Performance Metrics Domain Agent (PMDA) was developed for Performance Co-Pilot (PCP), which executes arbitrary bpftrace scripts and exports them as metrics.

It has the following features:
* start and stop multiple bpftrace scripts
* export bpftrace variables (eBPF maps) as PCP metrics:
  * single values, counters
  * maps, histograms
  * text output (by `printf()`, `time()` etc.)
* automatic removal of scripts whose values weren't requested in a specified time period

## upstream bpftrace changes
Before creating the PMDA, where was no interface available to consume bpftrace data by external applications. After evaluation of the possible integration strategies:
* create a bpftrace library
* find a way to access the eBPF maps directly
* consume the standard output of bpftrace
* create a JSON output formatter for bpftrace, and consume this

I've decided to implement [JSON support in bpftrace](https://github.com/iovisor/bpftrace/pull/733). bpftrace supports timers, which can print the eBPF maps (in JSON format). The PMDA parses the bpftrace script, extracts the variables and adds the timer (e.g. `interval:s:1 { print(@bytes); })` to print the `@bytes` map every second) and runs the bpftrace script.

# Grafana datasource
Visualization of the collected metrics is done in Grafana, by a custom datasource targeted at PCP metrics. The architecture of the datasource is based on Jason Kochs grafana-pcp-live datasource.

Features:
* automatic rate conversation
* histogram support
* parse tables (in CSV format) from bpftrace scripts and show them in a Grafana table panel
* auto completion of bpftrace probes, builtin variables and functions, including help texts
* automatically find the correct metric in case the bpftrace script exports multiple metrics <sup>1</sup>
* support for repeating panels
* support for custom endpoint URL per query, with templating support
* supports both pmwebd and pmproxy REST APIs
* includes a sample dashboard

<sup>1</sup> pmproxy only

# Status
**Code is merged in the master branch.**

# Code
All projects are hosted on GitHub:
* Performance Co-Pilot: [first PR](https://github.com/performancecopilot/pcp/pull/721), [second PR](https://github.com/performancecopilot/pcp/pull/733)
* Grafana plugin: [code](https://github.com/performancecopilot/grafana-pcp/tree/c3dfc1105a2fa9ad08223aa8528ad525522efa30/src/datasources/bpftrace), [commits](https://github.com/performancecopilot/grafana-pcp/commits/c3dfc1105a2fa9ad08223aa8528ad525522efa30/src/datasources/bpftrace)
* bpftrace: [JSON support PR](https://github.com/iovisor/bpftrace/pull/733)

# Challenges and Learnings
## bpftrace integration
Initially I planned to create a library interface for bpftrace ([my GitHub issue](https://github.com/iovisor/bpftrace/issues/643)). After talking to the upstream maintainers and further research, I decided to implement JSON support for bpftrace and print all bpftrace variables every second to standard output, and parse it from the PMDA.

This way both projects don't have to agree on a stable interface and don't need to be statically or dynamically linked. The only interface which can't change is the JSON output format.

## Grafana
Grafana datasources usually expect a time series database and query it. However, with PCP, we only get instant values and can't query historical data <sup>1</sup>. Therefore the buffering needs to be done on the client (in the browser).

The main interface between Grafana and the datasources is the `query()` function, called by each panel when a refresh of the data is requested. In the usual case, a query of a time series database (e.g. Prometheus, InfluxDB, ...), this works well. In the case of bpftrace, where a bpftrace scripts need to be started in the background, we need some logic to keep track of started scripts, and also stop them when the metrics of a bpftrace script are not required anymore.

The current approach for this problem are timers: The datasource will stop polling for new data if no panel is requesting data of a specific script, and the PMDA will stop the bpftrace script automatically if its values are not requested in a specified time period. I also implemented detection if the user is currently typing, and defer the startup of a new bpftrace script once the user stopped typing (otherwise many unnecessary bpftrace scripts will be started in the background).

Another open issue is when a user changes a running script. Currently the datasource doesn't detect that an existing script is changed, and just starts a new script. The previous script will continue running in the background until it gets stopped automatically because it's values weren't requested in the specified time period.

<sup>1</sup> pmseries allow querying of historical data, but this serves another use case

# Further Work
I already have a solution for the mentioned problem in the last paragraph (I'll store the `panelId` and `refId` for each script, and detect if there is already another script version running), and will implement it soon.

# Screenshots
## CPU
[![CPU](cpu.png)](cpu.png)
## Disk
[![Disk](disk.png)](disk.png)
## TCP
[![TPC](tcp.png)](tcp.png)
## Auto-Completion
[![autocompletion of probes](autocompletion_probe.png)](autocompletion_probe.png)
[![autocompletion of variables](autocompletion_variable.png)](autocompletion_variable.png)
[![autocompletion of functions](autocompletion_function.png)](autocompletion_function.png)

# Acknowledgements
I would like to thank my mentors for their support, code reviews and responsiveness.
Thanks to Nathan Scott for resolving any pmproxy defects very quickly and explaining various PCP internals.
Also, I would like to thank Jason Koch for the initial implementation of the grafana-pcp-live datasource.
Furthermore, thanks to Alastair Robertson and all contributors of [bpftrace](https://github.com/iovisor/bpftrace/graphs/contributors), and Brendan Gregg and Dale Hamel for creating the bpftrace scripts used in the sample dashboard.
Finally I like to thank Google for giving me this opportunity.
