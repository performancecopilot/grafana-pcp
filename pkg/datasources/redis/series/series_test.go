package series

import (
	"fmt"
	"math/rand"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"
	"github.com/stretchr/testify/require"
)

type pmseriesAPIMock struct {
	metricsCalls uint32
}

func (api *pmseriesAPIMock) Ping() (pmseries.GenericSuccessResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Query(expr string) (pmseries.QueryResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Metrics(series []string) ([]pmseries.MetricsResponseItem, error) {
	atomic.AddUint32(&api.metricsCalls, 1)
	time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)

	m := []pmseries.MetricsResponseItem{}
	for _, sid := range series {
		m = append(m, pmseries.MetricsResponseItem{
			Series: sid,
			Name:   fmt.Sprintf("metric name for %s", sid),
		})
	}
	return m, nil
}

func (api *pmseriesAPIMock) MetricNames(match string) (pmseries.MetricNamesResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Descs(series []string) ([]pmseries.DescsResponseItem, error) {
	time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)

	d := []pmseries.DescsResponseItem{}
	for _, sid := range series {
		d = append(d, pmseries.DescsResponseItem{
			Series: sid,
		})
	}
	return d, nil
}

func (api *pmseriesAPIMock) Instances(series []string) ([]pmseries.InstancesResponseItem, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Labels(series []string) ([]pmseries.LabelsResponseItem, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) LabelNames(pattern string) (pmseries.LabelNamesResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) LabelValues(labelNames []string) (pmseries.LabelValuesResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Values(series []string, start int64, finish int64, interval int64) ([]pmseries.ValuesResponseItem, error) {
	panic("not implemented")
}

func query(wg *sync.WaitGroup, s *Service, sid string) (map[string]*Series, error) {
	defer wg.Done()

	fmt.Printf("sending query %s\n", sid)
	series, err := s.GetSeries([]string{sid})
	fmt.Printf("received series %s\n", sid)
	return series, err
}

func TestSeriesService(t *testing.T) {
	t.Run("Concurrent access", func(t *testing.T) {
		api := &pmseriesAPIMock{}
		s, _ := NewSeriesService(api, 10)
		var wg sync.WaitGroup

		// add series to cache
		for i := 0; i < 5; i++ {
			wg.Add(1)
			go query(&wg, s, fmt.Sprintf("sid %d", i))
		}
		// request same series
		for i := 0; i < 5; i++ {
			wg.Add(1)
			go query(&wg, s, fmt.Sprintf("sid %d", i))
		}
		wg.Wait()

		metricsCalls := atomic.LoadUint32(&api.metricsCalls)
		require.Equal(t, uint32(5), metricsCalls)
	})

	t.Run("max cache size", func(t *testing.T) {
		api := &pmseriesAPIMock{}
		// initialize cache with max 10 items
		s, _ := NewSeriesService(api, 10)
		var wg sync.WaitGroup

		// fill cache [0..10] (cache misses)
		for i := 0; i < 10; i++ {
			wg.Add(1)
			go query(&wg, s, fmt.Sprintf("sid %d", i))
		}
		wg.Wait()
		require.Equal(t, uint32(10), atomic.LoadUint32(&api.metricsCalls))

		// request [0..10] (cache hits)
		for i := 0; i < 10; i++ {
			wg.Add(1)
			go query(&wg, s, fmt.Sprintf("sid %d", i))
		}
		wg.Wait()
		require.Equal(t, uint32(10), atomic.LoadUint32(&api.metricsCalls))

		// add items [10..20] to cache (cache misses)
		for i := 10; i < 20; i++ {
			wg.Add(1)
			go query(&wg, s, fmt.Sprintf("sid %d", i))
		}
		wg.Wait()
		require.Equal(t, uint32(20), atomic.LoadUint32(&api.metricsCalls))

		// request [0..10] (cache misses)
		for i := 0; i < 10; i++ {
			wg.Add(1)
			go query(&wg, s, fmt.Sprintf("sid %d", i))
		}
		wg.Wait()
		require.Equal(t, uint32(30), atomic.LoadUint32(&api.metricsCalls))
	})
}
