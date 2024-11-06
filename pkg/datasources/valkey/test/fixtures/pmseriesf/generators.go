package pmseriesf

import "github.com/performancecopilot/grafana-pcp/pkg/datasources/valkey/api/pmseries"

func Query(sids []string) pmseries.QueryResponse {
	return sids
}

func Metrics(sids []string) []pmseries.MetricsResponseItem {
	r := []pmseries.MetricsResponseItem{}
	for _, sid := range sids {
		r = append(r, pmseries.MetricsResponseItem{Series: sid, Name: metrics[sid].MetricName})
	}
	return r
}

func Descs(sids []string) []pmseries.DescsResponseItem {
	r := []pmseries.DescsResponseItem{}
	for _, sid := range sids {
		r = append(r, metrics[sid].Desc)
	}
	return r
}

func Instances(sids []string) []pmseries.InstancesResponseItem {
	r := []pmseries.InstancesResponseItem{}
	for _, sid := range sids {
		for _, instance := range metrics[sid].Instances {
			r = append(r, pmseries.InstancesResponseItem{
				Series:   sid,
				Instance: instance.Instance,
				Name:     instance.Name,
			})
		}
	}
	return r
}

func Values(sids []string) []pmseries.ValuesResponseItem {
	r := []pmseries.ValuesResponseItem{}
	for _, sid := range sids {
		r = append(r, values[sid]...)
	}
	return r
}

func Labels(sids []string) []pmseries.LabelsResponseItem {
	r := []pmseries.LabelsResponseItem{}
	for _, sid := range sids {
		for _, metric := range metrics {
			instance, ok := metric.Instances[sid]
			if ok {
				r = append(r, pmseries.LabelsResponseItem{
					Series: sid,
					Labels: instance.Labels,
				})
			}
		}
	}
	return r
}
