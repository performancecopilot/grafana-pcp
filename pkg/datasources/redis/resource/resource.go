package resource

import (
	"fmt"
	"net/url"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"
)

type Service struct {
	pmseriesAPI pmseries.API
}

// NewResourceService creates a new resource service
func NewResourceService(pmseriesAPI pmseries.API) *Service {
	return &Service{pmseriesAPI}
}

func (rs *Service) CallResource(method string, queryParams url.Values) (interface{}, error) {
	switch method {
	case "metricFindQuery":
		query, ok := queryParams["query"]
		if !ok || len(query) != 1 {
			return nil, fmt.Errorf("Invalid query passed to metricFindQuery")
		}
		return rs.metricFindQuery(query[0])
	default:
		return nil, fmt.Errorf("Unknown method %s", method)
	}
}
