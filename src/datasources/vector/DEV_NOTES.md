# Why doesn't the Vector datasource use the streaming functionality of Grafana?
- the Vector datasource is not streaming, but polling
- streaming disables the auto-refresh selection, so the refresh rate would be fixed in the datasource settings
- Grafana doesn't implement any metrics cache for streaming datasources, so the same metrics cache as now is required anyway
- Grafana stops refreshing the dashboard when the tab is in background, i.e. streaming would stop - but polling with a JS timer still works
