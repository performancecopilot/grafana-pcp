Troubleshooting
===============

Common Problems
---------------

**I installed PCP from source - now when I try to add datasource in Grafana I get:**
**"HTTP Error 502: Bad Gateway, please check the datasource and pmproxy settings. To use this data source, please configure the URL in the query editor."**

Try making sure that pmproxy was built with timeseries (libuv) support enabled. You can find out if so in *$PCP_LOG_DIR/pmproxy/pmproxy.log*