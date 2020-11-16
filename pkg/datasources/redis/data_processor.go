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
	return fmt.Sprintf("%s[%s]", series.MetricName, instanceID), nil
}

var legendFormatRegex = regexp.MustCompile(`\$\w+`)

func getFieldDisplayName(redisQuery *Query, series *series.Series, instanceID string, labels data.Labels) string {
	if redisQuery.LegendFormat == "" {
		return ""
	}

	result := legendFormatRegex.ReplaceAllStringFunc(redisQuery.LegendFormat, func(match string) string {
		varName := match[1:]
		switch varName {
		case "expr":
			return redisQuery.Expr
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

func (ds *redisDatasourceInstance) createField(redisQuery *Query, series *series.Series, instanceID string) (*data.Field, error) {
	name, err := ds.getFieldName(series, instanceID)
	if err != nil {
		return nil, err
	}

	vector, err := getFieldVector(series.Desc.Type)
	if err != nil {
		return nil, err
	}

	labels := getStringLabels(series, instanceID)
	displayName := getFieldDisplayName(redisQuery, series, instanceID, labels)
	unit := getFieldUnit(&series.Desc)

	var instance series_.Instance
	if series.Instances != nil {
		instance = series.Instances[instanceID]
	}

	field := data.NewField(name, labels, vector)
	field.SetConfig(&data.FieldConfig{
		DisplayName: displayName,
		Unit:        unit,
		Custom: map[string]interface{}{
			"InstanceId": instanceID,
			"Instance":   instance,
		},
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
		curFrame := data.NewFrame("")
		curTimeField := data.NewField("time", nil, []time.Time{})
		curFrame.Fields = append(curFrame.Fields, curTimeField)
		curInstanceToField := map[string]*data.Field{}

		for i < len(values) && values[i].Series == curSeriesID {
			curTimestampMs := values[i].Timestamp
			curTimeField.Append(time.Unix(int64(curTimestampMs/1000), int64(curTimestampMs*1000*1000)%1000000000))

			// if the timestamp significantly changed from the previous read one, consider it a new measurement
			for ; i < len(values) && values[i].Series == curSeriesID && math.Abs(values[i].Timestamp-curTimestampMs) < 0.1; i++ {
				field := curInstanceToField[values[i].Instance]
				if field == nil {
					var err error
					field, err = ds.createField(redisQuery, series[curSeriesID], values[i].Instance)
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

var heatmapInstanceRegex = regexp.MustCompile(`^(.+?)\-(.+?)$`)

func getHeatMapDisplayName(field *data.Field) string {
	instance, ok := field.Config.Custom["Instance"]
	if ok {
		instanceName := instance.(series.Instance).Name
		// instance name can be -1024--512, -512-0, 512-1024, ...
		match := heatmapInstanceRegex.FindStringSubmatch(instanceName)
		if len(match) == 3 {
			return match[2]
		}
	}
	return "0-0"
}

func (ds *redisDatasourceInstance) toHeatMap(frame *data.Frame) error {
	var timeField *data.Field
	for _, field := range frame.Fields {
		if field.Type() == data.FieldTypeTime {
			timeField = field
			continue
		}
		field.Config.DisplayName = getHeatMapDisplayName(field)
	}
	if timeField == nil {
		return nil
	}

	for i := 0; i < timeField.Len(); i++ {
		// round timestamps to one second, the heatmap panel calculates the x-axis size accordingly
		curTime := timeField.At(i).(time.Time)
		rounded := time.Unix(int64(math.Floor(float64(curTime.UnixNano())/1000000000.0)), 0)
		timeField.Set(i, rounded)
	}
	return nil
}

func (ds *redisDatasourceInstance) processQuery(redisQuery *Query, series map[string]*series.Series, values []pmseries.ValuesResponseItem) (data.Frames, error) {
	frames, err := ds.createDataFrames(redisQuery, series, values)
	if err != nil {
		return nil, err
	}

	switch redisQuery.Format {
	case TimeSeries:
		return frames, nil
	case Heatmap:
		for _, frame := range frames {
			err = ds.toHeatMap(frame)
			if err != nil {
				return nil, err
			}
		}
		return frames, nil
	default:
		return nil, fmt.Errorf("Invalid target format %s", redisQuery.Format)
	}
}
