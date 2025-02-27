PCP Valkey
=========

.. include:: ../refs.rst

Introduction
------------

This data source provides a native interface between `Grafana <https://grafana.com/>`_ and `Performance Co-Pilot <https://pcp.io>`_ (PCP), allowing PCP metric data to be presented in Grafana panels, such as graphs, tables, heatmaps, etc.
Under the hood, the data source makes REST API query requests to the PCP `pmproxy`_ service, which can be running either locally or on a remote host.
The pmproxy daemon can be local or remote and uses the Valkey time-series database (local or remote) for persistent storage.

Setup Valkey and PCP daemons
---------------------------

.. code-block:: console

    $ sudo dnf install valkey
    $ sudo systemctl start valkey pmlogger pmproxy

.. _pmseries-query-language:

Query Language
--------------

Syntax: ``[metric.name] '{metadata qualifiers}'``

Examples:

.. code-block:: c

    kernel.all.load
    kernel.all.load{hostname == "web01"}
    network.interface.in.bytes{agent == "linux"}

Documentation of the pmseries query language can be found in the `man page of pmseries <https://man7.org/linux/man-pages/man1/pmseries.1.html#TIMESERIES_QUERIES>`_.


Query Formats
-------------

Time Series
^^^^^^^^^^^
Returns the data as time series.
If there are multiple series for a metric, all series will be shown as separate targets (i.e., a line in a line graph).
For metrics with instance domains, each instance is shown as a separate target.
If there are multiple queries defined, all values will be combined in the same graph.

Heatmap
^^^^^^^
Transforms the data for the heatmap panel.
Instance names have to be in the following format: ``<lower_bound>-<upper_bound>``, for example, ``512-1023`` (the bcc PMDA produces histograms in this format).

**The following settings have to be set in the heatmap panel options:**

============== =======================
Setting        Value
============== =======================
*Format*       **Time Series Buckets**
*Bucket bound* **Upper**
============== =======================

Geomap
^^^^^
Transforms the data for the geomap panel.
If there are multiple series(hosts) for a metric, all series(hosts) will be shown on the map.
If a metric has multiple instances, all instances will be shown on the map.
The latest values of the currently selected timeframe will be displayed.

Legend Format Templating
------------------------
The following variables can be used in the legend format box:

=============== ======================== ==========================
Variable        Description              Example
=============== ======================== ==========================
``$expr``       query expression         ``rate(disk.dm.avactive)``
``$metric``     metric name              ``disk.dev.read``
``$metric0``    last part of metric name ``read``
``$instance``   instance name            ``sda``
``$some_label`` label value              anything
=============== ======================== ==========================

Query Functions
---------------
The following functions are available for dashboard variables of type *Query*:

=========================== ==================================================== ==========================
Function                    Description                                          Example
=========================== ==================================================== ==========================
``metrics([pattern])``      returns all metrics matching a glob pattern          ``metrics(disk.*)``
                            (if no pattern is defined, all metrics are returned)

``label_names([pattern])``  returns all label names matching a glob pattern      ``label_names(host*)``
                            (if no pattern is defined, all metrics are returned)
``label_values(label)``     returns all label values for the specified label     ``label_values(hostname)``
=========================== ==================================================== ==========================
