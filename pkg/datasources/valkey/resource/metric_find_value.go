package resource

import (
	"context"
	"fmt"
	"regexp"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

var metricNamesRegex = regexp.MustCompile(`^metrics\(\s*([\w.*]*)\s*\)$`)
var labelNamesRegex = regexp.MustCompile(`^label_names\(\s*([\w.]*)\s*\)$`)
var labelValuesRegex = regexp.MustCompile(`^label_values\(\s*([\w.]+)\s*\)$`)

func (rs *Service) getMetricNames(ctx context.Context, pattern string) ([]MetricFindValue, error) {
	if pattern == "" {
		pattern = "*"
	}

	namesResponse, err := rs.pmseriesAPI.MetricNames(ctx, pattern)
	if err != nil {
		return nil, err
	}

	metricFindValues := []MetricFindValue{}
	for _, name := range namesResponse {
		metricFindValues = append(metricFindValues, MetricFindValue{name})
	}
	return metricFindValues, nil
}

func (rs *Service) getLabelNames(ctx context.Context, pattern string) ([]MetricFindValue, error) {
	if pattern == "" {
		pattern = "*"
	}

	labelNamesResponse, err := rs.pmseriesAPI.LabelNames(ctx, pattern)
	if err != nil {
		return nil, err
	}

	ret := []MetricFindValue{}
	for _, name := range labelNamesResponse {
		ret = append(ret, MetricFindValue{name})
	}
	return ret, nil
}

func (rs *Service) getLabelValues(ctx context.Context, labelName string) ([]MetricFindValue, error) {
	labelValuesResponse, err := rs.pmseriesAPI.LabelValues(ctx, []string{labelName})
	if err != nil {
		return nil, err
	}

	ret := []MetricFindValue{}
	for _, value := range labelValuesResponse[labelName] {
		ret = append(ret, MetricFindValue{fmt.Sprintf("%v", value)})
	}
	return ret, nil
}

func (rs *Service) metricFindQuery(ctx context.Context, query string) ([]MetricFindValue, error) {
	log.DefaultLogger.Debug("metricFindQuery", "query", query)

	metricNamesQuery := metricNamesRegex.FindStringSubmatch(query)
	if len(metricNamesQuery) == 2 {
		return rs.getMetricNames(ctx, metricNamesQuery[1])
	}

	labelNamesQuery := labelNamesRegex.FindStringSubmatch(query)
	if len(labelNamesQuery) == 2 {
		return rs.getLabelNames(ctx, labelNamesQuery[1])
	}

	labelValuesQuery := labelValuesRegex.FindStringSubmatch(query)
	if len(labelValuesQuery) == 2 {
		return rs.getLabelValues(ctx, labelValuesQuery[1])
	}

	return []MetricFindValue{}, nil
}
