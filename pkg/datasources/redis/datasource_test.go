package redis

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/test/fixtures/pmseriesf"
	"github.com/stretchr/testify/require"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/resource"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
)

func TestDatasource(t *testing.T) {
	t.Run("empty query", func(t *testing.T) {
		datasource := NewDatasource()
		pluginCtx := backend.PluginContext{
			OrgID: 1,
			AppInstanceSettings: &backend.AppInstanceSettings{
				Updated: time.Now(),
			},
			DataSourceInstanceSettings: &backend.DataSourceInstanceSettings{},
		}

		response, err := datasource.QueryData(context.Background(), &backend.QueryDataRequest{
			PluginContext: pluginCtx,
			Queries: []backend.DataQuery{
				{
					RefID: "A",
					JSON: []byte(`
                    {
                        "expr": ""
                    }
                    `),
				},
			},
		})

		require.NoError(t, err)
		require.Empty(t, response.Responses["A"].Frames)
	})

	t.Run("query disk.dev.read{hostname==\"localhost\"}, perform rate conversion and return the result", func(t *testing.T) {
		handler := http.NewServeMux()
		handler.HandleFunc("/series/query", func(writer http.ResponseWriter, request *http.Request) {
			require.Equal(t, `disk.dev.read{hostname=="localhost"}`, request.URL.Query().Get("expr"))
			response, _ := json.Marshal(pmseriesf.Query([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/metrics", func(writer http.ResponseWriter, request *http.Request) {
			require.Equal(t, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9", request.URL.Query().Get("series"))
			response, _ := json.Marshal(pmseriesf.Metrics([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/descs", func(writer http.ResponseWriter, request *http.Request) {
			require.Equal(t, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9", request.URL.Query().Get("series"))
			response, _ := json.Marshal(pmseriesf.Descs([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/values", func(writer http.ResponseWriter, request *http.Request) {
			require.Equal(t, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9", request.URL.Query().Get("series"))
			response, _ := json.Marshal(pmseriesf.Values([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/instances", func(writer http.ResponseWriter, request *http.Request) {
			require.Equal(t, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9", request.URL.Query().Get("series"))
			response, _ := json.Marshal(pmseriesf.Instances([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/labels", func(writer http.ResponseWriter, request *http.Request) {
			response, _ := json.Marshal(pmseriesf.Labels([]string{"7f3afb6f41e53792b18e52bcec26fdfa2899fa58", "0aeab8b239522ab0640577ed788cc601fc640266"}))
			writer.Write(response)
		})

		srv := httptest.NewServer(handler)
		defer srv.Close()

		pmseriesAPI := pmseries.NewPmseriesAPI(srv.URL, nil)
		seriesService, _ := series.NewSeriesService(pmseriesAPI, 1024)
		datasourceInstance := &redisDatasourceInstance{
			pmseriesAPI:     pmseriesAPI,
			resourceService: resource.NewResourceService(pmseriesAPI),
			seriesService:   seriesService,
		}

		response, err := datasourceInstance.handleTimeSeriesQueries(context.Background(), &backend.QueryDataRequest{
			//PluginContext: pluginCtx,
			Queries: []backend.DataQuery{
				{
					RefID: "A",
					JSON: []byte(`
                    {
                        "expr": "disk.dev.read{hostname==\"localhost\"}",
                        "format": "time_series"
                    }
                    `),
				},
			},
		})

		require.NoError(t, err)
		require.Len(t, response.Responses["A"].Frames, 1)

		frame := response.Responses["A"].Frames[0]
		require.Len(t, frame.Fields, 3)
		require.Equal(t, 1, frame.Fields[0].Len()) // it's a counter metric with two values
		require.Equal(t, int64(1599320692309872128), frame.Fields[0].At(0).(time.Time).UnixNano())
		require.Equal(t, "disk.dev.read[nvme0n1]", frame.Fields[1].Name)
		require.Equal(t, float64(200), *frame.Fields[1].At(0).(*float64))
		require.Equal(t, "disk.dev.read[sda]", frame.Fields[2].Name)
		require.Equal(t, float64(300), *frame.Fields[2].At(0).(*float64))
	})
}
