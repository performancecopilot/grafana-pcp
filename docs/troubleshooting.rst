Troubleshooting
===============

Common Problems
---------------

**When I try to add a datasource in Grafana, I get:**
**"HTTP Error 502: Bad Gateway, please check the datasource and pmproxy settings. To use this data source, please configure the URL in the query editor."**

- check if pmproxy is running: ``systemctl status pmproxy``
- make sure that pmproxy was built with time-series (libuv) support enabled. You can find out if so in *$PCP_LOG_DIR/pmproxy/pmproxy.log*
