package redis

import (
	"fmt"
	"testing"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const deltaFloat = 0.0000000001

func Float64P(vals ...interface{}) []*float64 {
	pointers := make([]*float64, len(vals))
	for i := 0; i < len(vals); i++ {
		switch vals[i].(type) {
		case float64:
			val := vals[i].(float64)
			pointers[i] = &val
		case int:
			val := float64(vals[i].(int))
			pointers[i] = &val
		case nil:
		default:
			fmt.Printf("error, unkown value %v\n", vals[i])
		}
	}
	return pointers
}

func InDeltaPointer(t *testing.T, expected interface{}, actual interface{}, delta float64) {
	a, e := actual.(*float64), expected.(*float64)
	if a == nil && e == nil {
		return
	} else if a == nil {
		assert.Fail(t, fmt.Sprintf("value is nil, but should be %f", *e))
	} else if e == nil {
		assert.Fail(t, fmt.Sprintf("value is %f, but should be nil", *a))
	} else {
		require.InDelta(t, *e, *a, deltaFloat)
	}
}

func TestTransformations(t *testing.T) {
	t.Run("Counter 1", func(t *testing.T) {
		query := DefaultQuery()
		desc := &series.Desc{
			Semantics: "counter",
		}
		timeField := data.NewField("time", nil, []time.Time{time.Unix(1000, 0), time.Unix(1010, 0), time.Unix(1020, 0)})
		dataField := data.NewField("data", nil, Float64P(10, 20, 40))
		frame := data.NewFrame("", timeField, dataField)
		err := applyFieldTransformations(&query, desc, frame)
		require.NoError(t, err)

		expectedTime := []time.Time{time.Unix(1010, 0), time.Unix(1020, 0)}
		expectedData := Float64P(1, 2)
		require.Equal(t, len(expectedTime), timeField.Len())
		require.Equal(t, len(expectedData), dataField.Len())
		for i := 0; i < dataField.Len(); i++ {
			InDeltaPointer(t, expectedData[i], dataField.At(i), deltaFloat)
			InDeltaPointer(t, expectedData[i], dataField.At(i), deltaFloat)
		}
	})

	t.Run("Counter wrap", func(t *testing.T) {
		query := DefaultQuery()
		desc := &series.Desc{
			Semantics: "counter",
		}
		timeField := data.NewField("time", nil, []time.Time{time.Unix(1000, 0), time.Unix(1010, 0), time.Unix(1020, 0), time.Unix(1030, 0)})
		dataField1 := data.NewField("data1", nil, Float64P(10, 30, 20, 30))
		dataField2 := data.NewField("data2", nil, Float64P(100, 300, 200, 300))
		frame := data.NewFrame("", timeField, dataField1, dataField2)
		err := applyFieldTransformations(&query, desc, frame)
		require.NoError(t, err)

		expectedTime := []time.Time{time.Unix(1010, 0), time.Unix(1020, 0), time.Unix(1030, 0)}
		expectedData1 := Float64P(2, nil, 1)
		expectedData2 := Float64P(20, nil, 10)
		require.Equal(t, len(expectedTime), timeField.Len())
		require.Equal(t, len(expectedData1), dataField1.Len())
		require.Equal(t, len(expectedData2), dataField2.Len())
		for i := 0; i < timeField.Len(); i++ {
			require.Equal(t, expectedTime[i], timeField.At(i))
			InDeltaPointer(t, expectedData1[i], dataField1.At(i), deltaFloat)
			InDeltaPointer(t, expectedData2[i], dataField2.At(i), deltaFloat)
		}
	})

	t.Run("Time Utilization", func(t *testing.T) {
		query := DefaultQuery()
		desc := &series.Desc{
			Semantics: "counter",
			Units:     "millisec",
		}
		timeField := data.NewField("time", nil, []time.Time{time.Unix(1000, 0), time.Unix(1001, 0), time.Unix(1002, 0)})
		dataField := data.NewField("data", nil, Float64P(10, 11, 13))
		dataField.SetConfig(&data.FieldConfig{
			Unit: "",
		})
		frame := data.NewFrame("", timeField, dataField)
		err := applyFieldTransformations(&query, desc, frame)
		require.NoError(t, err)

		expectedTime := []time.Time{time.Unix(1001, 0), time.Unix(1002, 0)}
		expectedData := Float64P(1.0/1000, 2.0/1000)
		require.Equal(t, len(expectedTime), timeField.Len())
		require.Equal(t, len(expectedData), dataField.Len())
		for i := 0; i < dataField.Len(); i++ {
			require.Equal(t, expectedTime[i], timeField.At(i))
			InDeltaPointer(t, expectedData[i], dataField.At(i), deltaFloat)
		}
	})

	t.Run("time based counter with time utilization conversation disabled", func(t *testing.T) {
		query := DefaultQuery()
		query.Options.TimeUtilizationConversion = false
		desc := &series.Desc{
			Semantics: "counter",
			Units:     "millisec",
		}
		timeField := data.NewField("time", nil, []time.Time{time.Unix(1000, 0), time.Unix(1001, 0), time.Unix(1002, 0)})
		dataField := data.NewField("data", nil, Float64P(10, 11, 13))
		dataField.SetConfig(&data.FieldConfig{
			Unit: "",
		})
		frame := data.NewFrame("", timeField, dataField)
		err := applyFieldTransformations(&query, desc, frame)
		require.NoError(t, err)

		expectedTime := []time.Time{time.Unix(1001, 0), time.Unix(1002, 0)}
		expectedData := Float64P(1.0, 2.0)
		require.Equal(t, len(expectedTime), timeField.Len())
		require.Equal(t, len(expectedData), dataField.Len())
		for i := 0; i < dataField.Len(); i++ {
			require.Equal(t, expectedTime[i], timeField.At(i))
			InDeltaPointer(t, expectedData[i], dataField.At(i), deltaFloat)
		}
	})
}
