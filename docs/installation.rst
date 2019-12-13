Installation
============

Distribution Package
--------------------

This is the recommended method of installing grafana-pcp.

Fedora
^^^^^^

.. prompt:: bash $

    sudo dnf install grafana-pcp
    sudo systemctl restart grafana-server


From GitHub
-----------

If there is no package available for your distribution, you can install a release from GitHub.

.. parsed-literal::

    $ wget \https://github.com/performancecopilot/grafana-pcp/archive/v\ |release|.tar.gz
    $ sudo tar xfz v\ |release|.tar.gz -C /var/lib/grafana/plugins
    $ sudo systemctl restart grafana-server


From Source
-----------

The `yarn packge manager <https://yarnpkg.com>`_ is required for building grafana-pcp.

.. prompt:: bash $

    git clone https://github.com/performancecopilot/grafana-pcp.git
    yarn install
    yarn run build
    sudo ln -s $(pwd) /var/lib/grafana/plugins
    sudo systemctl restart grafana-server

For interactive development, run ``yarn run watch``.
