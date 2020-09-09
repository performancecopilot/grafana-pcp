package series

import (
	"fmt"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

// Service retrieves and caches series
type Service struct {
	pmseriesAPI pmseries.API
	cache       map[string]*Series
}

// NewSeriesService creates a new resource service
func NewSeriesService(pmseriesAPI pmseries.API) *Service {
	return &Service{
		pmseriesAPI: pmseriesAPI,
		cache:       map[string]*Series{},
	}
}

// GetSeries retrieves multiple series and caches them
func (s *Service) GetSeries(sids []string) (map[string]*Series, error) {
	seriesMap := map[string]*Series{}
	missingSeries := []string{}

	for _, sid := range sids {
		series, ok := s.cache[sid]
		if ok {
			seriesMap[sid] = series
		} else {
			missingSeries = append(missingSeries, sid)
		}
	}

	if len(missingSeries) == 0 {
		return seriesMap, nil
	}
	log.DefaultLogger.Info("Series metadata not in cache, requesting...", "series", missingSeries)

	namesResponse, err := s.pmseriesAPI.Metrics(missingSeries)
	if err != nil {
		return nil, err
	}

	descsResponse, err := s.pmseriesAPI.Descs(missingSeries)
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
	var labelsResponse []pmseries.LabelsResponseItem
	if len(seriesWithoutIndom) > 0 {
		labelsResponse, err = s.pmseriesAPI.Labels(seriesWithoutIndom)
		if err != nil {
			return nil, err
		}
	}

	for _, desc := range descsResponse {
		sid := desc.Series

		var metricName string
		for _, nameResponse := range namesResponse {
			if nameResponse.Series == sid {
				metricName = nameResponse.Name
				break
			}
		}
		if metricName == "" {
			return nil, fmt.Errorf("Could not find metric name for series %s", sid)
		}

		var labels Labels
		for _, labelResponse := range labelsResponse {
			if labelResponse.Series == sid {
				labels = labelResponse.Labels
				break
			}
		}

		var instances map[string]Instance
		if desc.Indom == "none" {
			instances = nil
		} else {
			instances = map[string]Instance{}
		}

		series := &Series{
			MetricName: metricName,
			Desc:       desc,
			Labels:     labels,
			Instances:  instances,
		}
		s.cache[sid] = series
		seriesMap[sid] = series
	}

	return seriesMap, nil
}

// RefreshInstances refreshes instances of a series
func (s *Service) RefreshInstances(series *Series) error {
	instances, err := s.pmseriesAPI.Instances([]string{series.Desc.Series})
	if err != nil {
		return err
	}

	for _, instance := range instances {
		labelsResponse, err := s.pmseriesAPI.Labels([]string{instance.Instance})
		if err != nil {
			return err
		}

		labels := Labels{}
		if len(labelsResponse) > 0 {
			labels = labelsResponse[0].Labels
		}

		series.Instances[instance.Instance] = Instance{
			Series:   instance.Series,
			Instance: instance.Instance,
			Name:     instance.Name,
			Labels:   labels,
		}
	}

	return nil
}
