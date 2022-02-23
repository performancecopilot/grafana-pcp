package resource

import (
	"fmt"
	"regexp"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

var metricNamesRegex = regexp.MustCompile(`^metrics\(\s*([\w.*]*)\s*\)$`)
var labelNamesRegex = regexp.MustCompile(`^label_names\(\s*([\w.]*)\s*\)$`)
var labelValuesRegex = regexp.MustCompile(`^label_values\(\s*([\w.]+)\s*\)$`)
var labelValuesForMetricRegex = regexp.MustCompile(`^label_values\(\s*([a-zA-Z][a-zA-Z0-9._]*)\s*,\s*([a-zA-Z][a-zA-Z0-9._]*)\s*\)$`)

func (rs *Service) getMetricNames(pattern string) ([]MetricFindValue, error) {
	if pattern == "" {
		pattern = "*"
	}

	namesResponse, err := rs.pmseriesAPI.MetricNames(pattern)
	if err != nil {
		return nil, err
	}

	metricFindValues := []MetricFindValue{}
	for _, name := range namesResponse {
		metricFindValues = append(metricFindValues, MetricFindValue{name})
	}
	return metricFindValues, nil
}

func (rs *Service) getLabelNames(pattern string) ([]MetricFindValue, error) {
	if pattern == "" {
		pattern = "*"
	}

	labelNamesResponse, err := rs.pmseriesAPI.LabelNames(pattern)
	if err != nil {
		return nil, err
	}

	ret := []MetricFindValue{}
	for _, name := range labelNamesResponse {
		ret = append(ret, MetricFindValue{name})
	}
	return ret, nil
}

func (rs *Service) getLabelValues(labelName string) ([]MetricFindValue, error) {
	labelValuesResponse, err := rs.pmseriesAPI.LabelValues([]string{labelName})
	if err != nil {
		return nil, err
	}

	ret := []MetricFindValue{}
	for _, value := range labelValuesResponse[labelName] {
		ret = append(ret, MetricFindValue{fmt.Sprintf("%v", value)})
	}
	return ret, nil
}

func (rs *Service) metricFindQuery(query string) ([]MetricFindValue, error) {
	log.DefaultLogger.Debug("metricFindQuery", "query", query)

	metricNamesQuery := metricNamesRegex.FindStringSubmatch(query)
	if len(metricNamesQuery) == 2 {
		return rs.getMetricNames(metricNamesQuery[1])
	}

	labelNamesQuery := labelNamesRegex.FindStringSubmatch(query)
	if len(labelNamesQuery) == 2 {
		return rs.getLabelNames(labelNamesQuery[1])
	}

	labelValuesQuery := labelValuesRegex.FindStringSubmatch(query)
	if len(labelValuesQuery) == 2 {
		return rs.getLabelValues(labelValuesQuery[1])
	}

	// deprecated
	labelValuesForMetricQuery := labelValuesForMetricRegex.FindStringSubmatch(query)
	log.DefaultLogger.Info("Using deprecated query label_values(metric, label)", "query", query)
	if len(labelValuesForMetricQuery) == 3 {
		return rs.getLabelValues(labelValuesForMetricQuery[2])
	}

	return []MetricFindValue{}, nil
}
