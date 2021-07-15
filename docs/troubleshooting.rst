Troubleshooting
===============

.. include:: refs.rst

Common Problems
---------------

HTTP Error 502: Bad Gateway, please check the datasource and pmproxy settings
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**When I try to add a datasource in Grafana, I get the following error:**
**"HTTP Error 502: Bad Gateway, please check the datasource and pmproxy settings. To use this data source, please configure the URL in the query editor."**

* check if pmproxy is running: ``systemctl status pmproxy``
* make sure that pmproxy was built with time-series (libuv) support enabled. You can verify that by reading the logfile in ``/var/log/pcp/pmproxy/pmproxy.log``


PCP Redis
---------

Grafana doesn't show any data
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Make sure that `pmlogger`_ is up and running, and writing archives to the disk (``/var/log/pcp/pmlogger/<host>/*``)
* Verify that `pmproxy`_ is running, time series support is enabled and a connection to Redis is established: check the logfile at ``/var/log/pcp/pmproxy/pmproxy.log`` and make sure that it contains the following text: ``Info: Redis slots, command keys, schema version setup``
* Check if the Redis database contains any keys: ``redis-cli dbsize``
* Check if any PCP metrics are in the Redis database: ``pmseries disk.dev.read``
* Check if PCP metric values are in the Redis database: ``pmseries 'disk.dev.read[count:10]'``
* Check the Grafana logs: ``journalctl -e -u grafana-server``
