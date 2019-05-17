## PCP Grafana Datasource - a native Performance Co-Pilot datasource for Grafana

The PCP Grafana datasource plugin provides a native interface between [Grafana](http://grafana.org)
and [Performance Co-Pilot](https://pcp.io) (PCP), allowing PCP metric data to be
presented in Grafana panels, such as graphs, tables, heatmaps, etc. Under the hood, the
datasource makes REST API query requests to the PCP pmproxy(1) service, which can be running
either locally or on a remote host.

_Please note: this datasource plugin is under development, so the installation and
configuration instructions are more convoluted than they will be once this has been
released for general use._

### Grafana Installation and configuration on Fedora FC29 or later:
 * grafana is now in the 'updates' repo on Fedora F29 and later.
 * To install grafana: `dnf install grafana`
 * enable and start the grafana service: `systemctl enable grafana-server; systemctl start grafana-server`

### Install Redis v5 or later:
 * on Fedora FC29 or later: `dnf install redis`
 * enable and start the redis service: `systemctl enable redis; systemctl start redis`

### Install PCP pcp-4.3.2 or later, and enable the pmcd, pmlogger and pmproxy services
 * install pcp-4.3.2 or later (this is in the 'updates' repo on Fedora F29 and later)
 * enable PCP services: `systemctl enable pmcd; systemctl enable pmlogger; systemctl enable pmproxy`
 * edit `/etc/pcp/pmproxy/pmproxy.options` and set the `-t` and `-D http` options under the "timeseries with debug for http requests/response" section. This configures pmproxy to scrape performance data from PCP archive logs, and load it into Redis.
 * start the 3 PCP services: `systemctl start pmcd; systemctl start pmlogger; systemctl start pmproxy`

### PCP Grafana datasource installation:
The 'dist' directory for this datasource is pre-built, committed to the git repo and ready for use, but still under development.
The easiest way to install this as a datasource plugin for grafana is as follows.
 * clone the github source: `git clone https://github.com/performancecopilot/pcp-grafana-datasource`
 * change directory to the just-cloned datasource: `cd pcp-grafana-datasource`
 * symlink the dist directory into the grafana plugins directory: `ln -sf $PWD/dist /var/lib/grafana/data/plugins/pcp`
 * re-start grafana: `systemctl restart grafana-server`
 * alternatively, you can build the plugin and package it as an RPM and install that: `make; make rpm; dnf install packaging/rpm/pcp-grafana-datasource*.noarch.rpm`

### Using the PCP Grafana datasource:
The PCP datasource can now be configured and enabled in the Grafana UI for use by various Grafana panels:
 * login to grafana using a web browser: http://localhost:3000 (or whatever host is running grafana-server if your browser is not running on that host)
 * The default initial user and password is `admin/admin`. You will be prompted to change this on the first login.
 * Under the gear icon on the left hand side, click on the 'datasources' menu item and then select 'Performance Co-Pilot'
 * In the URL text box, enter the host and port of the pmproxy service, as configured above, e.g. `http://localhost:44322`
 * Click on the green 'Save & Test' button. If everything is working, you'll see a message that `PCP Data source is working`
   and that the configuration has been saved in the local Grafana configuration database.

### Create a new dashboard and panels
 * use the grafana web UI to create a new dashboard, and then create a panel within that dashboard, e.g. a `single-stat` panel.
 * in the new panel, click on it's title at the top, and select Edit
 * in the panel editor select `Performance Co-Pilot` in the drop-down menu as the datasource for this panel. Note that different panels in the same dashboard can use different datasources, but all Queries in the **same** panel always use the same datasource.
 * It is possible to configure more than one Performance Co-Pilot datasource - just give each one a unique name and URL. This allows different panels to retrieve data from different servers (each of which must be running the pmproxy service), e.g. in different datacenters.
 * Now enter the Query text, i.e. choose a PCP metric name, e.g. `kernel.all.cpu.user`. If the metric you have chosen is a counter type, then select the 'Rate Convert' tick-box, so that returned time-series values will be rate converted (e.g. count/second) before being passed to the Grafana panel display handler.

## Implementation details
To work with this datasource the pmproxy backend (on port 44322 by default) implements 4 URLs:

 * `/grafana/test` should return 200 ok. Used for "Test connection" on the datasource config page.
 * `/grafana/query` should return time-series data based on the query text. See below for syntax examples.
 * `/grafana/annotations` should return annotations.
 * `/grafana/search` is used by the query tab in panels. It should just return "{}" for now.

At the present time, only `/grafana/test` and `/grafana/query` are implemented. The `/grafana/search` end-point will be used for auto-completion of metric names and other 'helper' functionality when entering queries. Annotations are not yet implemented.

Two addtional urls are optional (once implemented):

 * `/grafana/tag-keys` should return tag keys for ad hoc filters.
 * `/grafana/tag-values` should return tag values for ad hoc filters.

### Build and Development

The PCP grafana datasource is based on [simpod-JSON-datasource](https://github.com/simPod/grafana-json-datasource),
which (in turn) is based on the [Simple JSON Datasource](https://github.com/grafana/simple-json-datasource).
To build this plugin, you need node version 6.10.0 or later (on Fedora, this is packaged in the 'nodejs' RPM). To build,
use the provided `Makefile` in the top-level directory:

```
make
make rpm
```

When building and testing, all modified files **including** those below the ``dist`` directory should be committed.
After building, rebuild the RPM and reinstall it `dnf reinstall packaging/rpm/pcp-grafana-datasource*.noarch.rpm`.
If you used a symbolic link (as described above in the setup instructions), than after building
a new version of the datasource, all you will need to do is restart the grafana-server service
(and possibly logout/login to the grafana web UI).

The Grafana `grafana-cli` tool can also install plugins. Since the `dist` directory is committed,
the plugin can be installed directly from a GITHUB repo. Check the grafana-cli help and documentation for instructions.
