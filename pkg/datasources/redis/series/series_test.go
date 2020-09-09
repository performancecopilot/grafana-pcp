package series

import (
	"fmt"
	"math/rand"
	"testing"
	"time"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"
	. "github.com/smartystreets/goconvey/convey"
)

type pmseriesAPIMock struct{}

func (api *pmseriesAPIMock) Ping() (pmseries.GenericSuccessResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Query(expr string) (pmseries.QueryResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Metrics(series []string) ([]pmseries.MetricsResponseItem, error) {
	fmt.Printf("sleep %d\n", time.Duration(rand.Intn(200))*time.Millisecond)
	time.Sleep(time.Duration(rand.Intn(200)) * time.Millisecond)

	m := []pmseries.MetricsResponseItem{}
	for _, sid := range series {
		m = append(m, pmseries.MetricsResponseItem{
			Series: sid,
			Name:   fmt.Sprintf("metric name for %s", sid),
		})
	}
	return m, nil
}

func (api *pmseriesAPIMock) MetricNameMatches(match string) (pmseries.MetricNameMatchesResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Descs(series []string) ([]pmseries.DescsResponseItem, error) {
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

func (api *pmseriesAPIMock) LabelNames() (pmseries.LabelNamesResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) LabelValues(labelNames []string) (pmseries.LabelValuesResponse, error) {
	panic("not implemented")
}

func (api *pmseriesAPIMock) Values(series []string, start int64, finish int64, interval int64) ([]pmseries.ValuesResponseItem, error) {
	panic("not implemented")
}

func query(s *Service, sid string) (map[string]*Series, error) {
	fmt.Printf("sending query %s\n", sid)
	series, err := s.GetSeries([]string{sid})
	fmt.Printf("received series %s\n", sid)
	return series, err
}

func TestSeriesService(t *testing.T) {
	Convey("Concurrent access", t, func() {
		api := &pmseriesAPIMock{}
		s := NewSeriesService(api)

		for i := 0; i < 10; i++ {
			go query(s, fmt.Sprintf("sid %d", i%5))
		}

		time.Sleep(1 * time.Second)
	})
}
