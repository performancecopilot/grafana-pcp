package series

import (
	"fmt"
	"sync"

	lru "github.com/hashicorp/golang-lru"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/valkey/api/pmseries"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

// Service retrieves and caches series
type Service struct {
	pmseriesAPI pmseries.API
	mu          sync.Mutex // guards cache
	cache       *lru.Cache
}

// NewSeriesService creates a new resource service
func NewSeriesService(pmseriesAPI pmseries.API, cacheSize int) (*Service, error) {
	cache, err := lru.New(cacheSize)
	if err != nil {
		return nil, err
	}

	return &Service{
		pmseriesAPI: pmseriesAPI,
		cache:       cache,
	}, nil
}

// GetSeries retrieves multiple series and caches them
// this will be called from different goroutines (each QueryData call runs in a new goroutine)
// let's keep it simple and stupid for now with a lock
// if this isn't sufficient anymore, a solution like https://notes.shichao.io/gopl/ch9/#example-concurrent-non-blocking-cache
// will be required - a concurrent non-blocking memoizing cache,
// where the memoize function processes multiple keys
func (s *Service) GetSeries(sids []string) (map[string]*Series, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	seriesMap := map[string]*Series{}
	missingSeries := []string{}

	for _, sid := range sids {
		series, ok := s.cache.Get(sid)
		if ok {
			seriesMap[sid] = series.(*Series)
		} else {
			missingSeries = append(missingSeries, sid)
		}
	}

	if len(missingSeries) == 0 {
		return seriesMap, nil
	}
	log.DefaultLogger.Debug("Series metadata not in cache, requesting...", "series", missingSeries)

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
			return nil, fmt.Errorf("could not find metric name for series '%s'", sid)
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
		s.cache.Add(sid, series)
		seriesMap[sid] = series
	}

	return seriesMap, nil
}

// RefreshInstances refreshes instances of a series
func (s *Service) RefreshInstances(series *Series) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	instancesResponse, err := s.pmseriesAPI.Instances([]string{series.Desc.Series})
	if err != nil {
		return err
	}
	if len(instancesResponse) == 0 {
		return fmt.Errorf("received no instances for series '%s' which has an instance domain", series.Desc.Series)
	}

	seriesIds := []string{}
	for _, instance := range instancesResponse {
		seriesIds = append(seriesIds, instance.Instance)
	}

	labelsResponse, err := s.pmseriesAPI.Labels(seriesIds)
	if err != nil {
		return err
	}
	labelsByInstance := map[string]Labels{}
	for _, labelResponse := range labelsResponse {
		labelsByInstance[labelResponse.Series] = labelResponse.Labels
	}

	for _, instance := range instancesResponse {
		series.Instances[instance.Instance] = Instance{
			Instance: instance.Instance,
			Name:     instance.Name,
			Labels:   labelsByInstance[instance.Instance],
		}
	}

	return nil
}
