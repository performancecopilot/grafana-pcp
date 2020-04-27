Performance Co-Pilot Grafana Plugin
===================================

.. include:: refs.rst

`Performance Co-Pilot (PCP) <https://pcp.io/>`_ provides a framework and services to support system-level performance monitoring and management.
It presents a unifying abstraction for all of the performance data in a system, and many tools for interrogating, retrieving and processing that data.

Features
--------

* analysis of historical PCP metrics using `pmseries`_ query language
* analysis of real-time PCP metrics using `pmwebapi`_ live services
* enhanced Berkeley Packet Filter (eBPF) tracing using `bpftrace`_ scripts
* automatic rate conversation for counter metrics
* heatmap, table and flame graph [3] support
* auto completion of metric names [1,2], qualifier keys and values [1], and bpftrace probes, builtin variables and functions [3]
* display of semantics, units and help texts of metrics [2] and bpftrace builtins [3]
* legend templating support with ``$metric``, ``$metric0``, ``$instance``, ``$some_label``, ``$some_dashboard_variable``
* container support [1,2]
* support for custom endpoint URL [1,2,3] and container [2] setting per query
* support for repeated panels
* sample dashboards for all data sources

[1] PCP Redis
[2] PCP Vector
[3] PCP bpftrace

Getting started
---------------

* :doc:`quickstart`
* :doc:`installation`

.. toctree::
   :caption: Getting started
   :hidden:

   quickstart
   installation
   screenshots
   architecture
   CHANGELOG

.. toctree::
   :caption: Data Sources
   :hidden:
   :titlesonly:

   datasources/index

.. toctree::
   :hidden:

   datasources/authentication
   datasources/redis
   datasources/vector
   datasources/bpftrace

.. toctree::
   :hidden:
   :caption: Troubleshooting

   troubleshooting
