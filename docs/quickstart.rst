Quickstart
==========

.. include:: refs.rst

Installation
------------

.. prompt:: bash $

    sudo dnf install grafana-pcp
    sudo systemctl restart grafana-server
    sudo systemctl start pmproxy

After Grafana and grafana-pcp is installed, you can enable the plugin:
Open the Grafana configuration, go to Plugins, select *Performance Co-Pilot* and click the *Enable* button.

Data Sources
------------

Before using grafana-pcp, you need to configure the data sources.
Open the Grafana configuration, go to Data Sources and add the
:doc:`datasources/redis`,
:doc:`datasources/vector` and/or
:doc:`datasources/bpftrace` datasources.

The only required configuration field for each data source is the URL to `pmproxy`_.
In most cases the default setting of ``http://localhost:44322`` can be used.
All other fields can be left to their default values.

.. note::
   Make sure the URL text box actually contains a value (font color should be white) and not the placeholder value (light grey text).

Dashboards
----------

After installing grafana-pcp and configuring the data sources, you're ready to open the pre-installed dashboards or create new ones.
Each data source comes with a few pre-installed dashboards, showing most of the respective functionality.
Further information on each data source and the functionality can be found in the :doc:`Data Sources <datasources/index>` section.
