package redis

type TargetFormat string

const (
	TimeSeries TargetFormat = "time_series"
	Heatmap    TargetFormat = "heatmap"
)

// Query is a single redis query (target)
type Query struct {
	Expr         string       `json:"expr"`
	Format       TargetFormat `json:"format"`
	LegendFormat string       `json:"legendFormat"`
}
