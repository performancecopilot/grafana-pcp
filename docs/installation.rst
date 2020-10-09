Installation
============

Distribution Package
--------------------

Distribution Package is the recommended method of installing grafana-pcp.

Fedora
^^^^^^

.. code-block:: console

    $ sudo dnf install grafana-pcp
    $ sudo systemctl restart grafana-server


GitHub Release
--------------

If there is no package available for your distribution, you can install a release from GitHub.
Replace X.Y.Z with the version of grafana-pcp you wish to install.

.. code-block:: console

    $ wget https://github.com/performancecopilot/grafana-pcp/archive/vX.Y.Z.tar.gz
    $ sudo tar xfz vX.Y.Z.tar.gz -C /var/lib/grafana/plugins
    $ sudo systemctl restart grafana-server


Container
---------

You can also run Grafana with grafana-pcp in a container, using podman or docker.
Keep in mind that with the default configuration, every container has its own isolated network, and you won't be able to reach pmproxy through localhost.
Replace X.Y.Z with the version of grafana-pcp you wish to install.

.. code-block:: console

    $ podman run -e GF_INSTALL_PLUGINS="https://github.com/andreasgerstmayr/grafana-pcp/releases/download/vX.Y.Z/grafana-pcp.zip;grafana-pcp" -p 3000:3000 grafana/grafana

.. code-block:: console

    $ docker run -e GF_INSTALL_PLUGINS="https://github.com/andreasgerstmayr/grafana-pcp/releases/download/vX.Y.Z/grafana-pcp.zip;grafana-pcp" -p 3000:3000 grafana/grafana


From Source
-----------

The `yarn package manager <https://yarnpkg.com>`_, `Go compiler <https://golang.org/>`_, `jsonnet <https://jsonnet.org/>`_ and `jsonnet bundler <https://github.com/jsonnet-bundler/jsonnet-bundler>`_ are required to build grafana-pcp.

.. code-block:: console

    $ git clone https://github.com/performancecopilot/grafana-pcp.git
    $ make dist
    $ sudo ln -s $(pwd) /var/lib/grafana/plugins
    $ sudo systemctl restart grafana-server

To list all available Makefile targets, run ``make help``.
