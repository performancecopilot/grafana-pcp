export function query(expr: string) {
    return {
        "request": {
            "url": "^/series/query$",
            "params": {
                expr
            }
        },
        "response": {
            "status": 200,
            "data": ["4de74f3e9b34fbb12b76590e998fa160cb26ac75"]
        }
    };
}

export function valuesNoIndom(series: string) {
    return {
        "request": {
            "url": "^/series/values$",
            "params": {
                series
            }
        },
        "response": {
            "status": 200,
            "data": [
                { "series": "4de74f3e9b34fbb12b76590e998fa160cb26ac75", "timestamp": 1576502765913.853, "value": "38436" },
                { "series": "4de74f3e9b34fbb12b76590e998fa160cb26ac75", "timestamp": 1576502825913.853, "value": "38440" }
            ]
        }
    };
}
