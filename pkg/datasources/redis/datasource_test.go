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

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/resource"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
	. "github.com/smartystreets/goconvey/convey"
)

func TestDatasource(t *testing.T) {
	Convey("empty query", t, func() {
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

		So(err, ShouldBeNil)
		So(response.Responses["A"].Frames, ShouldBeEmpty)
	})

	Convey("query disk.dev.read{hostname==\"localhost\"}, perform rate conversion and return the result", t, func(c C) {
		handler := http.NewServeMux()
		handler.HandleFunc("/series/query", func(writer http.ResponseWriter, request *http.Request) {
			c.So(request.URL.Query().Get("expr"), ShouldEqual, `disk.dev.read{hostname=="localhost"}`)
			response, _ := json.Marshal(pmseriesf.Query([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/metrics", func(writer http.ResponseWriter, request *http.Request) {
			c.So(request.URL.Query().Get("series"), ShouldEqual, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9")
			response, _ := json.Marshal(pmseriesf.Metrics([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/descs", func(writer http.ResponseWriter, request *http.Request) {
			c.So(request.URL.Query().Get("series"), ShouldEqual, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9")
			response, _ := json.Marshal(pmseriesf.Descs([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/values", func(writer http.ResponseWriter, request *http.Request) {
			c.So(request.URL.Query().Get("series"), ShouldEqual, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9")
			response, _ := json.Marshal(pmseriesf.Values([]string{"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9"}))
			writer.Write(response)
		})
		handler.HandleFunc("/series/instances", func(writer http.ResponseWriter, request *http.Request) {
			c.So(request.URL.Query().Get("series"), ShouldEqual, "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9")
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
		datasourceInstance := &redisDatasourceInstance{
			pmseriesAPI:     pmseriesAPI,
			resourceService: resource.NewResourceService(pmseriesAPI),
			seriesService:   series.NewSeriesService(pmseriesAPI),
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

		So(err, ShouldBeNil)
		So(response.Responses["A"].Frames, ShouldHaveLength, 1)
		So(response.Responses["A"].Frames[0].Fields, ShouldHaveLength, 3)
		So(response.Responses["A"].Frames[0].Fields[0].Len(), ShouldEqual, 1) // it's a counter metric with two values
		So(response.Responses["A"].Frames[0].Fields[0].At(0).(time.Time).UnixNano(), ShouldEqual, int64(1599320692309872128))
		So(response.Responses["A"].Frames[0].Fields[1].Name, ShouldEqual, "disk.dev.read[nvme0n1]")
		So(*response.Responses["A"].Frames[0].Fields[1].At(0).(*float64), ShouldEqual, 200)
		So(response.Responses["A"].Frames[0].Fields[2].Name, ShouldEqual, "disk.dev.read[sda]")
		So(*response.Responses["A"].Frames[0].Fields[2].At(0).(*float64), ShouldEqual, 300)
	})
}
