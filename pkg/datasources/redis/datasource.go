package redis

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/resource"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
)

// NewDatasource returns datasource.ServeOpts.
func NewDatasource() datasource.ServeOpts {
	im := datasource.NewInstanceManager(newDataSourceInstance)
	ds := &redisDatasource{
		im: im,
	}

	mux := datasource.NewQueryTypeMux()
	mux.HandleFunc("", func(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
		var response *backend.QueryDataResponse
		return response, ds.im.Do(req.PluginContext, func(dsInst *redisDatasourceInstance) error {
			var err error
			response, err = dsInst.handleTimeSeriesQueries(ctx, req)
			return err
		})
	})

	return datasource.ServeOpts{
		QueryDataHandler:    mux,
		CheckHealthHandler:  ds,
		CallResourceHandler: ds,
	}
}

type redisDatasource struct {
	im instancemgmt.InstanceManager
}

type redisDatasourceInstance struct {
	pmseriesAPI     pmseries.API
	resourceService *resource.Service
	seriesService   *series.Service
}

func newDataSourceInstance(setting backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	pmseriesAPI := pmseries.NewPmseriesAPI(setting.URL)

	return &redisDatasourceInstance{
		pmseriesAPI:     pmseriesAPI,
		resourceService: resource.NewResourceService(pmseriesAPI),
		seriesService:   series.NewSeriesService(pmseriesAPI),
	}, nil
}

func (ds *redisDatasourceInstance) Dispose() {
	// Called before creating a new instance
}

func (ds *redisDatasource) CallResource(ctx context.Context, req *backend.CallResourceRequest, sender backend.CallResourceResponseSender) error {
	u, err := url.Parse(req.URL)
	if err != nil {
		return err
	}

	queryParams, err := url.ParseQuery(u.RawQuery)
	if err != nil {
		return err
	}

	method := u.Path
	return ds.im.Do(req.PluginContext, func(dsInst *redisDatasourceInstance) error {
		status := http.StatusOK
		result, err := dsInst.resourceService.CallResource(method, queryParams)
		if err != nil {
			status = http.StatusInternalServerError
			result = struct {
				Error string `json:"error"`
			}{err.Error()}
		}

		respBody, err := json.Marshal(result)
		if err != nil {
			return err
		}

		return sender.Send(&backend.CallResourceResponse{
			Status: status,
			Body:   respBody,
		})
	})
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (ds *redisDatasource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	var result *backend.CheckHealthResult
	err := ds.im.Do(req.PluginContext, func(dsInst *redisDatasourceInstance) error {
		pingResponse, err := dsInst.pmseriesAPI.Ping()

		if err != nil {
			result = &backend.CheckHealthResult{
				Status:  backend.HealthStatusError,
				Message: err.Error(),
			}
		} else if !pingResponse.Success {
			result = &backend.CheckHealthResult{
				Status:  backend.HealthStatusError,
				Message: "Datasource is not working. Please check if Redis is running and consult the pmproxy logs.",
			}
		} else {
			result = &backend.CheckHealthResult{
				Status:  backend.HealthStatusOk,
				Message: "Data source is working",
			}
		}
		return nil
	})
	return result, err
}
