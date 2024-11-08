package valkey

import (
	"context"
	"encoding/json"
	"fmt"
	"math"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

// The PCP valkey data source executes the following HTTP requests to gather the required data for a time series query:
//
// (1) `/series/query?expr=...` to get a list of series ids
// (2) `/series/metrics?series=...` to get the metric names of each series
// (3) `/series/descs?series=...` to get the metric unit and semantics of each series
// (4) for metrics without instances: `/series/labels?series=...` to get labels of each series
// (5) `/series/values?series=...&start=...&finish=...&interval=...` to get the metric and instance values
// (6) for metrics with instances: `/series/instances?series=...` to get the instance names
// (7) for metrics with instances: `/series/labels?series=...` to get labels of each instance
//
// Overall, that's 5 (or 6) HTTP requests for the initial query.
// Most metadata can be cached, therefore subsequent queries (same query with a different timeframe) can skip requests
// 2-4 and 6-7 in case there is no new series or new instance involved (depends on the timeframe; series and instances
// can appear and disappear).
//
// When a pmseries query matches many series (e.g. many hosts) or series with many instances, the list of series ids
// can get quite long, too long to fit into an URL. Therefore the list of series ids is sent in the request body of a
// POST request, even though it should be (semantically) a GET request.
func (ds *valkeyDatasourceInstance) executeTimeSeriesQuery(dataQuery *backend.DataQuery, valkeyQuery *Query) (data.Frames, error) {
	if valkeyQuery.Expr == "" {
		return data.Frames{}, nil
	}

	seriesIds, err := ds.pmseriesAPI.Query(valkeyQuery.Expr)
	if err != nil {
		return nil, err
	}
	if len(seriesIds) == 0 {
		return nil, fmt.Errorf("cannot find any series for query '%s'", valkeyQuery.Expr)
	}

	series, err := ds.seriesService.GetSeries(seriesIds)
	if err != nil {
		return nil, err
	}

	interval := dataQuery.Interval.Seconds()
	// request a bigger time frame to fill the chart (otherwise left and right border of chart is empty)
	// because of the rate conversion of counters first datapoint my be "lost" -> expand timeframe at the beginning
	additionalTimeRange := int64(math.Max(interval, 60))             // 60s is the default sample interval of pmlogger
	start := dataQuery.TimeRange.From.Unix() - 2*additionalTimeRange // seconds
	finish := dataQuery.TimeRange.To.Unix() + additionalTimeRange    // seconds
	values, err := ds.pmseriesAPI.Values(seriesIds, start, finish, int64(interval))
	if err != nil {
		return nil, err
	}

	frames, err := ds.processQuery(valkeyQuery, series, values)
	if err != nil {
		return nil, err
	}
	return frames, nil
}

func (ds *valkeyDatasourceInstance) handleTimeSeriesQuery(ctx context.Context, dataQuery *backend.DataQuery) backend.DataResponse {
	response := backend.DataResponse{}

	valkeyQuery := DefaultQuery()
	err := json.Unmarshal(dataQuery.JSON, &valkeyQuery)
	if err != nil {
		response.Error = err
		return response
	}

	log.DefaultLogger.Debug("Query", "query", &valkeyQuery)
	frames, err := ds.executeTimeSeriesQuery(dataQuery, &valkeyQuery)
	if err != nil {
		response.Error = err
	} else {
		response.Frames = frames
	}

	return response
}

// handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifer).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (ds *valkeyDatasourceInstance) handleTimeSeriesQueries(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	log.DefaultLogger.Debug("handleTimeSeriesQueries", "request", req)

	response := backend.NewQueryDataResponse()
	for _, q := range req.Queries {
		res := ds.handleTimeSeriesQuery(ctx, &q)
		response.Responses[q.RefID] = res
	}
	return response, nil
}
