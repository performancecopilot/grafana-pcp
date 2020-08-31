package redis

import (
	"fmt"
	"testing"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/data"

	. "github.com/smartystreets/goconvey/convey"
)

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

func ShouldAlmostEqualPointer(actual interface{}, expected ...interface{}) string {
	a, e := actual.(*float64), expected[0].(*float64)
	if a == nil && e == nil {
		return ""
	} else if a == nil {
		return fmt.Sprintf("value is nil, but should be %f", *e)
	} else if e == nil {
		return fmt.Sprintf("value is %f, but should be nil", *a)
	} else {
		return ShouldAlmostEqual(*a, *e)
	}
}

func TestTransformations(t *testing.T) {
	Convey("Counter 1", t, func() {
		series := &Series{
			Desc: SeriesDesc{
				Semantics: "counter",
			},
		}
		timeField := data.NewField("time", nil, []time.Time{time.Unix(1000, 0), time.Unix(1010, 0), time.Unix(1020, 0)})
		dataField := data.NewField("data", nil, Float64P(10, 20, 40))
		frame := data.NewFrame("", timeField, dataField)
		err := applyFieldTransformations(series, frame)
		So(err, ShouldBeNil)

		expectedTime := []time.Time{time.Unix(1010, 0), time.Unix(1020, 0)}
		expectedData := Float64P(1, 2)
		So(timeField.Len(), ShouldEqual, len(expectedTime))
		So(dataField.Len(), ShouldEqual, len(expectedData))
		for i := 0; i < dataField.Len(); i++ {
			So(timeField.At(i), ShouldEqual, expectedTime[i])
			So(dataField.At(i), ShouldAlmostEqualPointer, expectedData[i])
		}
	})

	Convey("Counter wrap", t, func() {
		series := &Series{
			Desc: SeriesDesc{
				Semantics: "counter",
			},
		}
		timeField := data.NewField("time", nil, []time.Time{time.Unix(1000, 0), time.Unix(1010, 0), time.Unix(1020, 0), time.Unix(1030, 0)})
		dataField1 := data.NewField("data1", nil, Float64P(10, 30, 20, 30))
		dataField2 := data.NewField("data2", nil, Float64P(100, 300, 200, 300))
		frame := data.NewFrame("", timeField, dataField1, dataField2)
		err := applyFieldTransformations(series, frame)
		So(err, ShouldBeNil)

		expectedTime := []time.Time{time.Unix(1010, 0), time.Unix(1020, 0), time.Unix(1030, 0)}
		expectedData1 := Float64P(2, nil, 1)
		expectedData2 := Float64P(20, nil, 10)
		So(timeField.Len(), ShouldEqual, len(expectedTime))
		So(dataField1.Len(), ShouldEqual, len(expectedData1))
		So(dataField2.Len(), ShouldEqual, len(expectedData2))
		for i := 0; i < timeField.Len(); i++ {
			So(timeField.At(i), ShouldEqual, expectedTime[i])
			So(dataField1.At(i), ShouldAlmostEqualPointer, expectedData1[i])
			So(dataField2.At(i), ShouldAlmostEqualPointer, expectedData2[i])
		}
	})

	Convey("Time Utilization", t, func() {
		series := &Series{
			Desc: SeriesDesc{
				Semantics: "counter",
				Units:     "millisec",
			},
		}
		timeField := data.NewField("time", nil, []time.Time{time.Unix(1000, 0), time.Unix(1001, 0), time.Unix(1002, 0)})
		dataField := data.NewField("data", nil, Float64P(10, 11, 13))
		dataField.SetConfig(&data.FieldConfig{
			Unit: "",
		})
		frame := data.NewFrame("", timeField, dataField)
		err := applyFieldTransformations(series, frame)
		So(err, ShouldBeNil)

		expectedTime := []time.Time{time.Unix(1001, 0), time.Unix(1002, 0)}
		expectedData := Float64P(1.0/1000, 2.0/1000)
		So(timeField.Len(), ShouldEqual, len(expectedTime))
		So(dataField.Len(), ShouldEqual, len(expectedData))
		for i := 0; i < dataField.Len(); i++ {
			So(timeField.At(i), ShouldEqual, expectedTime[i])
			So(dataField.At(i), ShouldAlmostEqualPointer, expectedData[i])
		}
	})
}
