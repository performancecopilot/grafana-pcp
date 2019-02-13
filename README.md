## PCP JSON Datasource - a Performance Co-Pilot backend datasource for Grafana

PCP JSON Datasource is based on [simpod-JSON-datasource](https://github.com/simPod/grafana-json-datasource),
which (in turn) is based on the [Simple JSON Datasource](https://github.com/grafana/simple-json-datasource).

The PCP JSON datasource executes JSON requests against a pmproxy(1) backend.
To work with this datasource the pmproxy backend needs to implement 4 urls:

 * `/grafana/test` should return 200 ok. Used for "Test connection" on the datasource config page.
 * `/grafana/query` should return metrics based on input. See below for syntax examples.
 * `/grafana/annotations` should return annotations.
 * `/grafana/search` is used by the query tab in panels. It should just return "{}" for now.

This datasource would normally be configured with a pmproxy back-end at `http://localhost:44322`.
For more details, see pmproxy(1) and pmwebapi(3).

These two urls are optional:

 * `/grafana/tag-keys` should return tag keys for ad hoc filters.
 * `/grafana/tag-values` should return tag values for ad hoc filters.

### Search API - currently not implemented
/grafana/search
This is used to provide hints in the Query editor, and will be called whenever the
'Query' text box in a panel is changed/edited. It is currently not implemented.
The back-end currently should always return an empty json string "{}" for search requests.

### Query API

/grafana//query

Example `timeseries` request - currently using POST but will be converted to GET
``` text
```

Example `timeseries` response
``` javascript
[
    TODO
]
```

Example `table` response
``` javascript
```
``` json
[
  {
    "columns":[
      {"text":"Time","type":"time"},
      {"text":"Country","type":"string"},
      {"text":"Number","type":"number"}
    ],
    "rows":[
      [1234567,"SE",123],
      [1234567,"DE",231],
      [1234567,"US",321]
    ],
    "type":"table"
  }
]
```

### Annotation API

The annotation request from the Simple JSON Datasource is a POST request to
the `/annotations` endpoint in your datasource. The JSON request body looks like this:
``` json
{
  "range": {
    "from": "2016-04-15T13:44:39.070Z",
    "to": "2016-04-15T14:44:39.070Z"
  },
  "rangeRaw": {
    "from": "now-1h",
    "to": "now"
  },
  "annotation": {
    "name": "deploy",
    "datasource": "JSON Datasource",
    "iconColor": "rgba(255, 96, 96, 1)",
    "enable": true,
    "query": "#deploy",
  },
   "variables" []
}
```

Grafana expects a response containing an array of annotation objects in the
following format:

``` javascript
[
  {
    "text": "text shown in body" // Text for the annotation. (required)
    "title": "Annotation Title", // The title for the annotation tooltip. (optional)
    "isRegion": true, // Whether is region. (optional) (http://docs.grafana.org/reference/annotations/#adding-regions-events)
    "time": "timestamp", // Time since UNIX Epoch in milliseconds. (required)
    "timeEnd": "timestamp", // Time since UNIX Epoch in milliseconds (required if `isRegion` is true )
    "tags": ["tag1"], // Tags for the annotation. (optional)
  }
]
```

Note: If the datasource is configured to connect directly to the backend, you
also need to implement an OPTIONS endpoint at `/annotations` that responds
with the correct CORS headers:

```
Access-Control-Allow-Headers:accept, content-type
Access-Control-Allow-Methods:POST
Access-Control-Allow-Origin:*
```

### Tag Keys API

Example request
``` json
{ }
```

The tag keys api returns:
``` json
[
    {"type":"string","text":"City"},
    {"type":"string","text":"Country"}
]
```

### Tag Values API

Example request
``` json
{"key": "City"}
```

The tag values api returns:
``` json
[
    {"text": "Eins!"},
    {"text": "Zwei"},
    {"text": "Drei!"}
]
```

## Installation

To install this plugin using the `grafana-cli` tool:
```sh
 grafana-cli plugins install pcp-json-datasource
 ```

See [here](https://grafana.com/plugins/pcp-json-datasource/installation) for more
information.

### Development setup

This plugin requires node 6.10.0. To build use of [Yarn](https://yarnpkg.com/lang/en/docs/install/) is encouraged.

```
yarn install
yarn run build
```
