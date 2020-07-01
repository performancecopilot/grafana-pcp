export class PmWebd {
    static context(context: number) {
        return {
            "request": {
                "url": "^/pmapi/context$"
            },
            "response": {
                "status": 200,
                "data": {
                    "context": context
                }
            }
        };
    }
    static contextExpired(url: string) {
        return {
            "request": {
                "url": url,
            },
            "response": {
                "status": 400,
                "data": "PMWEBD error, code -12376: Attempt to use an illegal context"
            }
        };
    }

    static metric(context: number, metric: string, semantics: string) {
        return {
            "request": {
                "url": `^/pmapi/${context}/_metric$`,
                "params": {
                    "prefix": metric
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "metrics": [{
                        "name": metric,
                        "text-oneline": "fork rate metric from /proc/stat",
                        "text-help": "fork rate metric from /proc/stat",
                        "pmid": 251658254,
                        "sem": semantics,
                        "units": "count",
                        "type": "U64"
                    }]
                }
            }
        };
    }

    static fetchSingleMetric(context: number, timestampS: number, timestampUs: number,
        metrics: { name: string, value: number }[], requestedMetrics: string[] = []) {
        if (requestedMetrics.length === 0)
            requestedMetrics = metrics.map(metric => metric.name);

        if (requestedMetrics.length === 1 && metrics.length === 0) {
            return {
                "request": {
                    "url": `^/pmapi/${context}/_fetch$`,
                    "params": {
                        "names": requestedMetrics.join(',')
                    }
                },
                "response": {
                    "status": 400,
                    "data": "PMWEBD error, code -12443: Insufficient elements in list"
                }
            };
        }

        return {
            "request": {
                "url": `^/pmapi/${context}/_fetch$`,
                "params": {
                    "names": requestedMetrics.join(',')
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "timestamp": {
                        "s": timestampS,
                        "us": timestampUs
                    },
                    "values": metrics.map(({ name, value }) => ({
                        "pmid": 123,
                        "name": name,
                        "instances": [
                            {
                                "instance": -1,
                                "value": value
                            }
                        ]
                    }))
                }
            }
        };
    }
}

