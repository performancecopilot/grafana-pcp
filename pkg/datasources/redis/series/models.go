package series

import "github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"

// Series is a single time series with descriptor, labels and instances, but without values
type Series struct {
	MetricName string
	Desc       Desc
	Labels     Labels
	Instances  map[string]Instance
}

// Desc describes a metric
type Desc = pmseries.DescsResponseItem

// Instance holds information about a PCP instance
type Instance struct {
	Series   string
	Instance string
	Name     string
	Labels   Labels
}

// Labels structure for storing labels
type Labels map[string]interface{}
