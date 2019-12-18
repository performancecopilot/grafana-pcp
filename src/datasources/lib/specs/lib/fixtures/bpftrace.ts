import { MetricType, Status, Script } from "../../../../bpftrace/script";

export const script: Script = {
    "script_id": "sSCRIPT_UUID",
    "username": null,
    "persistent": false,
    "created_at": "2019-10-15T10:31:28.901636",
    "last_accessed_at": "2019-10-15T10:31:28.901640",
    "code": "code",
    "metadata": {
        "name": null,
        "include": null,
        "table_retain_lines": null
    },
    "variables": {
        "@runqlen": {
            "single": false,
            "semantics": 1,
            "datatype": 3,
            "metrictype": MetricType.Histogram
        }
    },
    "state": {
        "status": Status.Stopped,
        "pid": -1,
        "exit_code": 0,
        "error": "",
        "probes": 0
    }
};
