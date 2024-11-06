package valkey

type TargetFormat string

const (
	TimeSeries TargetFormat = "time_series"
	Heatmap    TargetFormat = "heatmap"
)

// Query is a single valkey query (target)
type Query struct {
	Expr         string       `json:"expr"`
	Format       TargetFormat `json:"format"`
	LegendFormat string       `json:"legendFormat"`
	Options      QueryOptions `json:"options"`
}

// QueryOptions are optional query options
type QueryOptions struct {
	RateConversion            bool `json:"rateConversion"`
	TimeUtilizationConversion bool `json:"timeUtilizationConversion"`
}

func DefaultQuery() Query {
	return Query{
		Format: TimeSeries,
		Options: QueryOptions{
			RateConversion:            true,
			TimeUtilizationConversion: true,
		},
	}
}
