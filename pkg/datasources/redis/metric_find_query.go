package redis

import (
	"regexp"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

var metricNamesRegex = regexp.MustCompile(`^metrics\(\s*([a-zA-Z0-9._*]*)\s*\)$`)
var labelValuesRegex = regexp.MustCompile(`^label_values\(\s*([a-zA-Z][a-zA-Z0-9._]*)\s*\)$`)
var labelValuesForMetricRegex = regexp.MustCompile(`^label_values\(\s*([a-zA-Z][a-zA-Z0-9._]*)\s*,\s*([a-zA-Z][a-zA-Z0-9._]*)\s*\)$`)

func (ds *redisDatasourceInstance) handleMetricNamesQuery(pattern string) ([]MetricFindValue, error) {
	if pattern == "" {
		pattern = "*"
	}

	namesResponse, err := ds.pmseriesAPI.MetricNameMatches(pattern)
	if err != nil {
		return nil, err
	}

	metricFindValues := []MetricFindValue{}
	for _, name := range namesResponse {
		metricFindValues = append(metricFindValues, MetricFindValue{
			Text: name,
		})
	}
	return metricFindValues, nil
}

func (ds *redisDatasourceInstance) handleLabelValuesQuery(labelKey string) ([]MetricFindValue, error) {
	labelValuesResponse, err := ds.pmseriesAPI.LabelValues([]string{labelKey})
	if err != nil {
		return nil, err
	}

	metricFindValues := []MetricFindValue{}
	for _, labelValue := range labelValuesResponse[labelKey] {
		metricFindValues = append(metricFindValues, MetricFindValue{
			Text: labelValue,
		})
	}
	return metricFindValues, nil
}

func (ds *redisDatasourceInstance) metricFindQuery(query string) ([]MetricFindValue, error) {
	log.DefaultLogger.Debug("metricFindQuery", "query", query)

	metricNamesQuery := metricNamesRegex.FindStringSubmatch(query)
	if len(metricNamesQuery) == 2 {
		return ds.handleMetricNamesQuery(metricNamesQuery[1])
	}

	labelValuesQuery := labelValuesRegex.FindStringSubmatch(query)
	if len(labelValuesQuery) == 2 {
		return ds.handleLabelValuesQuery(labelValuesQuery[1])
	}

	// deprecated
	labelValuesForMetricQuery := labelValuesForMetricRegex.FindStringSubmatch(query)
	log.DefaultLogger.Debug("metricFindQuery", "labelValuesForMetricQuery", labelValuesForMetricQuery)

	if len(labelValuesForMetricQuery) == 3 {
		return ds.handleLabelValuesQuery(labelValuesForMetricQuery[2])
	}

	return []MetricFindValue{}, nil
}
