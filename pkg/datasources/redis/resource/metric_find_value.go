package resource

import (
	"regexp"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

var metricNamesRegex = regexp.MustCompile(`^metrics\(\s*([a-zA-Z0-9._*]*)\s*\)$`)
var labelValuesRegex = regexp.MustCompile(`^label_values\(\s*([a-zA-Z][a-zA-Z0-9._]*)\s*\)$`)
var labelValuesForMetricRegex = regexp.MustCompile(`^label_values\(\s*([a-zA-Z][a-zA-Z0-9._]*)\s*,\s*([a-zA-Z][a-zA-Z0-9._]*)\s*\)$`)

func (rs *Service) getMetricNames(pattern string) ([]MetricFindValue, error) {
	if pattern == "" {
		pattern = "*"
	}

	namesResponse, err := rs.pmseriesAPI.MetricNameMatches(pattern)
	if err != nil {
		return nil, err
	}

	metricFindValues := []MetricFindValue{}
	for _, name := range namesResponse {
		metricFindValues = append(metricFindValues, MetricFindValue{name})
	}
	return metricFindValues, nil
}

func (rs *Service) metricFindQuery(query string) ([]MetricFindValue, error) {
	log.DefaultLogger.Debug("metricFindQuery", "query", query)

	metricNamesQuery := metricNamesRegex.FindStringSubmatch(query)
	if len(metricNamesQuery) == 2 {
		return rs.getMetricNames(metricNamesQuery[1])
	}

	labelValuesQuery := labelValuesRegex.FindStringSubmatch(query)
	if len(labelValuesQuery) == 2 {
		return rs.getLabelValues(labelValuesQuery[1])
	}

	// deprecated
	labelValuesForMetricQuery := labelValuesForMetricRegex.FindStringSubmatch(query)
	log.DefaultLogger.Debug("metricFindQuery", "labelValuesForMetricQuery", labelValuesForMetricQuery)

	if len(labelValuesForMetricQuery) == 3 {
		return rs.getLabelValues(labelValuesForMetricQuery[2])
	}

	return []MetricFindValue{}, nil
}
