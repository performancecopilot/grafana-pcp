PCP bpftrace
============

bpftrace PMDA installation
--------------------------

.. code-block:: console

    $ sudo dnf install pcp-pmda-bpftrace
    $ cd /var/lib/pcp/pmdas/bpftrace
    $ sudo ./Install

Query Formats
-------------

Time Series
^^^^^^^^^^^
Shows bpftrace variables as time series.
For bpftrace maps, each key is shown as a separate target (i.e. line in a line graph), for example ``@counts[comm] = count()``.
If there are multiple variables (or scripts) defined, all values will be combined in the same graph.

Heatmap
^^^^^^^
Transforms bpftrace histograms into heatmaps.

**The following settings have to be set in the heatmap panel options:**

============== =======================
Setting        Value
============== =======================
*Format*       **Time Series Buckets**
*Bucket bound* **Upper**
============== =======================

Table
^^^^^
Transforms CSV output of bpftrace scripts into a table.
The first line must be the column names.

Legend Format Templating
------------------------
The following variables can be used in the legend format box:

=============== ======================
Variable        Description
=============== ======================
``$metric0``    bpftrace variable name
``$instance``   bpftrace map key
=============== ======================

More Information
----------------

`bpftrace PMDA README <https://github.com/performancecopilot/pcp/blob/main/src/pmdas/bpftrace/README.md>`_
