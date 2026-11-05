package valkey

import (
	"context"
	"testing"

	"github.com/performancecopilot/grafana-pcp/pkg/datasources/valkey/api/pmseries"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/valkey/series"
	"github.com/stretchr/testify/require"
)

// TestCreateDataFramesMissingSeries verifies missing metadata never produces partial frames.
func TestCreateDataFramesMissingSeries(t *testing.T) {
	for _, metadata := range []map[string]*series.Series{{}, {"missing": nil}} {
		ds := &valkeyDatasourceInstance{}
		frames, err := ds.createDataFrames(context.Background(), &Query{}, metadata, []pmseries.ValuesResponseItem{
			{Series: "missing", Value: "1"},
		})
		require.EqualError(t, err, "missing metadata for series 'missing'")
		require.Nil(t, frames)
	}

	t.Run("valid series followed by missing metadata", func(t *testing.T) {
		ds := &valkeyDatasourceInstance{}
		metadata := map[string]*series.Series{
			"a-valid": {
				MetricName: "metric",
				Desc:       series.Desc{Series: "a-valid", Type: "double", Semantics: "instant", Indom: "none"},
			},
		}
		frames, err := ds.createDataFrames(context.Background(), &Query{}, metadata, []pmseries.ValuesResponseItem{
			{Series: "a-valid", Value: "1"},
			{Series: "missing", Value: "2"},
		})
		require.EqualError(t, err, "missing metadata for series 'missing'")
		require.Nil(t, frames)
	})
}
