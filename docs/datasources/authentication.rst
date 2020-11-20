Authentication
==============

Performance Co-Pilot supports the following authentication mechanisms through the SASL authentication framework: ``plain``, ``login``, ``digest-md5``, ``scram-sha-256`` and ``gssapi``.
This guide shows how to setup authentication using the ``scram-sha-256`` authentication mechanism and a local user database.


.. note::
    Authentication methods ``login``, ``digest-md5`` and ``scram-sha-256`` require PCP 5.1.0 or later.

Requisites
----------

Install the following package, which provides support for the ``scram-sha-256`` authentication method:

.. code-block:: console

    $ sudo dnf install -y cyrus-sasl-scram

Configuring PMCD
----------------

First, open the ``/etc/sasl2/pmcd.conf`` file and specify the supported authentication mechanism and the path to the user database:

.. code-block:: yaml

    mech_list: scram-sha-256
    sasldb_path: /etc/pcp/passwd.db

Then create a new unix user (in this example ``pcptestuser``) and add it to the user database:

.. code-block:: console

    $ sudo useradd -r pcptestuser
    $ sudo saslpasswd2 -a pmcd pcptestuser

.. note::
    For every user in the user database, a unix user with the same name must exist.
    The passwords of the unix user and the ``/etc/pcp/passwd.db`` database are not synchronized,
    and (only) the password of the ``saslpasswd2`` command is used for authentication.

Make sure that the permissions of the user database are correct (readable only by root and the pcp user):

.. code-block:: console

    $ sudo chown root:pcp /etc/pcp/passwd.db
    $ sudo chmod 640 /etc/pcp/passwd.db

Finally, restart pmcd:

.. code-block:: console

    $ sudo systemctl restart pmcd

Test Authentication
-------------------

To test if the authentication is set up correctly, execute the following command:

.. code-block:: console

    $ pminfo -f -h "pcp://127.0.0.1?username=pcptestuser" disk.dev.read

Configuring the Grafana Datasource
----------------------------------

Go to the Grafana datasource settings, enable **Basic auth**, and enter the username and password.
Click the *Save & Test* button to check if the authentication is working.

.. note::
    Due to security reasons, the access mode *Browser* is **not supported** with authentication.
