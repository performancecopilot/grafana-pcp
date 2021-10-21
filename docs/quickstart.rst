Quickstart
==========

.. include:: refs.rst

Installation
------------

Please see :doc:`Installation Guide <installation>`. There is a simple method using
package manager for Redhat-based distributions, Otherwise it can be installed from source, or
pre-built plugin bundle from the project's github releases page, or as a container.

Make sure to restart Grafana server and pmproxy after installation the plugin. Eg.

.. code-block:: console

    $ sudo systemctl restart grafana-server
    $ sudo systemctl start pmproxy

Installation is not totally finished until you also enable the Performance Co-Pilot plugin via
the Grafana Admin user's configuration.

Open the Grafana configuration, go to Plugins, optionally select "Applications" (not Datasources) to filter to it quickly, select *Performance Co-Pilot* and click the *Enable* button on it's page. This will make the PCP datasources and some dashboards available.

Data Sources
------------

Before using grafana-pcp, you need to configure the data sources.
Open the Grafana configuration, go to Data Sources and add the
:doc:`datasources/redis`,
:doc:`datasources/vector` and/or
:doc:`datasources/bpftrace` datasources.

The only required configuration field for each data source is the URL to `pmproxy`_.
In most cases the default Redis URL of ``http://localhost:44322`` can be used.
All other fields can be left to their default values.

.. note::
   Make sure the *URL* text box actually contains a value (font color should be white) and you're not just looking at the placeholder value (light grey text).

.. note::
   The Redis and bpftrace data sources need additional configuration on the collector host.
   See :doc:`datasources/redis` and :doc:`datasources/bpftrace`.

Dashboards
----------

After installing grafana-pcp and configuring the data sources, you're ready to open the pre-installed dashboards or create new ones.
Each data source comes with a few pre-installed dashboards, showing most of the respective functionality.
Further information on each data source and the functionality can be found in the :doc:`Data Sources <datasources/index>` section.
