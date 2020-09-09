package redis

import (
	"fmt"
	"math"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
	series_ "github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
)

func getStringLabels(series *series.Series, instanceID string) data.Labels {
	var labels series_.Labels
	if series.Instances == nil {
		labels = series.Labels
	} else {
		labels = series.Instances[instanceID].Labels
	}

	strLabels := data.Labels{}
	for key, value := range labels {
		strLabels[key] = fmt.Sprintf("%v", value)
	}
	return strLabels
}

func getFieldVector(seriesType string) (interface{}, error) {
	switch seriesType {
	case "32", "u32", "64", "u64", "float", "double":
		// most counters are integers, but once they got rate-converted they are floats
		// and rate conversation happens inline
		return []*float64{}, nil
	case "string":
		return []*string{}, nil
	default:
		return nil, fmt.Errorf("unknown series type %s", seriesType)
	}
}

func getFieldValue(seriesType string, value string) (interface{}, error) {
	switch seriesType {
	case "32", "u32", "64", "u64", "float", "double":
		val, err := strconv.ParseFloat(value, 64)
		if err != nil {
			return nil, err
		}
		return &val, nil
	case "string":
		return &value, nil
	default:
		return nil, fmt.Errorf("unknown series type %s", seriesType)
	}
}

func getFieldUnit(desc *series.Desc) string {
	// pcp/src/libpcp/src/units.c
	// grafana-data/src/valueFormats/categories.ts

	switch desc.Units {
	case "nanosec":
		return "ns"
	case "microsec":
		return "µs"
	case "millisec":
		return "ms"
	case "sec":
		return "s"
	case "min":
		return "m"
	case "hour":
		return "h"
	}

	if desc.Semantics == "counter" {
		switch desc.Units {
		case "byte":
			return "Bps"
		case "Kbyte":
			return "KBs"
		case "Mbyte":
			return "MBs"
		case "Gbyte":
			return "GBs"
		case "Tbyte":
			return "TBs"
		case "Pbyte":
			return "PBs"
		}
	} else {
		switch desc.Units {
		case "byte":
			return "bytes"
		case "Kbyte":
			return "kbytes"
		case "Mbyte":
			return "mbytes"
		case "Gbyte":
			return "gbytes"
		case "Tbyte":
			return "tbytes"
		case "Pbyte":
			return "pbytes"
		}
	}

	return ""
}

func (ds *redisDatasourceInstance) getFieldName(series *series.Series, instanceID string) (string, error) {
	if series.Instances == nil {
		return series.MetricName, nil
	}

	instance, ok := series.Instances[instanceID]
	if !ok {
		err := ds.seriesService.RefreshInstances(series)
		if err != nil {
			return "", err
		}

		instance, ok = series.Instances[instanceID]
	}

	// try again after (possibly) refreshing indoms
	if ok {
		return fmt.Sprintf("%s[%s]", series.MetricName, instance.Name), nil
	}
	return fmt.Sprintf("%s[?]", series.MetricName), nil
}

var legendFormatRegex = regexp.MustCompile(`\$\w+`)

func getDisplayName(series *series.Series, instanceID string, labels data.Labels, legendFormat string) string {
	if legendFormat == "" {
		return ""
	}

	result := legendFormatRegex.ReplaceAllStringFunc(legendFormat, func(match string) string {
		varName := match[1:]
		switch varName {
		case "metric":
			return series.MetricName
		case "metric0":
			spl := strings.Split(series.MetricName, ".")
			return spl[len(spl)-1]
		case "instance":
			if series.Instances != nil {
				return series.Instances[instanceID].Name
			}
			return ""
		default:
			labelValue, ok := labels[varName]
			if ok {
				return labelValue
			}
			return match
		}
	})
	return string(result)
}

func (ds *redisDatasourceInstance) createField(series *series.Series, instanceID string, legendFormat string) (*data.Field, error) {
	fieldName, err := ds.getFieldName(series, instanceID)
	if err != nil {
		return nil, err
	}

	fieldVector, err := getFieldVector(series.Desc.Type)
	if err != nil {
		return nil, err
	}

	labels := getStringLabels(series, instanceID)
	displayName := getDisplayName(series, instanceID, labels, legendFormat)
	unit := getFieldUnit(&series.Desc)

	field := data.NewField(fieldName, labels, fieldVector)
	field.SetConfig(&data.FieldConfig{
		DisplayName: displayName,
		Unit:        unit,
	})

	return field, nil
}

func (ds *redisDatasourceInstance) createDataFrames(redisQuery *Query, series map[string]*series.Series, values []pmseries.ValuesResponseItem) (data.Frames, error) {
	frames := data.Frames{}

	// values are in the format
	// [
	//   {series: "series1", instance: "inst1", timestamp: 1, value: "1"},
	//   {series: "series1", instance: "inst2", timestamp: 1, value: "2"},
	//   {series: "series1", instance: "inst1", timestamp: 2, value: "3"},
	//   {series: "series1", instance: "inst2", timestamp: 2, value: "4"},
	//   {series: "series2",                  , timestamp: 1, value: "5"},
	// ]
	// dataframes are like a list of table columns
	// let's create a dataframe per series, with one time field and one field per instance

	// make sure values are sorted Series < Timestamp
	sort.Slice(values, func(i, j int) bool {
		if values[i].Series != values[j].Series {
			return values[i].Series < values[j].Series
		}
		return values[i].Timestamp < values[j].Timestamp
	})

	for i := 0; i < len(values); {
		curSeriesID := values[i].Series
		curTimestamp := 0.0
		curFrame := data.NewFrame("")
		curTimeField := data.NewField("time", nil, []time.Time{})
		curFrame.Fields = append(curFrame.Fields, curTimeField)
		curInstanceToField := map[string]*data.Field{}

		for i < len(values) && values[i].Series == curSeriesID {
			curTimestamp = values[i].Timestamp
			curTimeField.Append(time.Unix(int64(curTimestamp/1000), int64(curTimestamp*1000*1000)%1000000000))

			// if the timestamp significantly changed from the previous read one, consider it a new measurement
			for ; i < len(values) && values[i].Series == curSeriesID && math.Abs(values[i].Timestamp-curTimestamp) < 0.1; i++ {
				field := curInstanceToField[values[i].Instance]
				if field == nil {
					var err error
					field, err = ds.createField(series[curSeriesID], values[i].Instance, redisQuery.LegendFormat)
					if err != nil {
						return nil, err
					}

					curInstanceToField[values[i].Instance] = field
					curFrame.Fields = append(curFrame.Fields, field)
				}

				val, err := getFieldValue(series[curSeriesID].Desc.Type, values[i].Value)
				if err != nil {
					return nil, err
				}
				field.Append(val)
			}

			// it's possible that some instance existed previously but disappeared
			for _, field := range curInstanceToField {
				if field.Len() != curTimeField.Len() {
					field.Extend(1)
				}
			}
		}

		applyFieldTransformations(series[curSeriesID], curFrame)
		frames = append(frames, curFrame)
	}

	return frames, nil
}
