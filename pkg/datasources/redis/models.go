package redis

import "github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api"

// Series is a single time series with descriptor, labels and instances, but without values
type Series struct {
	MetricName string
	Desc       SeriesDesc
	Labels     Labels
	Instances  map[string]SeriesInstance
}

// SeriesDesc describes a metric
type SeriesDesc = api.DescsResponseItem

// SeriesInstance holds information about a PCP instance
type SeriesInstance struct {
	Series   string
	Instance string
	Name     string
	Labels   Labels
}

// Labels structure for storing labels
type Labels map[string]interface{}

// Query is a single redis query (target)
type Query struct {
	Expr         string `json:"expr"`
	Format       string `json:"format"`
	LegendFormat string `json:"legendFormat"`
}

// MetricFindValue is the response for metricFindQuery
type MetricFindValue struct {
	Text string `json:"text"`
}
