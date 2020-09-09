package resource

import (
	"fmt"
	"net/url"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api"
)

type Service struct {
	pmseriesAPI *api.PmseriesAPI
}

// NewResourceService creates a new resource service
func NewResourceService(pmseriesAPI *api.PmseriesAPI) *Service {
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
	case "getLabelNames":
		return rs.getLabelNames()
	case "getLabelValues":
		labelName, ok := queryParams["name"]
		if !ok || len(labelName) != 1 {
			return nil, fmt.Errorf("Invalid query passed to getLabelValues")
		}
		return rs.getLabelValues(labelName[0])
	default:
		return nil, fmt.Errorf("Unknown method %s", method)
	}
}
