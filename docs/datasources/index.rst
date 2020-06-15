Overview
========

.. include:: ../refs.rst

PCP Redis
---------

This data source queries the fast, scalable time series capabilities provided by the `pmseries`_ functionality.
It is intended to query **historical** data across **multiple hosts** and supports filtering based on labels.

PCP Vector
----------
The PCP Vector data source shows **live, on-host metrics** from the real-time `pmwebapi`_ interfaces.
It is intended for an individual host, on-demand performance monitoring, and includes container support.

PCP bpftrace
------------

The PCP bpftrace data source supports system introspection using `bpftrace`_ scripts.
It connects to the bpftrace PMDA and runs bpftrace scripts on the host.
