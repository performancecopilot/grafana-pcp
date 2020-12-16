package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"math"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

func (ds *redisDatasourceInstance) executeTimeSeriesQuery(dataQuery *backend.DataQuery, redisQuery *Query) (data.Frames, error) {
	if redisQuery.Expr == "" {
		return data.Frames{}, nil
	}

	seriesIds, err := ds.pmseriesAPI.Query(redisQuery.Expr)
	if err != nil {
		return nil, err
	}
	if len(seriesIds) == 0 {
		return nil, fmt.Errorf("cannot find any series for query '%s'", redisQuery.Expr)
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

	frames, err := ds.processQuery(redisQuery, series, values)
	if err != nil {
		return nil, err
	}
	return frames, nil
}

func (ds *redisDatasourceInstance) handleTimeSeriesQuery(ctx context.Context, dataQuery *backend.DataQuery) backend.DataResponse {
	response := backend.DataResponse{}

	var redisQuery Query
	err := json.Unmarshal(dataQuery.JSON, &redisQuery)
	if err != nil {
		response.Error = err
		return response
	}

	log.DefaultLogger.Debug("Query", "query", &redisQuery)
	frames, err := ds.executeTimeSeriesQuery(dataQuery, &redisQuery)
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
func (ds *redisDatasourceInstance) handleTimeSeriesQueries(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	log.DefaultLogger.Debug("handleTimeSeriesQueries", "request", req)

	response := backend.NewQueryDataResponse()
	for _, q := range req.Queries {
		res := ds.handleTimeSeriesQuery(ctx, &q)
		response.Responses[q.RefID] = res
	}
	return response, nil
}
