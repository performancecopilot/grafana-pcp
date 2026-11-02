package valkey

import (
	"context"
	"encoding/json"
	"encoding/pem"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana-plugin-sdk-go/config"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/valkey/test/fixtures/pmseriesf"
	"github.com/stretchr/testify/require"
)

func TestDatasourceHTTPClientSettings(t *testing.T) {
	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, password, ok := r.BasicAuth()
		require.True(t, ok)
		require.Equal(t, "user", user)
		require.Equal(t, "secret", password)
		require.Equal(t, "header-secret", r.Header.Get("X-Test"))
		_, _ = io.WriteString(w, `{"success":true}`)
	}))
	defer srv.Close()

	for _, tlsSetting := range []string{`"tlsSkipVerify":true`, `"tlsAuthWithCACert":true`} {
		t.Run(tlsSetting, func(t *testing.T) {
			instance, err := newDataSourceInstance(context.Background(), backend.DataSourceInstanceSettings{
				URL:              srv.URL,
				BasicAuthEnabled: true,
				BasicAuthUser:    "user",
				JSONData:         []byte(`{"timeout":17,"httpHeaderName1":"X-Test",` + tlsSetting + `}`),
				DecryptedSecureJSONData: map[string]string{
					"basicAuthPassword": "secret",
					"httpHeaderValue1":  "header-secret",
					"tlsCACert":         string(pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: srv.Certificate().Raw})),
				},
			})
			require.NoError(t, err)
			defer instance.(*valkeyDatasourceInstance).Dispose()
			ds := instance.(*valkeyDatasourceInstance)
			require.Equal(t, 17*time.Second, ds.httpClient.Timeout)
			response, err := ds.pmseriesAPI.Ping(context.Background())
			require.NoError(t, err)
			require.True(t, response.Success)
		})
	}
}

func TestHandlerResponseLimit(t *testing.T) {
	for _, handler := range []string{"health", "resource"} {
		t.Run(handler, func(t *testing.T) {
			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.URL.Path == "/series/ping" {
					_, _ = io.WriteString(w, `{"success":true}`)
				} else {
					_, _ = io.WriteString(w, `["metric"]`)
				}
			}))
			defer srv.Close()
			ds := NewDatasource()
			pluginCtx := backend.PluginContext{OrgID: 1, DataSourceInstanceSettings: &backend.DataSourceInstanceSettings{URL: srv.URL}}
			ctx := config.WithGrafanaConfig(context.Background(), config.NewGrafanaCfg(map[string]string{config.ResponseLimit: "4"}))
			if handler == "health" {
				response, err := ds.CheckHealth(ctx, &backend.CheckHealthRequest{PluginContext: pluginCtx})
				require.NoError(t, err)
				require.Equal(t, backend.HealthStatusError, response.Status)
				require.Contains(t, response.Message, "response body too large")
			} else {
				var response *backend.CallResourceResponse
				err := ds.CallResource(ctx, &backend.CallResourceRequest{PluginContext: pluginCtx, URL: "metricFindQuery?query=metrics(*)"}, backend.CallResourceResponseSenderFunc(func(r *backend.CallResourceResponse) error { response = r; return nil }))
				require.NoError(t, err)
				require.NotNil(t, response)
				require.Equal(t, http.StatusInternalServerError, response.Status)
				require.Contains(t, string(response.Body), "response body too large")
			}
		})
	}
}

func TestQueryResponseLimit(t *testing.T) {
	const sid = "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"
	for _, path := range []string{"/series/query", "/series/metrics", "/series/descs", "/series/values", "/series/instances", "/series/labels"} {
		t.Run(path, func(t *testing.T) {
			reached := make(chan struct{}, 1)
			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.URL.Path == path {
					reached <- struct{}{}
					_, _ = io.WriteString(w, strings.Repeat(" ", 8192))
					return
				}
				var response interface{}
				switch r.URL.Path {
				case "/series/query":
					response = pmseriesf.Query([]string{sid})
				case "/series/metrics":
					response = pmseriesf.Metrics([]string{sid})
				case "/series/descs":
					response = pmseriesf.Descs([]string{sid})
				case "/series/values":
					response = pmseriesf.Values([]string{sid})
				case "/series/instances":
					response = pmseriesf.Instances([]string{sid})
				case "/series/labels":
					response = pmseriesf.Labels([]string{"7f3afb6f41e53792b18e52bcec26fdfa2899fa58", "0aeab8b239522ab0640577ed788cc601fc640266"})
				default:
					t.Errorf("unexpected endpoint: %s", r.URL.Path)
				}
				_ = json.NewEncoder(w).Encode(response)
			}))
			defer srv.Close()
			ds := NewDatasource()
			ctx := config.WithGrafanaConfig(context.Background(), config.NewGrafanaCfg(map[string]string{config.ResponseLimit: "4096"}))
			response, err := ds.QueryData(ctx, &backend.QueryDataRequest{
				PluginContext: backend.PluginContext{OrgID: 1, DataSourceInstanceSettings: &backend.DataSourceInstanceSettings{URL: srv.URL}},
				Queries:       []backend.DataQuery{{RefID: "A", JSON: []byte(`{"expr":"disk.dev.read","format":"time_series"}`)}},
			})
			require.NoError(t, err)
			require.ErrorIs(t, response.Responses["A"].Error, httpclient.ErrResponseBodyTooLarge)
			require.Len(t, reached, 1, "query must reach the selected endpoint")
		})
	}
}
