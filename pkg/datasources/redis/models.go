package redis

// Query is a single redis query (target)
type Query struct {
	Expr         string `json:"expr"`
	Format       string `json:"format"`
	LegendFormat string `json:"legendFormat"`
}
