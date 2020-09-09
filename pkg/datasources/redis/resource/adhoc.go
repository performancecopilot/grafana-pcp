package resource

import "fmt"

func (rs *Service) getLabelNames() ([]MetricFindValue, error) {
	labelNamesResponse, err := rs.pmseriesAPI.LabelNames()
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
