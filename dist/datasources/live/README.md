## PCP virtual datasource

Provides a virtual datasource so that we can provide Vector-like
functionality to Netflix engineers, but using Grafana's view layer.

### How does it work?

The PCP poller is a bit of a hack.

The dashboard provides a number of variables:

- `var-_proto` provides the protocol (http or https)
- `var-_host` provides pmwebd host
- `var-_port` provides pmwebd port
- `var-_container` if provided will be passed to PCP.

The poller maintains an internal list of endpoints it is polling
and continues to poll these endpoints for any recently requested
metrics. Each time Grafana requests data from the poller, we check
that the requested endpoint and metric is in the polling list, and
then return any available data. The poller then starts polling each
of these endpoints. This means on first request, the chart will
be empty since we have not yet polled, however all subsequent
requests should see the data that was recently polled. It also
decouples the poll cycle from the render cycle so that renders
may happen every X seconds but the data collection is locked to
every 1 second.

The metrics and endpoints are aged out to ensure that we do not
poll unnecessarily.

### Cool stuff

The poller is responsible for query interpretation. To support this
we have a full expression evaluator loaded so you can perform
Javascript expressions in the query field to combine data from
multiple PCP metrics!

### How does this differ from a normal plugin?

Most Grafana plugins assume an external data store is available,
and that the plugin is polling the data store for queries and
presenting the results. In this case the PCP host is not storing
any metrics, so we need to provide that data buffering on the
client side. On the upside, this means we do not need to track
historic data at the PCP 1-second level, however on the downside
it requires the application to be polling in order to fetch any
data.

### Why not use the existing PCP Grafana datasource?

The existing datasource assumes that it can fetch metrics using
the pmlogger provided data storage. It also assumes that you
will set up a datasource for each endpoint to connect to, which
will not work in the Netflix environment.

### Future work

- We should consider how to run Grafana as the backend for queries.
- We should consider whether the plugin architecture is the best
approach.
- Background polling.
- Code cleanups.

