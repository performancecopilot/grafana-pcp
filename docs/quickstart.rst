Quickstart
==========

.. include:: refs.rst

Installation
------------

Please see the :doc:`Installation Guide <installation>`. There is a simple method using the
package manager for Red Hat-based distributions, otherwise it can be installed from source, from
a pre-built plugin bundle from the project's GitHub releases page, or as a container.

Make sure to restart Grafana server and pmproxy after installation the plugin. Eg.

.. code-block:: console

    $ sudo systemctl restart grafana-server
    $ sudo systemctl start pmproxy

Installation is not finished until you also enable the Performance Co-Pilot plugin via
the Grafana Admin configuration:

Open the Grafana configuration, go to Plugins, select *Performance Co-Pilot* and click the *Enable* button on it's page. This will make the PCP data sources and some dashboards available.

Data Sources
------------

Before using grafana-pcp, you need to configure the data sources.
Open the Grafana configuration, go to Data Sources and add the
:doc:`datasources/redis`,
:doc:`datasources/vector` and/or
:doc:`datasources/bpftrace` datasources.

The only required configuration field for each data source is the URL to `pmproxy`_.
In most cases the default URL ``http://localhost:44322`` can be used.
All other fields can be left to their default values.

Each data source includes one or more pre-defined dashboards.
You can import them by navigating to the *Dashboards* tab on top of the settings and clicking the *Import* button next to the dashboard name.

.. note::
   Make sure the *URL* text box actually contains a value (font color should be white) and you're not looking at the placeholder value (light grey text).

.. note::
   The Redis and bpftrace data sources need additional configuration on the collector host.
   See :doc:`datasources/redis` and :doc:`datasources/bpftrace`.

Dashboards
----------

After installing grafana-pcp and configuring the data sources, you're ready to open the pre-defined dashboards (see above) or create new ones.
Each data source comes with a few pre-defined dashboards, showing most of the respective functionality.
Further information on each data source and the functionality can be found in the :doc:`Data Sources <datasources/index>` section.
