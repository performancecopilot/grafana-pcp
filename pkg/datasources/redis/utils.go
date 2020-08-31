package redis

import (
	"fmt"

	"github.com/grafana/grafana-plugin-sdk-go/data"
)

func prettyPrintDataFrame(frame *data.Frame) string {
	ret := fmt.Sprintf("Frame name=%s\n", frame.Name)
	for i := 0; i < frame.Fields[0].Len(); i++ {
		ret += fmt.Sprintf("i=%d", i)
		for _, field := range frame.Fields {
			ret += fmt.Sprintf("%s=%v", field.Name, field.At(i))
		}
		ret += "\n"
	}
	return ret
}
