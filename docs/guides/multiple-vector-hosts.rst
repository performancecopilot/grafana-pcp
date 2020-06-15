Multiple Vector Hosts
=====================

In cloud environments, it is often desired to use the Vector datasource to connect to multiple remote hosts without configuring a new data source for each host.
This guide shows a setup for this use case using `Grafana templates <https://grafana.com/docs/grafana/latest/variables/templates-and-variables/>`_.

Setup the Vector data source
----------------------------

Open the Grafana configuration, go to Data Sources, and add the :doc:`../datasources/vector` datasource.
Leave the URL field empty and select **Access: Browser**.
Click the save button. A red alert will appear, with the text `To use this data source, please configure the URL in the query editor.`

Create a new dashboard variable
-------------------------------

Create a new dashboard (plus icon in the left navigation - *Create* - *Dashboard*) and open the dashboard settings (wheel icon on the right, top navigation bar).
Navigate to *Variables* and create a new variable with the following settings:

======= ========
Setting Value
======= ========
Name    host
Type    Text box
======= ========

Leave the other fields to their default values.
Save the new variable, go back to the dashboard, enter a hostname (for example, ``localhost``) in the text box, and press enter.

Create a new graph
------------------

Add a new graph to the dashboard, select the :doc:`../datasources/vector` datasource, enter a PCP metric name (for example ``disk.dev.read_bytes``) in the big textbox, and enter ``http://$host:44322`` in the URL field.
If you haven't already, select the time range to *last 5 minutes* and select the auto-refresh interval (top right corner) to 5 seconds, for example.

Now Grafana connects to ``http://localhost:44322`` for this panel (if you have entered ``localhost`` in the host textbox). By changing the value of the host text box, you can change the remote host.

Setting the host by query parameter
-----------------------------------

You can also set the host by an URL query parameter.
Add ``&var-host=example.com`` to the current query, or update the ``var-host`` query parameter in case it is already present in the current query string.
