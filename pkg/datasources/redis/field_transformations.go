package redis

import (
	"errors"
	"fmt"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
)

func fieldSetRate(field *data.Field, idx int, delta time.Duration) error {
	if field.Type() != data.FieldTypeNullableFloat64 {
		return fmt.Errorf("fieldSetRate: invalid field type %s", field.Type())
	}

	curVal, prevVal := field.At(idx).(*float64), field.At(idx-1).(*float64)
	if curVal != nil && prevVal != nil {
		diff := *curVal - *prevVal
		if diff >= 0 /*&& delta.Seconds() >= 1*/ {
			rate := diff / delta.Seconds()
			field.Set(idx, &rate)
			return nil
		}
	}

	// either one value is nil or counter wrapped
	// we don't know if the counter wrapped multiple times,
	// so let's set the field to nil
	field.Set(idx, nil)
	return nil
}

func rateConversation(frame *data.Frame) error {
	log.DefaultLogger.Debug("Performing Rate Conversation")
	var timeField *data.Field
	for _, field := range frame.Fields {
		if field.Type() == data.FieldTypeTime {
			timeField = field
			break
		}
	}
	if timeField == nil {
		return errors.New("time field not found")
	} else if timeField.Len() == 0 {
		return nil
	}

	for _, field := range frame.Fields {
		if field.Type() == data.FieldTypeTime {
			continue
		}

		// start at the end, otherwise we'd calculate the current rate with the previous rate instead of the raw counter value
		for i := field.Len() - 1; i >= 1; i-- {
			delta := timeField.At(i).(time.Time).Sub(timeField.At(i - 1).(time.Time))
			err := fieldSetRate(field, i, delta)
			if err != nil {
				return err
			}
		}

		field.Delete(0)
	}
	timeField.Delete(0)
	return nil
}

func fieldDivideBy(field *data.Field, idx int, divisor int) error {
	if field.Type() != data.FieldTypeNullableFloat64 {
		return fmt.Errorf("fieldDivideBy: invalid field type %s", field.Type())
	}

	val := field.At(idx).(*float64)
	if val != nil {
		quotient := *val / float64(divisor)
		field.Set(idx, &quotient)
	}
	return nil
}

func timeUtilizationConversation(frame *data.Frame, divisor int) error {
	log.DefaultLogger.Debug("Converting to Time Utilization", "frame", frame.Name)
	for _, field := range frame.Fields {
		if field.Type() == data.FieldTypeTime {
			continue
		}

		field.Config.Unit = "percentunit"
		for i := 0; i < field.Len(); i++ {
			err := fieldDivideBy(field, i, divisor)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

var pcpTimeUnits = map[string]int{
	"nanosec":  1000 * 1000 * 1000,
	"microsec": 1000 * 1000,
	"millisec": 1000,
}

func applyFieldTransformations(redisQuery *Query, desc *series.Desc, frame *data.Frame) error {
	if desc.Semantics == "counter" {
		err := rateConversation(frame)
		if err != nil {
			return err
		}

		divisor, isTimeUtilization := pcpTimeUnits[desc.Units]
		if isTimeUtilization {
			err = timeUtilizationConversation(frame, divisor)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
