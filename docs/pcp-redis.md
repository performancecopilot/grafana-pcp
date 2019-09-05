## PCP Grafana Datasource - a native Performance Co-Pilot datasource for Grafana with Redis storage back-end

The PCP Grafana datasource plugin provides a native interface between [Grafana](http://grafana.org)
and [Performance Co-Pilot](https://pcp.io) (PCP), allowing PCP metric data to be
presented in Grafana panels, such as graphs, tables, heatmaps, etc. Under the hood, the
datasource makes REST API query requests to the PCP pmproxy(1) service, which can be running
either locally or on a remote host. The pmproxy daemon can be local or remote, and uses
the Redis time-series database (local or remote) for persistent storage.

### Grafana Installation and configuration on Fedora FC29 or later:
 * Grafana is now in the 'updates' repo on Fedora F29 and later.
 * To install grafana: `dnf install grafana`
 * enable and start the grafana service: `systemctl enable grafana-server; systemctl start grafana-server`

### Install Redis v5 or later:
 * on Fedora FC29 or later: `dnf install redis`
 * enable and start the redis service: `systemctl enable redis; systemctl start redis`

### Install PCP pcp-4.3.4 or later, and enable the pmcd, pmlogger and pmproxy services
 * install pcp-4.3.4 or later (this is in the 'updates' repo on Fedora F30 and later)
 * enable PCP services: `systemctl enable pmcd; systemctl enable pmlogger; systemctl enable pmproxy`
 * edit `/etc/pcp/pmproxy/pmproxy.options` and set the `-t` and `-D http` options under the "timeseries with debug for http requests/response" section. This configures pmproxy to scrape performance data from PCP archive logs, and load it into Redis.
 * due to a missing feature in Grafana, you will also need to edit `/etc/pcp/pmproxy/pmproxy.conf` and set `chunksize = 2097152`. Hopefully this will soon not be necessary.
 * now start the 3 PCP services: `systemctl start pmcd; systemctl start pmlogger; systemctl start pmproxy`

### PCP Grafana datasource installation:
The 'dist' directory for this datasource is pre-built, committed to the git repo and ready for use, but still under development.
 * for RPM platforms such as Fedora, you can build the plugin and package it as an RPM and install that: `make; make rpm; sudo dnf install packaging/rpm/grafana-pcp-redis*.noarch.rpm`
Otherwise, install this as a datasource plugin manually as follows.
 * clone the github source: `git clone https://github.com/performancecopilot/grafana-pcp-redis`
 * change directory to the just-cloned datasource: `cd grafana-pcp-redis`
 * symlink the dist directory into the grafana plugins directory: `sudo ln -sf $PWD/dist /var/lib/grafana/plugins/pcp`
 * re-start grafana: `systemctl restart grafana-server`

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
 * in the panel editor select `PCP Redis` in the drop-down menu as the datasource for this panel. Note that different panels in the same dashboard can use different datasources.
 * It is possible to configure more than one Performance Co-Pilot datasource - just give each one a unique name and URL. This allows different panels to retrieve data from different servers (each of which must be running the pmproxy service), e.g. in different datacenters.
 * Now enter the Query text, i.e. choose a PCP metric name, e.g. `kernel.all.cpu.user`.

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
After building, rebuild the RPM and reinstall it `dnf reinstall packaging/rpm/grafana-pcp-redis*.noarch.rpm`.
If you used a symbolic link (as described above in the setup instructions), than after building
a new version of the datasource, all you will need to do is restart the grafana-server service
(and possibly logout/login to the grafana web UI).

The Grafana `grafana-cli` tool can also install plugins. Since the `dist` directory is committed,
the plugin can be installed directly from a GITHUB repo. Check the grafana-cli help and documentation for instructions.
