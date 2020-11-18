package pmseriesf

import (
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/api/pmseries"
	"github.com/performancecopilot/grafana-pcp/pkg/datasources/redis/series"
)

var metrics = map[string]series.Series{
	"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9": series.Series{
		MetricName: "disk.dev.read",
		Desc: series.Desc{
			Series:    "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9",
			Source:    "2914f38f7bdcb7fb3ac0b822c98019248fd541fb",
			PMID:      "60.0.4",
			Indom:     "60.1",
			Semantics: "counter",
			Type:      "u64",
			Units:     "count",
		},
		Labels: series.Labels{},
		Instances: map[string]series.Instance{
			"0aeab8b239522ab0640577ed788cc601fc640266": series.Instance{
				Instance: "0aeab8b239522ab0640577ed788cc601fc640266",
				Name:     "sda",
				Labels: series.Labels{
					"indom_name":  "per disk",
					"device_type": "block",
					"agent":       "linux",
					"userid":      978,
					"machineid":   "6dabb302d60b402dabcc13dc4fd0fab8",
					"hostname":    "dev",
					"groupid":     976,
					"domainname":  "localdomain",
				},
			},
			"7f3afb6f41e53792b18e52bcec26fdfa2899fa58": series.Instance{
				Instance: "7f3afb6f41e53792b18e52bcec26fdfa2899fa58",
				Name:     "nvme0n1",
				Labels: series.Labels{
					"indom_name":  "per disk",
					"device_type": "block",
					"agent":       "linux",
					"userid":      978,
					"machineid":   "6dabb302d60b402dabcc13dc4fd0fab8",
					"hostname":    "dev",
					"groupid":     976,
					"domainname":  "localdomain",
				},
			},
		},
	},
}

var values = map[string][]pmseries.ValuesResponseItem{
	"f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9": []pmseries.ValuesResponseItem{
		pmseries.ValuesResponseItem{
			Series:    "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9",
			Instance:  "7f3afb6f41e53792b18e52bcec26fdfa2899fa58",
			Timestamp: 1599320691309.872,
			Value:     "100",
		},
		pmseries.ValuesResponseItem{
			Series:    "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9",
			Instance:  "0aeab8b239522ab0640577ed788cc601fc640266",
			Timestamp: 1599320691309.872,
			Value:     "200",
		},
		pmseries.ValuesResponseItem{
			Series:    "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9",
			Instance:  "7f3afb6f41e53792b18e52bcec26fdfa2899fa58",
			Timestamp: 1599320692309.872,
			Value:     "300",
		},
		pmseries.ValuesResponseItem{
			Series:    "f87250c4ea0e5eca8ff2ca3b3044ba1a6c91a3d9",
			Instance:  "0aeab8b239522ab0640577ed788cc601fc640266",
			Timestamp: 1599320692309.872,
			Value:     "500",
		},
	},
}
