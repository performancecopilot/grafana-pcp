PCP Redis
=========

.. include:: ../refs.rst

Introduction
------------

This data source provides a native interface between `Grafana <https://grafana.com/>`_ and `Performance Co-Pilot <https://pcp.io>`_ (PCP), allowing PCP metric data to be presented in Grafana panels, such as graphs, tables, heatmaps, etc.
Under the hood, the data source makes REST API query requests to the PCP `pmproxy`_ service, which can be running either locally or on a remote host.
The pmproxy daemon can be local or remote and uses the Redis time-series database (local or remote) for persistent storage.

Setup Redis and PCP daemons
---------------------------

.. code-block:: console

    $ sudo dnf install redis
    $ sudo systemctl start redis pmlogger pmproxy

.. _pmseries-query-language:

Query Language
--------------

Syntax: ``[metric.name] '{metadata qualifiers}'``

Examples:

.. code-block:: c

    kernel.all.load
    kernel.all.load{hostname == "web01"}
    network.interface.in.bytes{agent == "linux"}

Documentation of the pmseries query language can be found in the `man page of pmseries <https://www.mankier.com/1/pmseries#Timeseries_Queries>`_.


Query Formats
-------------

Time Series
^^^^^^^^^^^
Returns the data as time series.
If there are multiple series for a metric, all series will be shown as separate targets (i.e., a line in a line graph).
For metrics with instance domains, each instance is shown as a separate target.
If there are multiple queries defined, all values will be combined in the same graph.

Table
^^^^^
Transforms the data for the table panel.
Two or more queries are required, and it will transform every metric into a column, and every instance into a row.
The latest values of the currently selected timeframe will be displayed.

Legend Format Templating
------------------------
The following variables can be used in the legend format box:

=============== ======================== =================
Variable        Description              Example
=============== ======================== =================
``$metric``     metric name              ``disk.dev.read``
``$metric0``    last part of metric name ``read``
``$instance``   instance name            ``sda``
``$some_label`` label value              anything
=============== ======================== =================

Query Functions
---------------
The following functions are available for dashboard variables of type *Query*:

=============================== ================================================================================================ =======================
Function                        Description                                                                                      Example
=============================== ================================================================================================ =======================
``metrics([pattern])``          returns all metrics matching a glob pattern (if no pattern is defined, all metrics are returned) ``metrics(disk.*)``
``label_values(metric, label)`` returns all label values for the specified label of the specified metric                         ``label_values(kernel.all.uptime, hostname)``
=============================== ================================================================================================ =======================
