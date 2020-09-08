package api

type GenericSuccessResponse struct {
	Success bool `json:"success"`
}

type QueryResponse []string

type MetricsResponseItem struct {
	Series string `json:"series"`
	Name   string `json:"name"`
}

type MetricNameMatchesResponse []string

type DescsResponseItem struct {
	Series    string `json:"series"`
	Source    string `json:"source"`
	PMID      string `json:"pmid"`
	Indom     string `json:"indom"`
	Semantics string `json:"semantics"`
	Type      string `json:"type"`
	Units     string `json:"units"`
}

type InstancesResponseItem struct {
	Series   string `json:"series"`
	Source   string `json:"source"`
	Instance string `json:"instance"`
	ID       int    `json:"id"`
	Name     string `json:"name"`
}

type LabelsResponseItem struct {
	Series string                 `json:"series"`
	Labels map[string]interface{} `json:"labels"`
}

type LabelNamesResponse map[string][]string

type ValuesResponseItem struct {
	Series    string  `json:"series"`
	Timestamp float64 `json:"timestamp"`
	Instance  string  `json:"instance"`
	Value     string  `json:"value"`
}

type Error struct {
	URL        string
	StatusCode int
	Response   string
	Err        error
}

func (e *Error) Unwrap() error { return e.Err }
func (e *Error) Error() string { return e.Err.Error() }