export class PmProxy {
    static context(context: number) {
        return {
            "request": {
                "url": "^/pmapi/context$",
                "params": {
                    "hostspec": "127.0.0.1",
                    "polltimeout": 30
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": context,
                    "source": "e69602eb1325a45e50a91b0ea07888701737fba9",
                    "hostspec": "test-vm",
                    "labels": {
                        "domainname": "localdomain",
                        "hostname": "test-vm",
                        "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                    }
                }
            }
        };
    }
    static contextExpired(context: number, url: string) {
        return {
            "request": {
                "url": url,
            },
            "response": {
                "status": 500,
                "data": {
                    "context": context, "message": `unknown context identifier: ${context}`, "success": false
                }
            }
        };
    }

    static metric(context: number, metrics: { name: string, semantics: string }[], requestedMetrics: string[] = []) {
        if (requestedMetrics.length === 0)
            requestedMetrics = metrics.map(metric => metric.name);

        if (requestedMetrics.length === 1 && metrics.length === 0) {
            return {
                "request": {
                    "url": `^/pmapi/${context}/metric$`,
                    "params": {
                        "names": requestedMetrics.join(',')
                    }
                },
                "response": {
                    "status": 500,
                    "data": {
                        "context": context,
                        "message": `${requestedMetrics[0]} traversal failed - Unknown metric name`,
                        "success": false
                    }
                }
            };
        }

        return {
            "request": {
                "url": `^/pmapi/${context}/metric$`,
                "params": {
                    "names": requestedMetrics.join(',')
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": 1569599843,
                    "metrics": metrics.map(metric => ({
                        "name": metric.name,
                        "series": "73d93ee9efa086923d0c9eabc96f98f2b583b8f2",
                        "pmid": "60.0.14",
                        "type": "u64",
                        "sem": metric.semantics,
                        "units": "count",
                        "labels": {
                            "agent": "linux",
                            "domainname": "localdomain",
                            "hostname": "test-vm",
                            "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                        },
                        "text-oneline": "fork rate metric from /proc/stat",
                        "text-help": "fork rate metric from /proc/stat"
                    }))
                }
            }
        };
    }

    static indom(context: number, metric: string, instances: { instance: number, name: string, labels?: any }[]) {
        return {
            "request": {
                "url": `^/pmapi/${context}/indom$`,
                "params": {
                    "name": metric
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": 1,
                    "indom": "60.2",
                    "labels": {
                        "domainname": "localdomain",
                        "hostname": "test-vm",
                        "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                    },
                    "text-oneline": "load averages for 1, 5, and 15 minutes",
                    "text-help": "load averages for 1, 5, and 15 minutes",
                    "instances": instances.map(instance => ({
                        "instance": instance.instance,
                        "name": instance.name,
                        "labels": instance.labels
                    }))
                }
            }
        };
    }

    static fetchSingleMetric(context: number, timestamp: number, metrics: { name: string, value: number | string }[],
        requestedMetrics: string[] = []) {
        if (requestedMetrics.length === 0)
            requestedMetrics = metrics.map(metric => metric.name);

        return {
            "request": {
                "url": `^/pmapi/${context}/fetch$`,
                "params": {
                    "names": requestedMetrics.join(',')
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": context,
                    "timestamp": timestamp,
                    "values": metrics.map(({ name, value }) => ({
                        "pmid": "60.0.14",
                        "name": name,
                        "instances": [
                            {
                                "instance": null,
                                "value": value
                            }
                        ]
                    }))
                }
            }
        };
    }
    static fetchIndomMetric(context: number, timestamp: number, metrics: { name: string, instances: { instance: number, value: number }[] }[]) {
        return {
            "request": {
                "url": `^/pmapi/${context}/fetch$`,
                "params": {
                    "names": metrics.map(metric => metric.name).join(',')
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": context,
                    "timestamp": timestamp,
                    "values": metrics.map(metric => ({
                        "pmid": "2.0.4",
                        "name": metric.name,
                        "instances": metric.instances
                    }))
                }
            }
        };
    }

    static kernelAllSysfork = {
        metric: {
            "request": {
                "url": "^/pmapi/1/metric$",
                "params": {
                    "names": "kernel.all.sysfork"
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": 1,
                    "metrics": [
                        {
                            "name": "kernel.all.sysfork",
                            "series": "73d93ee9efa086923d0c9eabc96f98f2b583b8f2",
                            "pmid": "60.0.14",
                            "type": "u64",
                            "sem": "counter",
                            "units": "count",
                            "labels": {
                                "agent": "linux",
                                "domainname": "localdomain",
                                "hostname": "test-vm",
                                "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                            },
                            "text-oneline": "fork rate metric from /proc/stat",
                            "text-help": "fork rate metric from /proc/stat"
                        }
                    ]
                }
            }
        },
        fetch: (timestamp: number, value: number) => ({
            "request": {
                "url": "^/pmapi/1/fetch$",
                "params": {
                    "names": "kernel.all.sysfork"
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": 1,
                    "timestamp": timestamp,
                    "values": [
                        {
                            "pmid": "60.0.14",
                            "name": "kernel.all.sysfork",
                            "instances": [
                                {
                                    "instance": null,
                                    "value": value
                                }
                            ]
                        }
                    ]
                }
            }
        })
    };

    static kernelAllLoad = {
        metric: {
            "request": {
                "url": "^/pmapi/1/metric$",
                "params": {
                    "names": "kernel.all.load"
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": 1,
                    "metrics": [
                        {
                            "name": "kernel.all.load",
                            "series": "60d21f404778d85d15fbdc08bcf2651c18784f3f",
                            "pmid": "60.2.0",
                            "indom": "60.2",
                            "type": "float",
                            "sem": "instant",
                            "units": "none",
                            "labels": {
                                "agent": "linux",
                                "domainname": "localdomain",
                                "hostname": "test-vm",
                                "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                            },
                            "text-oneline": "1, 5 and 15 minute load average",
                            "text-help": "1, 5 and 15 minute load average"
                        }
                    ]
                }
            }
        },
        indom: {
            "request": {
                "url": "^/pmapi/1/indom$",
                "params": {
                    "name": "kernel.all.load"
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": 1,
                    "indom": "60.2",
                    "labels": {
                        "domainname": "localdomain",
                        "hostname": "test-vm",
                        "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                    },
                    "text-oneline": "load averages for 1, 5, and 15 minutes",
                    "text-help": "load averages for 1, 5, and 15 minutes",
                    "instances": [
                        {
                            "instance": 15,
                            "name": "15 minute",
                            "labels": {
                                "domainname": "localdomain",
                                "hostname": "test-vm",
                                "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                            }
                        },
                        {
                            "instance": 5,
                            "name": "5 minute",
                            "labels": {
                                "domainname": "localdomain",
                                "hostname": "test-vm",
                                "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                            }
                        },
                        {
                            "instance": 1,
                            "name": "1 minute",
                            "labels": {
                                "domainname": "localdomain",
                                "hostname": "test-vm",
                                "machineid": "6dabb302d60b402dabcc13dc4fd0fab8"
                            }
                        }
                    ]
                }
            }
        },
        fetch: {
            "request": {
                "url": "^/pmapi/1/fetch$",
                "params": {
                    "names": "kernel.all.load"
                }
            },
            "response": {
                "status": 200,
                "data": {
                    "context": 797135300,
                    "timestamp": 10,
                    "values": [
                        {
                            "pmid": "60.2.0",
                            "name": "kernel.all.load",
                            "instances": [
                                {
                                    "instance": 1,
                                    "value": 11
                                },
                                {
                                    "instance": 5,
                                    "value": 12
                                },
                                {
                                    "instance": 15,
                                    "value": 13
                                }
                            ]
                        }
                    ]
                }
            }
        }
    };
}
