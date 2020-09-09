package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"math"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

func (ds *redisDatasourceInstance) memoizeSeries(seriesIds []string) (map[string]*Series, error) {
	seriesMap := map[string]*Series{}
	missingSeries := []string{}

	for _, seriesID := range seriesIds {
		series, ok := ds.seriesCache[seriesID]
		if ok {
			seriesMap[seriesID] = series
		} else {
			missingSeries = append(missingSeries, seriesID)
		}
	}

	if len(missingSeries) == 0 {
		return seriesMap, nil
	}
	log.DefaultLogger.Info("Series metadata not in cache, requesting...", "series", missingSeries)

	namesResponse, err := ds.pmseriesAPI.Metrics(missingSeries)
	if err != nil {
		return nil, err
	}

	descsResponse, err := ds.pmseriesAPI.Descs(missingSeries)
	if err != nil {
		return nil, err
	}

	seriesWithoutIndom := []string{}
	for _, desc := range descsResponse {
		if desc.Indom == "none" {
			seriesWithoutIndom = append(seriesWithoutIndom, desc.Series)
		}
	}

	// only metrics without indoms have the labels attached to the series,
	// metrics with indoms have it attached to the instance
	var labelsResponse []api.LabelsResponseItem
	if len(seriesWithoutIndom) > 0 {
		labelsResponse, err = ds.pmseriesAPI.Labels(seriesWithoutIndom)
		if err != nil {
			return nil, err
		}
	}

	for _, desc := range descsResponse {
		seriesID := desc.Series

		var metricName string
		for _, nameResponse := range namesResponse {
			if nameResponse.Series == seriesID {
				metricName = nameResponse.Name
				break
			}
		}
		if metricName == "" {
			return nil, fmt.Errorf("Could not find metric name for series %s", seriesID)
		}

		var labels Labels
		for _, labelResponse := range labelsResponse {
			if labelResponse.Series == seriesID {
				labels = labelResponse.Labels
				break
			}
		}

		var instances map[string]SeriesInstance
		if desc.Indom == "none" {
			instances = nil
		} else {
			instances = map[string]SeriesInstance{}
		}

		series := &Series{
			MetricName: metricName,
			Desc:       desc,
			Labels:     labels,
			Instances:  instances,
		}
		ds.seriesCache[seriesID] = series
		seriesMap[seriesID] = series
	}

	return seriesMap, nil
}

func (ds *redisDatasourceInstance) refreshInstances(series *Series) error {
	instances, err := ds.pmseriesAPI.Instances([]string{series.Desc.Series})
	if err != nil {
		return err
	}

	for _, instance := range instances {
		labelsResponse, err := ds.pmseriesAPI.Labels([]string{instance.Instance})
		if err != nil {
			return err
		}

		labels := Labels{}
		if len(labelsResponse) > 0 {
			labels = labelsResponse[0].Labels
		}

		series.Instances[instance.Instance] = SeriesInstance{
			Series:   instance.Series,
			Instance: instance.Instance,
			Name:     instance.Name,
			Labels:   labels,
		}
	}

	return nil
}

func (ds *redisDatasourceInstance) executeTimeSeriesQuery(dataQuery *backend.DataQuery, redisQuery *Query) (data.Frames, error) {
	seriesIds, err := ds.pmseriesAPI.Query(redisQuery.Expr)
	if err != nil {
		return nil, err
	}
	if len(seriesIds) == 0 {
		return data.Frames{}, nil
	}

	series, err := ds.memoizeSeries(seriesIds)
	if err != nil {
		return nil, err
	}

	interval := dataQuery.Interval.Seconds()
	// request a bigger time frame to fill the chart (otherwise left and right border of chart is empty)
	// because of the rate conversation of counters first datapoint my be "lost" -> expand timeframe at the beginning
	additionalTimeRange := int64(math.Max(interval, 60))             // 60s is the default sample interval of pmlogger
	start := dataQuery.TimeRange.From.Unix() - 2*additionalTimeRange // seconds
	finish := dataQuery.TimeRange.To.Unix() + additionalTimeRange    // seconds
	values, err := ds.pmseriesAPI.Values(seriesIds, start, finish, int64(interval))
	if err != nil {
		return nil, err
	}

	frames, err := ds.createDataFrames(redisQuery, series, values)
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

	log.DefaultLogger.Info("Query", "query", &redisQuery)
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
