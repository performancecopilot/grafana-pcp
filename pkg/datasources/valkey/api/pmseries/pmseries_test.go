package pmseries

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana-plugin-sdk-go/config"
	"github.com/stretchr/testify/require"
)

func TestQueryRequest(t *testing.T) {
	for _, method := range []string{http.MethodGet, http.MethodPost} {
		t.Run(method, func(t *testing.T) {
			expr := "kernel.all.cpu.user"
			if method == http.MethodPost {
				expr = strings.Repeat("metric", 2000)
			}
			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				require.Equal(t, method, r.Method)
				require.Equal(t, "/series/query", r.URL.Path)
				params := r.URL.Query()
				if method == http.MethodPost {
					body, err := io.ReadAll(r.Body)
					require.NoError(t, err)
					params, err = url.ParseQuery(string(body))
					require.NoError(t, err)
				}
				require.Equal(t, expr, params.Get("expr"))
				_, _ = io.WriteString(w, `["series-id"]`)
			}))
			defer srv.Close()
			api, err := NewPmseriesAPI(srv.URL, srv.Client())
			require.NoError(t, err)
			response, err := api.Query(context.Background(), expr)
			require.NoError(t, err)
			require.Equal(t, QueryResponse{"series-id"}, response)
		})
	}
}

func TestRequestCancellation(t *testing.T) {
	for _, expr := range []string{"metric", strings.Repeat("metric", 2000)} {
		method := http.MethodGet
		if len(expr) > 8192 {
			method = http.MethodPost
		}
		t.Run(method, func(t *testing.T) {
			started := make(chan struct{})
			release := make(chan struct{})
			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				close(started)
				select {
				case <-r.Context().Done():
				case <-release:
				}
			}))
			defer srv.Close()
			defer close(release)
			api, err := NewPmseriesAPI(srv.URL, srv.Client())
			require.NoError(t, err)
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			done := make(chan error, 1)
			go func() { _, err := api.Query(ctx, expr); done <- err }()
			select {
			case <-started:
			case <-time.After(3 * time.Second):
				t.Fatal("request did not reach server")
			}
			cancel()
			select {
			case err := <-done:
				require.ErrorIs(t, err, context.Canceled)
			case <-time.After(3 * time.Second):
				t.Fatal("HTTP request did not stop after cancellation")
			}
		})
	}
}

func TestGrafanaResponseLimit(t *testing.T) {
	for _, status := range []int{http.StatusOK, http.StatusInternalServerError} {
		t.Run(http.StatusText(status), func(t *testing.T) {
			srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(status)
				if status == http.StatusOK {
					_ = json.NewEncoder(w).Encode([]string{strings.Repeat("x", 1024)})
				} else {
					_ = json.NewEncoder(w).Encode(map[string]string{"message": strings.Repeat("x", 1024)})
				}
			}))
			defer srv.Close()
			client, err := httpclient.New(httpclient.Options{})
			require.NoError(t, err)
			defer client.CloseIdleConnections()
			api, err := NewPmseriesAPI(srv.URL, client)
			require.NoError(t, err)
			ctx := config.WithGrafanaConfig(context.Background(), config.NewGrafanaCfg(map[string]string{config.ResponseLimit: "64"}))
			_, err = api.Query(ctx, "metric")
			require.ErrorIs(t, err, httpclient.ErrResponseBodyTooLarge)
			// The limit belongs to the request, not the reusable datasource client.
			_, err = api.Query(context.Background(), "metric")
			if status == http.StatusOK {
				require.NoError(t, err)
			} else {
				require.EqualError(t, err, strings.Repeat("x", 1024))
			}
		})
	}
}
