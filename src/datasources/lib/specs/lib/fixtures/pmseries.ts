export function query(expr: string, series: string) {
    return {
        "request": {
            "url": "^/series/query$",
            "params": {
                expr
            }
        },
        "response": {
            "status": 200,
            "data": [series]
        }
    };
}

export function valuesNoIndom(series: string, timeSpec: any, values: { timestamp: number, value: string }[]) {
    return {
        "request": {
            "url": "^/series/values$",
            "params": {
                series,
                ...timeSpec
            }
        },
        "response": {
            "status": 200,
            "data": values.map(v => ({ series, ...v }))
        }
    };
}

export function valuesIndom(series: string, timeSpec: any, values: { instance: string, timestamp: number, value: string }[]) {
    return {
        "request": {
            "url": "^/series/values$",
            "params": {
                series,
                ...timeSpec
            }
        },
        "response": {
            "status": 200,
            "data": values.map(v => ({ series, ...v }))
        }
    };
}

export function descs(series: string, semantics = "instant") {
    return {
        "request": {
            "url": "^/series/descs$",
            "params": {
                series,
            }
        },
        "response": {
            "status": 200,
            "data": [{
                "series": series,
                "source": "3bd555f3b970fb593bcba57fa9d5d150f4eba544",
                "pmid": "60.0.14",
                "indom": "none",
                "semantics": semantics,
                "type": "u64",
                "units": "count"
            }]
        }
    };
}

export function metrics(series: string) {
    return {
        "request": {
            "url": "^/series/metrics$",
            "params": {
                series,
            }
        },
        "response": {
            "status": 200,
            "data": [{
                "series": series,
                "name": "kernel.all.sysfork"
            }]
        }
    };
}

export function labels(series: string) {
    return {
        "request": {
            "url": "^/series/labels$",
            "params": {
                series,
            }
        },
        "response": {
            "status": 200,
            "data": [{
                "series": series,
                "labels": {
                    "agent": "linux",
                    "hostname": "web01"
                }
            }]
        }
    };
}

export function instances(series: string, instances: { instance: string, id: number, name: string }[]) {
    return {
        "request": {
            "url": "^/series/instances$",
            "params": {
                series
            }
        },
        "response": {
            "status": 200,
            "data": instances.map(i => ({ series, ...i }))
        }
    };
}
